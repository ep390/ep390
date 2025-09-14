"use client";

import { useState } from "react";
import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";

import {
  MidiInputSelector,
  useMidiContext,
  useMidiHandlers,
} from "@/components/midi";

export default function MidiInputPage() {
  const { error } = useMidiContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>MIDI Input</h1>
        <p>Hers is an example of using MIDI Input</p>

        <div className="flex items-center gap-4 mb-3">
          <MidiInputSelector />
        </div>
        <div>
          <MIDIReceiveLog />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <ModuleFooter />
      </div>
    </div>
  );
}

function MIDIReceiveLog() {
  
  const [received, setReceived] = useState<string[]>([]);
  const [clockCount, setClockCount] = useState(0);

  function prepend(message: string) {
    setReceived((prev) => [message, ...prev]);
  }

  useMidiHandlers({
    noteOn: (note, velocity, channel) => {
      prepend(`Note On: ${note}, ${velocity}, ${channel}`);
    },
    noteOff: (note, velocity, channel) => {
      prepend(`Note Off: ${note}, ${velocity}, ${channel}`);
    },
    channelPressure: (value, channel) => {
      prepend(`Channel Pressure: ${value}, ${channel}`);
    },
    clock: () => {
      setClockCount((prev) => prev + 1);
    },
    start: () => {
      setClockCount(0);
      prepend(`Start`);
    },
    stop: () => {
      prepend(`Stop`);
    },
    continue: () => {
      setClockCount(0);
      prepend(`Continue`);
    },
    songPosition: (value) => {
      prepend(`Song Position (8th notes): ${value}`);
    },
    cc(controllerNumber, value, channel) {
      console.log(`CC: ${controllerNumber}, ${value}, ${channel}`);
    },
    pitchBend: (value, channel) => {
      console.log(`Pitch Bend: ${value}, ${channel}`);
    },
  });

  return (
    <div>
      <h2>Received Messages</h2>
      <div className="mb-3">Clock (24x per quarter note): {clockCount}</div>
      <div className="mb-3 border border-gray-300 rounded-md p-2 h-[300px] overflow-y-auto text-gray-600">
        {received.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
