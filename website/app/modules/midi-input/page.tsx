"use client";

import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";
import MIDIReceiveLog from "@/components/MidiReceiveLog";

import { MidiInputSelector, useMidiContext } from "@/components/midi";

export default function MidiInputPage() {
  const { error } = useMidiContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>MIDI Input</h1>
        <p>Hers is an example of using MIDI Input</p>

        <div className="flex items-center gap-4 mb-3">
          <MidiInputSelector />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div>
          <MIDIReceiveLog />
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}
