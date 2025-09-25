"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
  createContext,
} from "react";

export function useMidiPermissionStatus() {
  const [midiPermission, setMidiPermission] = useState<
    "unknown" | "unsupported" | "granted" | "denied" | "prompt"
  >("unknown");

  useEffect(() => {
    let isMounted = true;
    let permissionStatus: PermissionStatus | null = null;

    const handleChange = () => {
      if (!isMounted || !permissionStatus) return;
      setMidiPermission(permissionStatus.state);
    };

    const checkMidiPermission = async () => {
      if (!("permissions" in navigator)) {
        setMidiPermission("unsupported");
        return;
      }
      try {
        permissionStatus = await navigator.permissions.query({ name: "midi" });
        if (!isMounted) return;
        setMidiPermission(permissionStatus.state);
        permissionStatus.addEventListener("change", handleChange);
      } catch {
        if (!isMounted) return;
        setMidiPermission("unsupported");
      }
    };

    checkMidiPermission();

    return () => {
      isMounted = false;
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handleChange);
      }
    };
  }, []);

  return midiPermission;
}

/**
 * Hook to request and hold a Web MIDI access object. Returns the current access
 * object (or null), any error message, and a request function that must be
 * called from a user gesture to obtain access.
 */
export function useMidiAccess() {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  const [outputs, setOutputs] = useState<MIDIOutput[]>([]);

  const enable = useCallback(async () => {
    try {
      if (navigator && navigator.requestMIDIAccess) {
        const access = await navigator.requestMIDIAccess({ sysex: false });
        setMidiAccess(access);
        setError(null);
        setInputs(Array.from(access.inputs.values()));
        setOutputs(Array.from(access.outputs.values()));
      } else {
        setError("Web MIDI API is not supported in this browser.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`MIDI Access Error: ${message}`);
    }
  }, []);

  useEffect(() => {
    if (!midiAccess) return;
    // Initialize from current access maps
    setInputs(Array.from(midiAccess.inputs.values()));
    setOutputs(Array.from(midiAccess.outputs.values()));

    const handler = () => {
      setInputs(Array.from(midiAccess.inputs.values()));
      setOutputs(Array.from(midiAccess.outputs.values()));
    };
    midiAccess.addEventListener("statechange", handler);
    return () => {
      midiAccess.removeEventListener("statechange", handler);
    };
  }, [midiAccess]);

  const value = useMemo(
    () => ({ midiAccess, inputs, outputs, error, enable }),
    [midiAccess, inputs, outputs, error, enable]
  );
  return value;
}


const MidiContext = createContext<{
  midiAccess: MIDIAccess | null;
  inputs: MIDIInput[];
  outputs: MIDIOutput[];
  error: string | null;
  enable: () => void;
} | null>(null);

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const midiData = useMidiAccess();

  return (
    <MidiContext.Provider value={midiData}>{children}</MidiContext.Provider>
  );
}

export function useMidiContext() {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error(
      "useMidiContext must be used within a MidiProvider. Make sure you have"
    );
  }
  return context;
}

const MidiInputSelectionContext = createContext<{
  selectedInput: MIDIInput | null;
  selectedInputId: string | null;
  selectInput: (id: string | null) => void;
} | null>(null);

const MidiOutputSelectionContext = createContext<{
  selectedOutput: MIDIOutput | null;
  selectedOutputId: string | null;
  selectOutput: (id: string | null) => void;
} | null>(null);

