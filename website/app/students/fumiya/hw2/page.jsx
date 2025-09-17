'use client'

import { useState } from 'react'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

export default function MidiPage() {
  const { error } = useMidiContext();
  const [isMouseDown, setIsMouseDown] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div
        className={styles.markdownContent}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
      >
        <h1>Fumiya's MIDI Grid Controller</h1>
        <p>Select a MIDI output and play notes using the grid below.</p>

        <div className="mb-4">
          <MidiOutputSelector />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <NoteButton noteNumber={48} isMouseDown={isMouseDown} /> {/* C3 */}
          <NoteButton noteNumber={50} isMouseDown={isMouseDown} /> {/* D3 */}
          <NoteButton noteNumber={51} isMouseDown={isMouseDown} /> {/* Eb3 */}
          <NoteButton noteNumber={53} isMouseDown={isMouseDown} /> {/* F3 */}
          <NoteButton noteNumber={55} isMouseDown={isMouseDown} /> {/* G3 */}
          <NoteButton noteNumber={56} isMouseDown={isMouseDown} /> {/* Ab3 */}
          <NoteButton noteNumber={58} isMouseDown={isMouseDown} /> {/* Bb3 */}
          <NoteButton noteNumber={60} isMouseDown={isMouseDown} /> {/* C4 */}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

const NOTE_ON = 0x90
const NOTE_OFF = 0x80

const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

function midiToNoteName(midiNumber) {
  const octave = Math.floor(midiNumber / 12) - 1;
  const noteIndex = midiNumber % 12;
  return NOTE_NAMES[noteIndex] + octave;
}

function NoteButton({ noteNumber = 48, isMouseDown }) { // Default to C3
  const { selectedOutput } = useMidiOutputSelection();

  function sendNoteOn() {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_ON, noteNumber, 127]);
  }

  function sendNoteOff() {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_OFF, noteNumber, 0]);
  }

  function handleMouseEnter() {
    if (isMouseDown) {
      sendNoteOn();
    }
  }

  return <button
    onMouseDown={sendNoteOn}
    onMouseUp={sendNoteOff}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={sendNoteOff}
    disabled={!selectedOutput}
    className="aspect-square text-white bg-slate-700 rounded-lg hover:bg-slate-600 active:bg-slate-800 disabled:opacity-50 cursor-pointer flex items-center justify-center"
  >
    <span className="text-lg font-bold">{midiToNoteName(noteNumber)}</span>
  </button>
}