'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'
import PrettyJsObject from '@/components/PrettyJsObject'

export default function JSPlaygroundPage() {
  const notes = [60, 63, 67];

  const exampleObject = {
    name: "Alice",
    chord: notes,
    firstNote: notes[0],
  };

  const output = exampleObject;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>JavaScript Playground</h1>
        <p>
          Find the code for this page in your text editor. Try changing the
          <code>output</code> object and review the output.
        </p>
        <h2>Output</h2>
        <PrettyJsObject value={output} />
        <ModuleFooter />
      </div>
    </div>
  )
}

/**
 * Convert a MIDI note number to a note name
 * @param {number} midiNoteNumber 
 * @returns {string} the name of the note
 */
function noteName(midiNoteNumber, useFlat = false) {
  const noteNames = useFlat 
    ? ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] 
    : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midiNoteNumber / 12) - 1;
  const noteIndex = midiNoteNumber % 12;
  return noteNames[noteIndex] + octave;
}