export function MidiInputSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { inputs } = useMidiContext();
  const [selectedInputId, setSelectedInputId] = useState<string | null>(null);

  // Choose/restore selection when inputs change
  useEffect(() => {
    if (!inputs || inputs.length === 0) {
      return;
    }
    // If we already have a selection, keep it as-is
    if (selectedInputId !== null) return;
    // Try to restore from localStorage
    let restored: string | null = null;
    try {
      if (typeof window !== "undefined") {
        restored = localStorage.getItem("selectedMidiInputId");
      }
    } catch {}
    if (restored && inputs.some((i) => i.id === restored)) {
      setSelectedInputId(restored);
      return;
    }
    // Fallback to first available input
    setSelectedInputId(inputs[0].id);
  }, [inputs, selectedInputId]);

  const selectedInput = useMemo(() => {
    if (!inputs || inputs.length === 0 || !selectedInputId) return null;
    return inputs.find((i) => i.id === selectedInputId) || null;
  }, [inputs, selectedInputId]);

  const selectInput = useCallback((id: string | null) => {
    setSelectedInputId(id || null);
    try {
      if (typeof window !== "undefined") {
        if (id) localStorage.setItem("selectedMidiInputId", id);
        else localStorage.removeItem("selectedMidiInputId");
      }
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      selectedInput,
      selectedInputId,
      selectInput,
    }),
    [selectedInput, selectedInputId, selectInput]
  );

  return (
    <MidiInputSelectionContext.Provider value={value}>
      {children}
    </MidiInputSelectionContext.Provider>
  );
}

export function MidiOutputSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { outputs } = useMidiContext();
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);

  // Choose/restore selection when outputs change
  useEffect(() => {
    if (!outputs || outputs.length === 0) {
      return;
    }
    // If we already have a selection, keep it as-is
    if (selectedOutputId !== null) return;
    // Try to restore from localStorage
    let restored: string | null = null;
    try {
      if (typeof window !== "undefined") {
        restored = localStorage.getItem("selectedMidiOutputId");
      }
    } catch {}
    if (restored && outputs.some((o) => o.id === restored)) {
      setSelectedOutputId(restored);
      return;
    }
    // Fallback to first available output
    setSelectedOutputId(outputs[0].id);
  }, [outputs, selectedOutputId]);

  const selectedOutput = useMemo(() => {
    if (!outputs || outputs.length === 0 || !selectedOutputId) return null;
    return outputs.find((o) => o.id === selectedOutputId) || null;
  }, [outputs, selectedOutputId]);

  const selectOutput = useCallback((id: string | null) => {
    setSelectedOutputId(id || null);
    try {
      if (typeof window !== "undefined") {
        if (id) localStorage.setItem("selectedMidiOutputId", id);
        else localStorage.removeItem("selectedMidiOutputId");
      }
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      selectedOutput,
      selectedOutputId,
      selectOutput,
    }),
    [selectedOutput, selectedOutputId, selectOutput]
  );

  return (
    <MidiOutputSelectionContext.Provider value={value}>
      {children}
    </MidiOutputSelectionContext.Provider>
  );
}

export function useMidiInputSelection() {
  const context = useContext(MidiInputSelectionContext);
  if (!context) {
    throw new Error(
      "useMidiInputSelection must be used within a MidiInputSelectionProvider"
    );
  }
  return context;
}

export function useMidiOutputSelection() {
  const context = useContext(MidiOutputSelectionContext);
  if (!context) {
    throw new Error(
      "useMidiOutputSelection must be used within a MidiOutputSelectionProvider"
    );
  }
  return context;
}

export function MidiOutputSelector() {
  const { outputs, enable } = useMidiContext();
  const status = useMidiPermissionStatus();
  const { selectedOutputId, selectOutput } = useMidiOutputSelection();

  const maybeEnableOnGesture = useCallback(() => {
    // Trigger enable on user gesture if we have no outputs and permission is not explicitly denied.
    if ((!outputs || outputs.length === 0) && status !== "denied") {
      enable();
    }
  }, [outputs, status, enable]);

  if (status === "denied") {
    return (
      <select
        disabled
        className="p-2 border rounded-lg bg-gray-100 text-gray-500"
      >
        <option>MIDI access denied</option>
      </select>
    );
  }

  return (
    <select
      value={selectedOutputId || ""}
      onChange={(e) => selectOutput(e.target.value)}
      className="p-2 border rounded-lg"
      onMouseDown={maybeEnableOnGesture}
      onClick={maybeEnableOnGesture}
      onTouchStart={maybeEnableOnGesture}
      onFocus={maybeEnableOnGesture}
    >
      <option value="">Select MIDI Output</option>
      {outputs.map((output) => (
        <option key={output.id} value={output.id}>
          {output.name}
        </option>
      ))}
    </select>
  );
}

