'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'
import PrettyJsObject from '@/components/PrettyJsObject'

export default function JSPlaygroundPage() {
  const notes = [60, 64, 67];

  const chord = {
    root: "C",
    quality: chordQuality(notes),
    notes: notes,
  };

  const output = chord;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>JavaScript Playground</h1>
        <p>Open the source code for this page in your code editor.</p>
        <p>Try updating the JavaScript that generates the output object below.</p>
        <h2>Output</h2>
        <PrettyJsObject object={output} />
        <h1>Hands On</h1>
        <ol>
          <li>Complete the <code>chordQuality</code> function to determine the quality of the chord.</li>
          <li>Do you understand the generated code? Use Gemini to explain it to you.</li>
        </ol>
        <ModuleFooter />
      </div>
    </div>
  )
}

/**
 * Convert a MIDI note number (61) to a pitch class name ("C#")
 * @param {number} midiNoteNumber 
 * @param {boolean} useFlat 
 * @returns {string} the name of the pitch class
 */
function pitchClassName(midiNoteNumber, useFlat = false) {
  const pitchClasses = useFlat
    ? ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
    : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteIndex = midiNoteNumber % 12;
  return pitchClasses[noteIndex];
}

/**
 * Convert a MIDI note number to a note name
 * @param {number} midiNoteNumber 
 * @returns {string} the name of the note
 */
function noteName(midiNoteNumber, useFlat = false) {
  const pitchClass = pitchClassName(midiNoteNumber, useFlat);
  const octave = Math.floor(midiNoteNumber / 12) - 1;
  return pitchClass + octave;
}

/**
 * Determine the quality of a chord from an array of MIDI note numbers
 * @param {number[]} notes 
 * @returns {string} the quality of the chord
 */


function chordQuality(notes) {
 
  const root = notes[0]; 
  const third = notes[1] - root;
  const fifth = notes[2] - root;
  if (third === 4 && fifth === 7) {
    return "major";
  } else if (third === 3 && fifth === 7) {
    return "minor";
  } else if (third === 3 && fifth === 6) {
    return "diminished";
  } else if (third === 4 && fifth === 8) {
    return "augmented";
  } else {
    return "unknown";
  }
}