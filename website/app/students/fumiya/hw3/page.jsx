'use client'

import { useState, useCallback } from 'react'
import styles from '@/app/[...markdown]/markdown.module.css'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

export default function MidiPage() {
  const { error } = useMidiContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div
        className={styles.markdownContent}
      >
        <h1>Fumiya's MIDI Grid Controller</h1>
        <p>Select a MIDI output and play notes using the grid below.</p>

        <div className="mb-4">
          <MidiOutputSelector />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
          <ChordPlayer />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

const NOTE_ON = 0x90
const NOTE_OFF = 0x80

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const CHORD_QUALITIES = {
  maj7: "Major 7th",
  min7: "Minor 7th",
  dom7: "Dominant 7th",
  min7b5: "Half-Diminished (m7♭5)",
  augmaj7: "Augmented Major 7th"
};
/**
 * Builds a seventh chord from a root note and quality.
 * @param {number} root - The MIDI note number for the root of the chord.
 * @param {'maj7' | 'min7' | 'dom7' | 'min7b5' | 'augmaj7'} quality - The quality of the seventh chord.
 * @returns {number[]} An array of MIDI note numbers representing the chord.
 */
function buildSeventh(root, quality) {
  const intervals = {
    maj7: [0, 4, 7, 11], 
    min7: [0, 3, 7, 10], 
    dom7: [0, 4, 7, 10], 
    min7b5: [0, 3, 6, 10], 
    augmaj7: [0, 4, 8, 11], 
  };

  if (!intervals[quality]) {
    return [root]; // Return just the root if quality is unknown
  }

  return intervals[quality].map(intervals => root + intervals);
}
/**
 * Applies different voicings to a chord.
 * @param {number[]} notes - An array of MIDI note numbers for the chord in root position.
 * @param {'close' | '1st' | '2nd' | 'open' | 'drop2'} voicing - The voicing to apply.
 * @returns {number[]} An array of MIDI note numbers with the new voicing.
 */
function applyVoicing(notes, voicing) {
  if (notes.length < 3) return notes; // Voicings need at least 3 notes

  const reorder = (arr, from, to) => {
    const newArr = [...arr];
    const [item] = newArr.splice(from, 1);
    newArr.splice(to, 0, item);
    return newArr;
  };

  switch (voicing) {
    case '1st': { // 1st Inversion
      const newNotes = [...notes];
      newNotes[0] += 12; // Move root up an octave
      return reorder(newNotes, 0, newNotes.length - 1); // Move to the end to sort it
    }
    case '2nd': { // 2nd Inversion
      const newNotes = [...notes];
      newNotes[0] += 12;
      newNotes[1] += 12;
      return reorder(reorder(newNotes, 1, newNotes.length - 1), 0, newNotes.length - 2);
    }
    case 'open': { // Open voicing (e.g., Root, 5th, 3rd+octave, 7th+octave)
      const newNotes = [...notes];
      if (newNotes.length > 1) newNotes[1] += 12; // Move 3rd up an octave
      if (newNotes.length > 3) newNotes[3] += 12; // Move 7th up an octave
      return newNotes;
    }
    case 'drop2': { // Drop 2 voicing
      const newNotes = [...notes];
      if (newNotes.length > 1) newNotes[newNotes.length - 2] -= 12; // Drop the 2nd highest note by an octave
      return newNotes.sort((a, b) => a - b); // Re-sort notes after dropping
    }
    case 'close':
    default:
      return notes; // Default root position
  }
}

function ChordPlayer() {
  const { selectedOutput } = useMidiOutputSelection();
  const [noteIndex, setNoteIndex] = useState(0); // 0 = C
  const [octave, setOctave] = useState(3); // Default to octave 3
  const [quality, setQuality] = useState('maj7'); // Default to Major 7th
  const [performanceMode, setPerformanceMode] = useState('chord'); // 'chord', 'strum', 'arp-up', etc.
  const [voicing, setVoicing] = useState('close'); // 'close', 'open', 'drop2', etc.

  // Calculate the final MIDI root note based on note index and octave
  const rootNote = noteIndex + (octave + 1) * 12;

  const handleNoteChange = (e) => {
    setNoteIndex(parseInt(e.target.value, 10));
  };

  const handleOctaveChange = (e) => {
    setOctave(parseInt(e.target.value, 10));
  };

  const playChord = useCallback(() => {
    if (!selectedOutput || rootNote < 0 || rootNote > 127) return;

    const rootPositionNotes = buildSeventh(rootNote, quality);
    let notes = applyVoicing(rootPositionNotes, voicing);
    const noteDuration = 150; // ms for each note in arpeggio
    const strumDelay = 25; // ms between each note in a strum

    const playNote = (note, delay, duration) => {
      setTimeout(() => selectedOutput.send([NOTE_ON, note, 127]), delay);
      setTimeout(() => selectedOutput.send([NOTE_OFF, note, 0]), delay + duration);
    };

    switch (performanceMode) {
      case 'strum':
        notes.forEach((note, index) => {
          playNote(note, index * strumDelay, 500); // Strum lasts 500ms total
        });
        break;

      case 'arp-up':
        notes.forEach((note, index) => {
          playNote(note, index * noteDuration, noteDuration);
        });
        break;

      case 'arp-down':
        [...notes].reverse().forEach((note, index) => {
          playNote(note, index * noteDuration, noteDuration);
        });
        break;

      case 'arp-random':
        [...notes].sort(() => Math.random() - 0.5).forEach((note, index) => {
          playNote(note, index * noteDuration, noteDuration);
        });
        break;

      case 'chord':
      default:
        // Send Note On for all notes at once
        notes.forEach(note => {
          selectedOutput.send([NOTE_ON, note, 127]);
        });
        // Schedule Note Off for all notes after a delay
        setTimeout(() => {
          notes.forEach(note => {
            selectedOutput.send([NOTE_OFF, note, 0]);
          });
        }, 500);
        break;
    }
  }, [selectedOutput, rootNote, quality, performanceMode, voicing]);

  return (
    <div className="p-4 border rounded-lg bg-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Root Note Selector */}
        <div>
          <label htmlFor="root-note-select" className="block text-sm font-medium text-slate-300 mb-1">Root Note</label>
          <select
            id="root-note-select"
            value={noteIndex}
            onChange={handleNoteChange}
            className="w-full p-2 rounded-md bg-slate-700 text-white border-slate-600"
          >
            {NOTE_NAMES.map((noteName, index) => (
              <option key={noteName} value={index}>{noteName}</option>
            ))}
          </select>
        </div>

        {/* Octave Selector */}
        <div>
          <label htmlFor="octave-select" className="block text-sm font-medium text-slate-300 mb-1">Octave</label>
          <select
            id="octave-select"
            value={octave}
            onChange={handleOctaveChange}
            className="w-full p-2 rounded-md bg-slate-700 text-white border-slate-600"
          >
            {/* Generating octaves from -1 to 9 */}
            {Array.from({ length: 11 }, (_, i) => i - 1).map(oct => (
              <option key={oct} value={oct}>{oct}</option>
            ))}
          </select>
        </div>

        {/* Chord Quality Selector */}
        <div>
          <label htmlFor="quality-select" className="block text-sm font-medium text-slate-300 mb-1">Chord Quality</label>
          <select
            id="quality-select"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white border-slate-600"
          >
            {Object.entries(CHORD_QUALITIES).map(([value, name]) => (
              <option key={value} value={value}>{name}</option>
            ))}
          </select>
        </div>

        {/* Performance Mode Selector */}
        <div>
          <label htmlFor="performance-select" className="block text-sm font-medium text-slate-300 mb-1">Performance</label>
          <select
            id="performance-select"
            value={performanceMode}
            onChange={(e) => setPerformanceMode(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white border-slate-600"
          >
            <option value="chord">Chord</option>
            <option value="strum">Strum</option>
            <option value="arp-up">Arp Up</option>
            <option value="arp-down">Arp Down</option>
            <option value="arp-random">Arp Random</option>
          </select>
        </div>

        {/* Voicing Selector */}
        <div>
          <label htmlFor="voicing-select" className="block text-sm font-medium text-slate-300 mb-1">Voicing</label>
          <select
            id="voicing-select"
            value={voicing}
            onChange={(e) => setVoicing(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white border-slate-600"
          >
            <option value="close">Close (Root)</option>
            <option value="1st">1st Inversion</option>
            <option value="2nd">2nd Inversion</option>
            <option value="open">Open</option>
            <option value="drop2">Drop 2</option>
          </select>
        </div>
      </div>

      {/* Play Button */}
      <button
        onClick={playChord}
        disabled={!selectedOutput}
        className="w-full text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 cursor-pointer flex items-center justify-center p-4"
      >
        <span className="text-lg font-bold">Play Chord</span>
      </button>
    </div>
  );
}

//The "Play Chord" button is wired to trigger the playChord function, which orchestrates the entire process, including Chord Calculation, performance logic, and sending the messages. The midi messages will be sent to the MIDI device, the user has selected from the dropdown menue.