export function MidiInputSelector() {
  const { inputs, enable } = useMidiContext();
  const status = useMidiPermissionStatus();
  const { selectedInputId, selectInput } = useMidiInputSelection();

  const maybeEnableOnGesture = useCallback(() => {
    // Trigger enable on user gesture if we have no inputs and permission is not explicitly denied.
    if ((!inputs || inputs.length === 0) && status !== "denied") {
      enable();
    }
  }, [inputs, status, enable]);

  if (status === "denied") {
    return (
      <select
        disabled
        className="p-2 border rounded-lg bg-gray-100 text-gray-500"
      >
        <option>MIDI access denied</option>
      </select>
    );
  }

  return (
    <select
      value={selectedInputId || ""}
      onChange={(e) => selectInput(e.target.value)}
      className="p-2 border rounded-lg"
      onMouseDown={maybeEnableOnGesture}
      onClick={maybeEnableOnGesture}
      onTouchStart={maybeEnableOnGesture}
      onFocus={maybeEnableOnGesture}
    >
      <option value="">Select MIDI Input</option>
      {inputs.map((input) => (
        <option key={input.id} value={input.id}>
          {input.name}
        </option>
      ))}
    </select>
  );
}

export type MidiChannelNumber = number; // 0-15

export interface MidiHandlerOptions {
  // Channel Voice Messages
  noteOn?: (note: number, velocity: number, channel: MidiChannelNumber) => void;
  noteOff?: (note: number, velocity: number, channel: MidiChannelNumber) => void;
  cc?: (controllerNumber: number, value: number, channel: MidiChannelNumber) => void;
  pitchBend?: (value14bit: number, channel: MidiChannelNumber) => void; // 0-16383, 8192 center
  channelPressure?: (value: number, channel: MidiChannelNumber) => void;

  // System Common / Real-Time
  clock?: () => void; // 0xF8
  start?: () => void; // 0xFA
  stop?: () => void; // 0xFC
  continue?: () => void; // 0xFB
  songPosition?: (beatsLsbMsb14bit: number) => void; // 0xF2 (14-bit)

  // Diagnostics (optional)
  mysteryStatusByte?: (statusByte: number) => void;
  mysteryDataByte?: (dataByte: number) => void;
}

