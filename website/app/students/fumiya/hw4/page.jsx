"use client";

import { useState } from "react";
import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";

import {
  MidiInputSelector,
  MidiOutputSelector,
  MidiMessage,
  useMidiOutputSelection,
  useMidiContext,
  useMidiHandlers,
} from "@/components/midi";

/**
 * Generates all 12 major and 12 minor scales.
 * @returns {Object} An object where keys are scale identifiers and values are scale info.
 */
function generateAllScales() {
  const scales = {};
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10];

  for (let i = 0; i < 12; i++) {
    // Generate Major Scale
    const majorKey = `${noteNames[i]}_major`;
    scales[majorKey] = {
      name: `${noteNames[i]} Major`,
      notes: majorIntervals.map(interval => (i + interval) % 12),
    };
    // Generate Minor Scale
    const minorKey = `${noteNames[i]}_minor`;
    scales[minorKey] = {
      name: `${noteNames[i]} Minor`,
      notes: minorIntervals.map(interval => (i + interval) % 12),
    };
  }
  return scales;
}

const SCALES = generateAllScales();

/**
 * Adjusts a MIDI note to the nearest note below it that is in the specified scale.
 * @param {number} note - The MIDI note number.
 * @param {number[]} scale - An array of note numbers (0-11) representing the scale.
 * @returns {number} The conformed MIDI note number.
 */
function conformToScale(note, scale) {
  let conformedNote = note;
  // While the current note's pitch class is not in the scale, decrement it.
  while (!scale.includes(conformedNote % 12)) {
    conformedNote--;
  }
  return conformedNote;
}

export default function MidiIoPage() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [voicing, setVoicing] = useState("root"); // 'root', 'first', 'second', 'third', 'open'
  const [scaleKey, setScaleKey] = useState("C_major");

  const strumDelay = 50; // Delay in milliseconds

  const getChordNotes = (note) => {
    const intervals = {
      root: [0, 4, 7, 11], // R, M3, P5, M7
      first: [4, 7, 11, 12], // M3, P5, M7, R+8va
      second: [7, 11, 12, 16], // P5, M7, R+8va, M3+8va
      third: [11, 12, 16, 19], // M7, R+8va, M3+8va, P5+8va
      open: [0, 7, 16, 23], // R, P5, M3+8va, M7+8va
    };

    const selectedScale = SCALES[scaleKey].notes;
    const selectedIntervals = intervals[voicing] || intervals.root;
    return selectedIntervals.map(interval => conformToScale(note + interval, selectedScale));
  };

  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => new Set(prev).add(note));

      const selectedScale = SCALES[scaleKey].notes;
      const isNoteInScale = selectedScale.includes(note % 12);
      let chordNotes;

      if (isNoteInScale) {
        chordNotes = getChordNotes(note);
      } else {
        // If the note is not in the scale, play a dominant 7th chord from that note
        const dominantIntervals = [0, 4, 7, 10]; // R, M3, P5, m7
        chordNotes = dominantIntervals.map(interval => note + interval);
      }

      for (const chordNote of chordNotes) {
        selectedOutput.send(MidiMessage.noteOn(chordNote, velocity, channel));
        await pause(strumDelay);
      }
    },
    noteOff: (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => { prev.delete(note); return new Set(prev) });

      const selectedScale = SCALES[scaleKey].notes;
      const isNoteInScale = selectedScale.includes(note % 12);

      const notesToTurnOff = isNoteInScale ? getChordNotes(note) : [0, 4, 7, 10].map(i => note + i);

      for (const chordNote of notesToTurnOff) {
        selectedOutput.send(MidiMessage.noteOff(chordNote, velocity, channel));
      }
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>MIDI Input & Output</h1>
        <p>
          This will play a chord for each incoming note. Notes within the selected
          key will generate scale-conformed chords based on the voicing. Notes
          outside the key will trigger a dominant 7th chord.
        </p>
        <p className="text-rose-700">Be careful not to create a feedback loop!</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-18">Input:</span>
            <MidiInputSelector />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-18">Output:</span>
            <MidiOutputSelector />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="scale-selector" className="inline-block w-18">Key:</label>
            <select
              id="scale-selector"
              value={scaleKey}
              onChange={(e) => setScaleKey(e.target.value)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400"
            >
              {Object.entries(SCALES).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="voicing-selector" className="inline-block w-18">Voicing:</label>
            <select
              id="voicing-selector"
              value={voicing}
              onChange={(e) => setVoicing(e.target.value)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-400"
            >
              <option value="root">Root Position</option>
              <option value="first">1st Inversion</option>
              <option value="second">2nd Inversion</option>
              <option value="third">3rd Inversion</option>
              <option value="open">Open Voicing</option>
            </select>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div className="mt-2">
          <span className="inline-block w-18">Notes In:</span>
          <span className="text-sm text-gray-500">
            {Array.from(activeNotes).join(", ")}
          </span>
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}

/**
 * Pauses execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to pause.
 * @returns {Promise<void>}
 */
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
