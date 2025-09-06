'use client'

import styles from '@/app/[...markdown]/markdown.module.css'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

const NOTE_ON = 0x90
const NOTE_OFF = 0x80

export default function MidiPage() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();

  const sendNoteOn = () => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_ON, 48, 127]);
  }

  const sendNoteOff = () => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_OFF, 48, 0]);
  }

  const playNote = () => {
    sendNoteOn();
    setTimeout(() => sendNoteOff(), 1000);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>MIDI</h1>
        <p>Did you know that web pages can send and receive MIDI?</p>
        <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API#browser_compatibility">Not all web browsers support MIDI</a>. Chrome tends to work best. Firefox also works. Safari does not.</p>
        <p>See Below for a minmial example of sending a MIDI note from the browser.</p>

        <div className="flex items-center gap-4 mb-3">
          <MidiOutputSelector />
          <button
            onClick={playNote}
            disabled={!selectedOutput}
            className="px-4 py-2 text-white bg-green-600 rounded-lg active:bg-green-700 disabled:opacity-50 cursor-pointer"
          >
            Send C3 Note
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}
