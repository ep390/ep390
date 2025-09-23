'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector,
  MidiMessage
} from '@/components/midi'

export default function MidiPage() {
  const { error } = useMidiContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Send MIDI Messages</h1>
        <p>Did you know that web pages can send and receive MIDI?</p>
        <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API#browser_compatibility">Not all web browsers support MIDI</a>. Chrome tends to work best. Firefox also works. Safari does not.</p>
        <p>See Below for a minmial example of sending a MIDI note from the browser.</p>

        <div className="flex items-center gap-4 mb-3">
          <MidiOutputSelector />
          <NoteButton />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <ModuleFooter />
      </div>
    </div>
  )
}

function NoteButton() {
  const { selectedOutput } = useMidiOutputSelection();
  const noteNumber = 48 // C3 

  function sendNoteOn() {
    if (!selectedOutput) return;
    const message = MidiMessage.noteOn(noteNumber, 127);
    selectedOutput.send(message);
  }

  function sendNoteOff() {
    if (!selectedOutput) return;
    const message = MidiMessage.noteOff(noteNumber, 0);
    selectedOutput.send(message);
  }

  function playNote() {
    sendNoteOn();
    setTimeout(() => sendNoteOff(), 1000);
  }

  return <button
    onClick={playNote}
    disabled={!selectedOutput}
    className="px-4 py-2 text-white bg-green-600 rounded-lg active:bg-green-700 disabled:opacity-50 cursor-pointer"
  >
    Play Note {noteNumber}
  </button>
}