export interface UseMidiHandlersOptions {
  // Treat note-on with velocity 0 as note-off. Default true.
  treatZeroVelocityAsNoteOff?: boolean;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function to14Bit(lsb: number, msb: number): number {
  return (lsb & 0x7f) + ((msb & 0x7f) << 7);
}

function getStatusHighNibble(statusByte: number): number {
  return statusByte & 0xf0;
}

function getChannel(statusByte: number): number {
  return statusByte & 0x0f;
}

// ------------------------------------------------------------
// Core parsing: decode a single Web MIDI message and invoke handlers
// ------------------------------------------------------------

export function parseMidiMessage(data: Uint8Array, handlers: MidiHandlerOptions, opts?: UseMidiHandlersOptions) {
  if (!data || data.length === 0) return;
  const h = handlers || {};
  const status = data[0];

  // System Real-Time (single-byte) and some System Common
  if (status >= 0xf8) {
    switch (status) {
      case 0xf8:
        if (h.clock) h.clock();
        return;
      case 0xfa:
        if (h.start) h.start();
        return;
      case 0xfb:
        if (h.continue) h.continue();
        return;
      case 0xfc:
        if (h.stop) h.stop();
        return;
      default:
        if (h.mysteryStatusByte) h.mysteryStatusByte(status);
        return;
    }
  }

  // System Common: Song Position Pointer (0xF2) → 2 data bytes (LSB, MSB)
  if (status === 0xf2) {
    if (data.length >= 3) {
      const value14 = to14Bit(data[1], data[2]);
      if (h.songPosition) h.songPosition(value14);
    }
    return;
  }

  const high = getStatusHighNibble(status);
  const channel = getChannel(status);

  switch (high) {
    case 0x80: {
      // Note Off: key, velocity
      if (data.length >= 3) {
        const note = data[1] & 0x7f;
        const velocity = data[2] & 0x7f;
        if (h.noteOff) h.noteOff(note, velocity, channel);
      }
      return;
    }
    case 0x90: {
      // Note On: key, velocity (velocity 0 often used as Note Off)
      if (data.length >= 3) {
        const note = data[1] & 0x7f;
        const velocity = data[2] & 0x7f;
        const treatZeroAsOff = opts?.treatZeroVelocityAsNoteOff !== false;
        if (velocity === 0 && treatZeroAsOff) {
          if (h.noteOff) h.noteOff(note, 0, channel);
        } else {
          if (h.noteOn) h.noteOn(note, velocity, channel);
        }
      }
      return;
    }
    case 0xb0: {
      // Control Change: controller, value
      if (data.length >= 3) {
        if (h.cc) h.cc(data[1] & 0x7f, data[2] & 0x7f, channel);
      }
      return;
    }
    case 0xe0: {
      // Pitch Bend: LSB, MSB → 14-bit value (0-16383), center 8192
      if (data.length >= 3) {
        const value14 = to14Bit(data[1], data[2]);
        if (h.pitchBend) h.pitchBend(value14, channel);
      }
      return;
    }
    case 0xd0: {
      // Channel Pressure (Aftertouch): value
      if (data.length >= 2) {
        if (h.channelPressure) h.channelPressure(data[1] & 0x7f, channel);
      }
      return;
    }
    default: {
      // If we have an unknown status byte or incomplete data
      if (h.mysteryStatusByte) h.mysteryStatusByte(status);
      return;
    }
  }
}

// ------------------------------------------------------------
// React hook: attach parsing handlers to a MIDIInput
// ------------------------------------------------------------

export function useMidiHandlers(
  handlers: MidiHandlerOptions,
  options?: UseMidiHandlersOptions
) {
  const { selectedInput: input } = useMidiInputSelection();
  const handlersRef = useRef<MidiHandlerOptions>(handlers);
  const optionsRef = useRef<UseMidiHandlersOptions | undefined>(options);

  // Keep the latest handlers/options without re-binding the event listener
  useEffect(() => {
    handlersRef.current = handlers || {};
  }, [handlers]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!input) return;

    const onMidiMessage = (event: MIDIMessageEvent) => {
      if (!event?.data) return;
      parseMidiMessage(event.data, handlersRef.current, optionsRef.current);
    };

    input.addEventListener("midimessage", onMidiMessage as unknown as EventListener);

    return () => {
      try {
        input.removeEventListener("midimessage", onMidiMessage as unknown as EventListener);
      } catch {}
    };
  }, [input]);
}

// ------------------------------------------------------------
// Message builders (handy when sending to outputs)
// ------------------------------------------------------------

export const MidiMessage = {
  noteOn(note: number, velocity: number, channel: MidiChannelNumber = 0) {
    return [0x90 + (channel & 0x0f), note & 0x7f, velocity & 0x7f];
  },
  noteOff(note: number, velocity: number = 0, channel: MidiChannelNumber = 0) {
    return [0x80 + (channel & 0x0f), note & 0x7f, velocity & 0x7f];
  },
  cc(controller: number, value: number, channel: MidiChannelNumber = 0) {
    return [0xb0 + (channel & 0x0f), controller & 0x7f, value & 0x7f];
  },
  channelPressure(value: number, channel: MidiChannelNumber = 0) {
    return [0xd0 + (channel & 0x0f), value & 0x7f];
  },
  pitchBend(value14bit: number, channel: MidiChannelNumber = 0) {
    const v = Math.max(0, Math.min(16383, value14bit | 0));
    return [0xe0 + (channel & 0x0f), v & 0x7f, (v >> 7) & 0x7f];
  },
  clock() {
    return [0xf8];
  },
  start() {
    return [0xfa];
  },
  stop() {
    return [0xfc];
  },
  continue() {
    return [0xfb];
  },
  songPosition(value14bit: number) {
    const v = Math.max(0, Math.min(16383, value14bit | 0));
    return [0xf2, v & 0x7f, (v >> 7) & 0x7f];
  },
};
