'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// ---------- Pure Helpers (No side effects) ----------
/**
 * Build notes from a generic interval formula.
 * @param {number} root MIDI note (e.g., 60 = C4)
 * @param {number[]} intervals semitone distances from root (e.g., [0,4,7])
 * @returns {number[]} MIDI notes
 */
function chordFromFormula(root, intervals) {
  return intervals.map(i => root + i);
}

/**
 * Build a triad given root+quality.
 * @param {number} root MIDI note
 * @param {"major"|"minor"|"diminished"|"augmented"|"sus2"|"sus4"} quality
 */
function buildTriad(root, quality) {
  const formulas = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
  };
  const intervals = formulas[quality] ?? [0, 4, 7];
  return chordFromFormula(root, intervals);
}

/**
 * Build a seventh chord given root+quality.
 * @param {number} root MIDI note
 * @param {"maj7"|"7"|"min7"|"m7b5"|"dim7"} quality
 */
function buildSeventh(root, quality) {
  const formulas = {
    maj7: [0, 4, 7, 11],
    '7': [0, 4, 7, 10],
    min7: [0, 3, 7, 10],
    m7b5: [0, 3, 6, 10],
    dim7: [0, 3, 6, 9],
  };
  const intervals = formulas[quality] ?? [0, 4, 7, 11];
  return chordFromFormula(root, intervals);
}

/**
 * Apply simple voicings by redistributing octaves.
 * @param {number[]} notes base chord (ascending order)
 * @param {"close"|"open"|"inv1"|"inv2"|"drop2"} voicing
 * @returns {number[]} new notes
 */
function applyVoicing(notes, voicing) {
  const sorted = [...notes].sort((a, b) => a - b);
  switch (voicing) {
    case 'inv1': {
      const [n0, ...rest] = sorted;
      return [...rest, n0 + 12];
    }
    case 'inv2': {
      const [n0, n1, ...rest] = sorted;
      return [...rest, n0 + 12, n1 + 12].sort((a, b) => a - b);
    }
    case 'drop2': {
      // Lower the 2nd-highest by an octave
      const s = [...sorted];
      if (s.length >= 3) {
        const idx = s.length - 2;
        s[idx] -= 12;
      }
      return s.sort((a, b) => a - b);
    }
    case 'open': {
      // Spread by bumping the top two notes up an octave
      const s = [...sorted];
      if (s.length >= 2) s[s.length - 1] += 12;
      if (s.length >= 3) s[s.length - 2] += 12;
      return s.sort((a, b) => a - b);
    }
    default:
      return sorted; // close
  }
}

/**
 * Return a new array transposed by semitones.
 * @param {number[]} notes
 * @param {number} semitones positive/negative ints
 */
