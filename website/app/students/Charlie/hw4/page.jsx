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

export default function CharlieHw4Page() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();
  const [activeNotes, setActiveNotes] = useState(new Set());

  // Musical scale for quantization (C Major)
  const majorScale = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
  const baseOctave = 4; // Start from octave 4

  // Function to quantize a note to the nearest scale note
  const quantizeToScale = (note) => {
    const octave = Math.floor(note / 12);
    const noteInOctave = note % 12;
    
    // Find the closest scale note
    let closestScaleNote = majorScale[0];
    let minDistance = Math.abs(noteInOctave - majorScale[0]);
    
    for (const scaleNote of majorScale) {
      const distance = Math.abs(noteInOctave - scaleNote);
      if (distance < minDistance) {
        minDistance = distance;
        closestScaleNote = scaleNote;
      }
    }
    
    return octave * 12 + closestScaleNote;
  };

  // Function to create a 3-note chord
  const createChord = (rootNote) => {
    const quantizedRoot = quantizeToScale(rootNote);
    return [
      quantizedRoot,           // Root
      quantizedRoot + 4,       // Third (major third)
      quantizedRoot + 7        // Fifth
    ];
  };

  // Forward NoteOn and NoteOff messages with chord effect
  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      
      // Add original note to active notes
      setActiveNotes(prev => new Set(prev).add(note));
      
      // Create chord from the input note
      const chord = createChord(note);
      
      // Send all chord notes
      for (const chordNote of chord) {
        selectedOutput.send(MidiMessage.noteOn(chordNote, velocity, channel));
      }
      
      // Add delay and send the note+7 as specified in assignment
      await pause(500);
      const delayedNote = quantizeToScale(note + 7);
      selectedOutput.send(MidiMessage.noteOn(delayedNote, velocity, channel));
      setActiveNotes(prev => new Set(prev).add(delayedNote));
    },
    noteOff: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      
      // Remove original note from active notes
      setActiveNotes(prev => { 
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      
      // Create chord from the input note
      const chord = createChord(note);
      
      // Send note-off for all chord notes
      for (const chordNote of chord) {
        selectedOutput.send(MidiMessage.noteOff(chordNote, velocity, channel));
      }
      
      // Add delay and send note-off for the note+7
      await pause(500);
      const delayedNote = quantizeToScale(note + 7);
      selectedOutput.send(MidiMessage.noteOff(delayedNote, velocity, channel));
      setActiveNotes(prev => { 
        const newSet = new Set(prev);
        newSet.delete(delayedNote);
        return newSet;
      });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Charlie's Assignment 4: Musical MIDI Chord Effect</h1>
        <p>
          This MIDI effect creates beautiful 3-note chords from every input note, 
          with all notes quantized to the C Major scale for musical harmony.
        </p>
        <p>
          <strong>Features:</strong>
        </p>
        <ul>
          <li>• Each input note triggers a 3-note chord (root, third, fifth)</li>
          <li>• All notes are quantized to C Major scale for musical coherence</li>
          <li>• Delayed note+7 effect as specified in the assignment</li>
          <li>• Proper note-on/note-off lifecycle management</li>
        </ul>
        <p className="text-rose-700">Be careful not to create a feedback loop!</p>
        <div className="">
          <div>
            <span className="inline-block w-18">Input:</span>
            <MidiInputSelector />
          </div>
          <div>
            <span className="inline-block w-18">Output:</span>
            <MidiOutputSelector />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div className="mt-2">
          <span className="inline-block w-18">Active Notes:</span>
          <span className="text-sm text-gray-500">
            {Array.from(activeNotes).join(", ")}
          </span>
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}

function pause(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
