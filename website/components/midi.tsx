"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

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
      } catch (err: unknown) {
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

export function useSelectedMidiOutput(outputs: MIDIOutput[], initialId = null) {
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(
    initialId
  );

  useEffect(() => {
    if (!outputs || outputs.length === 0) {
      if (selectedOutputId !== null) setSelectedOutputId(null);
      return;
    }
    if (selectedOutputId && outputs.some((o) => o.id === selectedOutputId)) {
      return;
    }
    setSelectedOutputId(outputs[0].id);
  }, [outputs, selectedOutputId]);

  const selectedOutput = useMemo(() => {
    if (!outputs || outputs.length === 0 || !selectedOutputId) return null;
    return outputs.find((o) => o.id === selectedOutputId) || null;
  }, [outputs, selectedOutputId]);

  const selectOutput = useCallback((id: string | null) => {
    setSelectedOutputId(id || null);
  }, []);

  return useMemo(
    () => ({ selectedOutput, selectedOutputId, selectOutput }),
    [selectedOutput, selectedOutputId, selectOutput]
  );
}