function transpose(notes, semitones) {
  return notes.map(n => n + semitones);
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function noteName(midi) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${names[pc]}${oct}`;
}

// ---------- MIDI Hook ----------
function useMidi() {
  const [access, setAccess] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const a = await navigator.requestMIDIAccess({ sysex: false });
        if (cancelled) return;
        setAccess(a);
        const outs = Array.from(a.outputs.values());
        setOutputs(outs);
        if (outs[0] && !selectedId) setSelectedId(outs[0].id);
        a.onstatechange = () => {
          const updated = Array.from(a.outputs.values());
          setOutputs(updated);
          if (!updated.find(o => o.id === selectedId)) {
            setSelectedId(updated[0]?.id ?? null);
          }
        };
      } catch (e) {
        console.error('Web MIDI not available:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line

  const output = useMemo(
    () => outputs.find(o => o.id === selectedId) ?? null,
    [outputs, selectedId]
  );

  return { outputs, output, selectedId, setSelectedId };
}

// ---------- MIDI Send Utilities ----------
/**
 * Send note on/off messages to a chosen output+channel.
 * Uses 0x90 (note on) and 0x80 (note off).
 */
function sendNoteOn(output, note, velocity = 100, channel = 1) {
  if (!output) return;
  const status = 0x90 + clamp(channel - 1, 0, 15);
  output.send([status, clamp(note, 0, 127), clamp(velocity, 0, 127)]);
}

function sendNoteOff(output, note, channel = 1) {
  if (!output) return;
  const status = 0x80 + clamp(channel - 1, 0, 15);
  output.send([status, clamp(note, 0, 127), 0]);
}

// ---------- Components ----------
function MidiOutputSelector({ outputs, selectedId, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">MIDI Output</label>
      <select
        className="border rounded px-2 py-1"
        value={selectedId ?? ''}
        onChange={e => onChange(e.target.value)}
      >
        {outputs.length === 0 && <option value="">No outputs</option>}
        {outputs.map(o => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * ChordButton: sends noteOn for all notes on press and noteOff on release.
 * Props:
 * - notes: number[] (MIDI notes)
 * - output: Web MIDI output
 * - channel: 1-16
 * - velocity: 1-127
 * - latch: boolean (toggle behavior)
 * - strumMs: number (0 = simultaneous; >0 = staggered)
 * - label: string to display on the button
 *
 * ==== Agentic workflow: message flow summary ====
 * Clicking the button calls `handlePress`, which iterates `notes` and sends
 * a MIDI Note On (0x90 + channel-1, note, velocity) to the selected output.
 * Releasing (or toggling latch off) calls `handleRelease`, which sends Note Off
 * (0x80 + channel-1, note, 0) for each note. This ensures a correct note-on/off lifecycle.
 */
function ChordButton({
  notes,
  output,
  channel = 1,
  velocity = 100,
  latch = false,
  strumMs = 0,
  label,
}) {
  const [on, setOn] = useState(false);
  const timerRefs = useRef([]);

  useEffect(() => {
    // On unmount, ensure all timers cleared and notes turned off
    return () => {
      timerRefs.current.forEach(t => clearTimeout(t));
      if (on) notes.forEach(n => sendNoteOff(output, n, channel));
    };
  }, [on, notes, output, channel]);

  const handlePress = () => {
    if (latch) {
      if (on) {
        handleRelease();
        setOn(false);
      } else {
        playNotes();
        setOn(true);
      }
    } else {
      playNotes();
      setOn(true);
    }
  };

  const handleRelease = () => {
    notes.forEach(n => sendNoteOff(output, n, channel));
    setOn(false);
  };

  const playNotes = () => {
    timerRefs.current.forEach(t => clearTimeout(t));
    timerRefs.current = [];
    if (strumMs <= 0) {
      notes.forEach(n => sendNoteOn(output, n, velocity, channel));
    } else {
      notes.forEach((n, i) => {
        const t = setTimeout(() => sendNoteOn(output, n, velocity, channel), i * strumMs);
        timerRefs.current.push(t);
      });
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-xl border shadow-sm transition active:scale-95 ${
        on ? 'bg-black text-white' : 'bg-white'
      }`}
      onMouseDown={handlePress}
      onMouseUp={() => !latch && handleRelease()}
      onMouseLeave={() => !latch && on && handleRelease()}
      onTouchStart={handlePress}
      onTouchEnd={() => !latch && handleRelease()}
    >
      {label ?? notes.map(noteName).join(' ')}
    </button>
  );
}

