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

export default function MidiIoPage() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();
  const [activeNotes, setActiveNotes] = useState(new Set());

  // Forward NoteOn and NoteOff messages from the input to the output
  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => new Set(prev).add(note));
      selectedOutput.send(MidiMessage.noteOn(note, velocity, channel));
    },
    noteOff: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      setActiveNotes(prev => { prev.delete(note); return new Set(prev) });
      selectedOutput.send(MidiMessage.noteOff(note, velocity, channel));
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>MIDI Input & Output</h1>
        <p>
          This will forward ONLY NoteOn and NoteOff messages from the input to
          the output.
        </p>
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

function pause(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
