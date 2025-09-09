"use client";

import {
  useState,
  useEffect,
  useCallback,
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