export default function ChordInstrumentPage() {
  // MIDI + UI state
  const { outputs, output, selectedId, setSelectedId } = useMidi();
  const [channel, setChannel] = useState(1);

  // Root/quality
  const [rootPc, setRootPc] = useState(0); // 0=C, 1=C#, ...
  const [octave, setOctave] = useState(4); // C4 = 60
  const [mode, setMode] = useState('triad'); // triad | seventh
  const [quality, setQuality] = useState('major'); // changes depending on mode

  // Voicing & transforms
  const [voicing, setVoicing] = useState('close'); // close | open | inv1 | inv2 | drop2
  const [transposeAmt, setTransposeAmt] = useState(0);

  // Performance
  const [velocity, setVelocity] = useState(100);
  const [latch, setLatch] = useState(false);
  const [strumMs, setStrumMs] = useState(0); // simple strum
  const [arp, setArp] = useState('off'); // off | up | down | random
  const arpTimerRef = useRef(null);
  const [arpOn, setArpOn] = useState(false);

  const rootMidi = useMemo(() => octave * 12 + rootPc, [octave, rootPc]);

  const baseNotes = useMemo(() => {
    if (mode === 'triad') {
      return buildTriad(rootMidi, /** @type any */ (quality));
    } else {
      return buildSeventh(rootMidi, /** @type any */ (quality));
    }
  }, [mode, quality, rootMidi]);

  const voicedNotes = useMemo(
    () => applyVoicing(baseNotes, voicing),
    [baseNotes, voicing]
  );
  const finalNotes = useMemo(
    () => transpose(voicedNotes, transposeAmt),
    [voicedNotes, transposeAmt]
  );

  // Simple arpeggiator (sends one note at a time)
  useEffect(() => {
    if (arp === 'off' || !arpOn) return;
    const seq =
      arp === 'up'
        ? [...finalNotes].sort((a, b) => a - b)
        : arp === 'down'
        ? [...finalNotes].sort((a, b) => b - a)
        : [...finalNotes].sort(() => Math.random() - 0.5);
    let idx = 0;
    const tick = () => {
      const note = seq[idx % seq.length];
      sendNoteOn(output, note, velocity, channel);
      setTimeout(() => sendNoteOff(output, note, channel), 140); // gate
      idx++;
      arpTimerRef.current = setTimeout(tick, Math.max(120, 80 + strumMs)); // simple rate
    };
    tick();
    return () => {
      clearTimeout(arpTimerRef.current);
    };
  }, [arp, arpOn, finalNotes, output, channel, velocity, strumMs]);

  // ==== Agentic workflow: small refactor note ====
  // We noticed we were repeating “root + intervals” math across builders,
  // so we extracted `chordFromFormula(root, intervals)` to keep helpers pure and reusable.

  // UI lists
  const pcs = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const triadQualities = ['major', 'minor', 'diminished', 'augmented', 'sus2', 'sus4'];
  const seventhQualities = ['maj7', '7', 'min7', 'm7b5', 'dim7'];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Chord Instrument</h1>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <MidiOutputSelector
          outputs={outputs}
          selectedId={selectedId}
          onChange={setSelectedId}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Channel</label>
          <input
            type="number"
            min={1}
            max={16}
            className="border rounded px-2 py-1 w-20"
            value={channel}
            onChange={e => setChannel(clamp(parseInt(e.target.value || '1', 10), 1, 16))}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Mode</label>
          <select
            className="border rounded px-2 py-1"
            value={mode}
            onChange={e => {
              const m = e.target.value;
              setMode(m);
              // set a sensible default quality when switching
              setQuality(m === 'triad' ? 'major' : 'maj7');
            }}
          >
            <option value="triad">Triad</option>
            <option value="seventh">Seventh</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Root</label>
          <select
            className="border rounded px-2 py-1"
            value={rootPc}
            onChange={e => setRootPc(parseInt(e.target.value, 10))}
          >
            {pcs.map((p, i) => (
              <option key={p} value={i}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Quality</label>
          <select
            className="border rounded px-2 py-1"
            value={quality}
            onChange={e => setQuality(e.target.value)}
          >
            {(mode === 'triad' ? triadQualities : seventhQualities).map(q => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Octave</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            value={octave}
            onChange={e => setOctave(clamp(parseInt(e.target.value || '4', 10), 0, 10))}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Voicing</label>
          <select
            className="border rounded px-2 py-1"
            value={voicing}
            onChange={e => setVoicing(e.target.value)}
          >
            <option value="close">Close</option>
            <option value="open">Open</option>
            <option value="inv1">1st Inversion</option>
            <option value="inv2">2nd Inversion</option>
            <option value="drop2">Drop-2</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Transpose (semitones)</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-24"
            value={transposeAmt}
            onChange={e =>
              setTransposeAmt(parseInt(e.target.value || '0', 10))
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Velocity</label>
          <input
            type="number"
            min={1}
            max={127}
            className="border rounded px-2 py-1 w-24"
            value={velocity}
            onChange={e => setVelocity(clamp(parseInt(e.target.value || '100', 10), 1, 127))}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Latch</label>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={latch}
            onChange={e => setLatch(e.target.checked)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Strum (ms)</label>
          <input
            type="number"
            min={0}
            className="border rounded px-2 py-1 w-24"
            value={strumMs}
            onChange={e => setStrumMs(Math.max(0, parseInt(e.target.value || '0', 10)))}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Arp</label>
          <select
            className="border rounded px-2 py-1"
            value={arp}
            onChange={e => setArp(e.target.value)}
          >
            <option value="off">Off</option>
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="random">Random</option>
          </select>
          <button
            className={`px-3 py-1 rounded border ${arpOn ? 'bg-black text-white' : 'bg-white'}`}
            onClick={() => setArpOn(v => !v)}
            disabled={arp === 'off'}
            title="Start/stop the arpeggiator"
          >
            {arpOn ? 'Stop Arp' : 'Start Arp'}
          </button>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-600">
        Current notes: {finalNotes.map(noteName).join(' • ')}
      </div>

      <div className="flex flex-wrap gap-3">
        <ChordButton
          notes={finalNotes}
          output={output}
          channel={channel}
          velocity={velocity}
          latch={latch}
          strumMs={strumMs}
          label={`${pcs[rootPc]} ${quality}${mode === 'seventh' ? '' : ''}`}
        />
        {/* A few pre-baked buttons to demo the "notes prop" requirement */}
        <ChordButton
          notes={applyVoicing(buildTriad(60, 'major'), 'close')}
          output={output}
          channel={channel}
          velocity={velocity}
          latch={latch}
          strumMs={strumMs}
          label="C major (close)"
        />
        <ChordButton
          notes={applyVoicing(buildSeventh(62, '7'), 'drop2')}
          output={output}
          channel={channel}
          velocity={velocity}
          latch={latch}
          strumMs={strumMs}
          label="D7 (drop-2)"
        />
      </div>
    </div>
  );
}
