"use client";

import { useState } from "react";

import { useMidiHandlers } from "@/components/midi";

export default function MIDIReceiveLog() {
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
      <div className="relative">
        <div className="mb-3 border border-gray-300 rounded-md p-2 h-[300px] overflow-y-auto text-gray-600">
          {received.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <button
          className="absolute bottom-3 right-3 rounded-md bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-300 active:bg-zinc-400"
          onClick={() => setReceived([])}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
