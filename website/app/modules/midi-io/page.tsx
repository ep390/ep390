"use client";

import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";
import MIDIReceiveLog from "@/components/MidiReceiveLog";

import {
  MidiInputSelector,
  useMidiContext,
  MidiOutputSelector,
  useMidiOutputSelection,
  MidiMessage,
  useMidiHandlers,
} from "@/components/midi";

export default function MidiInputPage() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();

  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      selectedOutput.send(MidiMessage.noteOn(note, velocity, channel));
    },
    noteOff: async (note, velocity, channel) => {
      if (!selectedOutput) return;
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
            <span className="inline-block w-16">Input:</span>
            <MidiInputSelector />
          </div>
          <div>
            <span className="inline-block w-16">Output:</span>
            <MidiOutputSelector />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div>
          <MIDIReceiveLog />
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}

function pause(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
