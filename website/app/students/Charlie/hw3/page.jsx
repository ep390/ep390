'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- CONSTANTS ---
const ROOT_NOTES = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

const INTERVALS = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  halfDim7: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
};

// --- PURE UTILITY FUNCTIONS ---

/**
 * The functions `buildTriad` and `buildSeventh` initially had repetitive logic for creating note arrays.
 * I refactored this by creating a single, pure function `chordFromFormula` that takes a root note and an array of intervals,
 * making the code more DRY and easier to maintain. Input: root (number), intervals (number[]). Output: notes (number[]).
 */

/**
 * Builds a chord from a root note and a set of intervals.
 * @param {number} root The root MIDI note number.
 * @param {number[]} intervals An array of semitone intervals from the root.
 * @returns {number[]} An array of MIDI note numbers.
 */
const chordFromFormula = (root, intervals) => {
  return intervals.map(interval => root + interval);
};

/*
  I didn't know what is @param means
  So I ask Gemini 
  @param: This is a standard JSDoc tag used to document a function's parameter
*/ 

/**
 * Builds a triad chord.
 * @param {number} root The root MIDI note number.
 * @param {'maj' | 'min' | 'dim' | 'aug'} quality The quality of the triad.
 * @returns {number[]} An array of MIDI note numbers.
 */
const buildTriad = (root, quality) => {
  return chordFromFormula(root, INTERVALS[quality]);
};

/**
 * Builds a seventh chord.
 * @param {number} root The root MIDI note number.
 * @param {'maj7' | 'min7' | 'dom7' | 'halfDim7' | 'dim7'} quality The quality of the seventh chord.
 * @returns {number[]} An array of MIDI note numbers.
 */
const buildSeventh = (root, quality) => {
  return chordFromFormula(root, INTERVALS[quality]);
};

/**
 * Transposes an array of notes by a given number of semitones.
 * @param {number[]} notes An array of MIDI note numbers.
 * @param {number} semitones The number of semitones to transpose (can be negative).
 * @returns {number[]} A new array of transposed MIDI note numbers.
 */
const transpose = (notes, semitones) => {
  return notes.map(note => note + semitones);
};

/**
 * Applies a voicing to a chord.
 * @param {number[]} notes An array of MIDI note numbers in close position.
 * @param {'close' | 'open' | 'inv1' | 'inv2' | 'drop2'} voicing The voicing to apply.
 * @returns {number[]} A new array of MIDI note numbers with the voicing applied.
 */
const applyVoicing = (notes, voicing) => {
  const sortedNotes = [...notes].sort((a, b) => a - b);
  if (sortedNotes.length < 3) return sortedNotes; // Voicings need at least 3 notes

  switch (voicing) {
    case 'close':
      return sortedNotes;
    case 'inv1':
      return [...sortedNotes.slice(1), sortedNotes[0] + 12];
    case 'inv2':
      return [...sortedNotes.slice(2), ...sortedNotes.slice(0, 2).map(n => n + 12)];
    case 'open':
      // Spread voicing: move middle notes up an octave
      if (sortedNotes.length === 3) return [sortedNotes[0], sortedNotes[1] + 12, sortedNotes[2]];
      if (sortedNotes.length === 4) return [sortedNotes[0], sortedNotes[1] + 12, sortedNotes[2], sortedNotes[3] + 12];
      return sortedNotes;
    case 'drop2':
      // Drop the second note from the top by an octave
      if (sortedNotes.length < 4) return sortedNotes; // Drop2 needs 4 notes
      const top = sortedNotes.length - 1;
      return [sortedNotes[top - 1] - 12, ...sortedNotes.slice(0, top - 1), sortedNotes[top]];
    default:
      return sortedNotes;
  }
};

// --- MIDI HELPER FUNCTIONS ---
const sendNoteOn = (output, note, velocity, channel) => {
  if (output && note >= 0 && note <= 127) {
    output.send([0x90 + (channel - 1), note, velocity]);
  }
};

const sendNoteOff = (output, note, channel) => {
  if (output && note >= 0 && note <= 127) {
    output.send([0x80 + (channel - 1), note, 0]);
  }
};

// --- REACT COMPONENTS ---

/**
 * Agentic 
 * This ChordButton component encapsulates the logic for a single playable chord. When pressed, it calls the `onPlay` prop,
 * which triggers a `sendNoteOn` message for each note in its `notes` array. The MIDI message flows from this component's event handler,
 * up to the parent's state logic, and finally out to the selected MIDI device via the Web MIDI API. Releasing the button (or clicking again in latch mode)
 * calls `onStop` to send corresponding `noteOff` messages, completing the MIDI event lifecycle.
 */
const ChordButton = ({ notes, label, onPlay, onStop, latchMode, isActive }) => {
  const handleInteraction = () => {
    if (latchMode) {
      isActive ? onStop(notes) : onPlay(notes);
    }
  };

  const handleMouseDown = () => {
    if (!latchMode) onPlay(notes);
  };

  const handleMouseUp = () => {
    if (!latchMode) onStop(notes);
  };

  const activeClass = isActive ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500';

  return (
    <button
      className={`p-4 rounded-lg text-white font-bold transition-colors ${activeClass}`}
      onClick={handleInteraction}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stop note if mouse leaves button while pressed
    >
      {label}
    </button>
  );
};
 /*
  The => is part of the syntax for an arrow function expression in JavaScript. It's a more concise way to write a function.

  The line const ChordInstrument = () => { does the following:

  const ChordInstrument =: Declares a constant variable named ChordInstrument.
  () => { ... }: This is the arrow function itself.
  (): Contains the function's parameters. In this case, it's empty, meaning the function takes no parameters.
  =>: The "arrow" that separates the parameters from the function's body.
  { ... }: The body of the function.
  
  */
const ChordInstrument = () => {

 
  // MIDI State
  const [midiAccess, setMidiAccess] = useState(null);
  const [midiOutput, setMidiOutput] = useState(null);
  const [outputs, setOutputs] = useState([]);
  
  // Chord Generation State
  const [rootNote, setRootNote] = useState(60); // C4
  const [quality, setQuality] = useState('maj');
  const [voicing, setVoicing] = useState('close');
  const [octave, setOctave] = useState(4);
  const [transposeAmt, setTransposeAmt] = useState(0);

  // Performance State
  const [velocity, setVelocity] = useState(100);
  const [velocityRand, setVelocityRand] = useState(0);
  const [channel, setChannel] = useState(1);
  const [latchMode, setLatchMode] = useState(false);
  const [arpMode, setArpMode] = useState('off');
  const [arpSpeed, setArpSpeed] = useState(150); // ms
  const [strumSpeed, setStrumSpeed] = useState(20); // ms

  // Playback Tracking State
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [lastPlayedInfo, setLastPlayedInfo] = useState(null);

  // --- MIDI Setup Effect ---
  useEffect(() => {
    const setupMIDI = async () => {
      if (typeof navigator !== 'undefined' && navigator.requestMIDIAccess) {
        try {
          const access = await navigator.requestMIDIAccess();
          setMidiAccess(access);
          
          const outputDevices = Array.from(access.outputs.values());
          setOutputs(outputDevices);
          if (outputDevices.length > 0) {
            setMidiOutput(outputDevices[0]);
          }

          access.onstatechange = (event) => {
            const updatedOutputs = Array.from(event.currentTarget.outputs.values());
            setOutputs(updatedOutputs);
            // If the currently selected output is disconnected, try to select another one.
            if (midiOutput && !updatedOutputs.some(o => o.id === midiOutput.id)) {
              setMidiOutput(updatedOutputs.length > 0 ? updatedOutputs[0] : null);
            }
          };
        } catch (error) {
          console.error("MIDI Access Denied or not supported:", error);
        }
      }
    };
    setupMIDI();
  }, [midiOutput]); // Re-run if midiOutput changes, to handle disconnections.

  // --- Note Off & Cleanup Effect ---
  const stopAllNotes = useCallback(() => {
    setActiveNotes(currentActiveNotes => {
      currentActiveNotes.forEach(note => {
        sendNoteOff(midiOutput, note, channel);
      });
      return new Set();
    });
  }, [midiOutput, channel]);

  useEffect(() => {
    // Cleanup function to stop all notes when the component unmounts
    return () => {
      stopAllNotes();
    };
  }, [stopAllNotes]);

  // --- Arpeggiator Effect ---
  useEffect(() => {
    let arpInterval = null;
    if (arpMode !== 'off' && activeNotes.size > 0) {
      let noteArray = Array.from(activeNotes).sort((a, b) => a - b);
      if (arpMode === 'down') noteArray.reverse();
      if (arpMode === 'random') noteArray.sort(() => Math.random() - 0.5);
      
      let arpIndex = 0;
      
      // Stop all current notes before starting arp
      noteArray.forEach(note => sendNoteOff(midiOutput, note, channel));

      arpInterval = setInterval(() => {
        // Note-off for the previous note
        const prevIndex = (arpIndex - 1 + noteArray.length) % noteArray.length;
        sendNoteOff(midiOutput, noteArray[prevIndex], channel);
        
        // Note-on for the current note
        const currentNote = noteArray[arpIndex];
        const vel = Math.max(0, Math.min(127, velocity + Math.floor(Math.random() * velocityRand * 2) - velocityRand));
        sendNoteOn(midiOutput, currentNote, vel, channel);
        
        arpIndex = (arpIndex + 1) % noteArray.length;
      }, arpSpeed);
    }
    
    return () => {
      if (arpInterval) clearInterval(arpInterval);
      // When arp stops, send note off for all notes in the chord
      activeNotes.forEach(note => sendNoteOff(midiOutput, note, channel));
    };
  }, [arpMode, arpSpeed, activeNotes, midiOutput, channel, velocity, velocityRand]);


  // --- Event Handlers ---
  const handlePlayChord = useCallback((notes) => {
    if (arpMode !== 'off') {
      setActiveNotes(prev => new Set([...prev, ...notes]));
      return;
    }

    const velocities = notes.map((note, i) => {
      const vel = Math.max(0, Math.min(127, velocity + Math.floor(Math.random() * velocityRand * 2) - velocityRand));
      const strumDelay = strumSpeed * i;
      setTimeout(() => {
        sendNoteOn(midiOutput, note, vel, channel);
      }, strumDelay);
      return vel;
    });

    setActiveNotes(prev => new Set([...prev, ...notes]));
    setLastPlayedInfo({ notes, velocity: velocities });
  }, [midiOutput, velocity, velocityRand, channel, arpMode, strumSpeed]);

  const handleStopChord = useCallback((notes) => {
    if (arpMode !== 'off') {
      setActiveNotes(prev => {
        const newSet = new Set(prev);
        notes.forEach(n => newSet.delete(n));
        return newSet;
      });
      return;
    }
    notes.forEach(note => {
      sendNoteOff(midiOutput, note, channel);
      setActiveNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    });
  }, [midiOutput, channel, arpMode]);

  // --- Memoized Chord Calculations ---
  const getChord = useCallback((base, q, v, oct, trans) => {
    const root = base + (oct - 4) * 12 + trans;
    const intervals = INTERVALS[q];
    const closeNotes = chordFromFormula(root, intervals);
    return applyVoicing(closeNotes, v);
  }, []);

  const progressionChords = useMemo(() => {
    const baseOctave = octave;
    const I = getChord(rootNote, quality, voicing, baseOctave, transposeAmt);
    const IV_quality = quality.includes('maj') ? 'maj' : 'min';
    const IV = getChord(rootNote + 5, IV_quality, voicing, baseOctave, transposeAmt);
    const V_quality = quality.includes('maj') ? 'maj' : 'dom7';
    const V = getChord(rootNote + 7, V_quality, voicing, baseOctave, transposeAmt);
    const vi_quality = quality.includes('maj') ? 'min' : 'dim';
    const vi = getChord(rootNote + 9, vi_quality, voicing, baseOctave, transposeAmt);
    return { I, IV, V, vi };
  }, [rootNote, quality, voicing, octave, transposeAmt, getChord]);

  // --- UI Rendering ---
  const Control = ({ label, children }) => (
    <div className="flex flex-col">
      <label className="text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );

  const Select = ({ value, onChange, children }) => (
    <select value={value} onChange={onChange} className="bg-gray-700 text-white p-2 rounded-md w-full">
      {children}
    </select>
  );

  const Slider = ({ value, onChange, min, max, step }) => (
    <div className="flex items-center gap-2">
      <input type="range" min={min} max={max} step={step || 1} value={value} onChange={onChange} className="w-full" />
      <span className="text-sm text-gray-300 w-8 text-right">{value}</span>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Assignment 3: Agentic Chord Instrument</h1>
          <p className="text-gray-400">By Charlie</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
          <Control label="MIDI Output">
            <Select value={midiOutput?.id || ''} onChange={e => setMidiOutput(outputs.find(o => o.id === e.target.value) || null)}>
              {outputs.length > 0 ? (
                outputs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
              ) : (
                <option>No MIDI devices found</option>
              )}
            </Select>
          </Control>
          <Control label="Root Note">
            <Select value={rootNote % 12} onChange={e => setRootNote(parseInt(e.target.value) + (octave - 4) * 12)}>
              {Object.entries(ROOT_NOTES).map(([name, value]) => <option key={value} value={value}>{name}</option>)}
            </Select>
          </Control>
          <Control label="Quality">
            <Select value={quality} onChange={e => setQuality(e.target.value)}>
              {Object.keys(INTERVALS).map(q => <option key={q} value={q}>{q}</option>)}
            </Select>
          </Control>
          <Control label="Voicing">
            <Select value={voicing} onChange={e => setVoicing(e.target.value)}>
              <option value="close">Close</option>
              <option value="open">Open</option>
              <option value="inv1">1st Inversion</option>
              <option value="inv2">2nd Inversion</option>
              <option value="drop2">Drop 2</option>
            </Select>
          </Control>
          <Control label={`Octave: ${octave}`}>
            <Slider value={octave} onChange={e => setOctave(parseInt(e.target.value))} min={0} max={8} />
          </Control>
          <Control label={`Transpose: ${transposeAmt}`}>
            <Slider value={transposeAmt} onChange={e => setTransposeAmt(parseInt(e.target.value))} min={-12} max={12} />
          </Control>
          <Control label={`Velocity: ${velocity}`}>
            <Slider value={velocity} onChange={e => setVelocity(parseInt(e.target.value))} min={1} max={127} />
          </Control>
          <Control label={`Velocity Rand: ${velocityRand}`}>
            <Slider value={velocityRand} onChange={e => setVelocityRand(parseInt(e.target.value))} min={0} max={60} />
          </Control>
          <Control label={`MIDI Channel: ${channel}`}>
            <Slider value={channel} onChange={e => setChannel(parseInt(e.target.value))} min={1} max={16} />
          </Control>
          <Control label="Latch Mode">
            <button onClick={() => setLatchMode(!latchMode)} className={`w-full p-2 rounded-md ${latchMode ? 'bg-blue-500' : 'bg-gray-700'}`}>
              {latchMode ? 'On' : 'Off'}
            </button>
          </Control>
          <Control label="Arpeggiator">
            <Select value={arpMode} onChange={e => setArpMode(e.target.value)}>
              <option value="off">Off</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="random">Random</option>
            </Select>
          </Control>
          <Control label={`Arp Speed (ms): ${arpSpeed}`}>
            <Slider value={arpSpeed} onChange={e => setArpSpeed(parseInt(e.target.value))} min={50} max={500} step={10} />
          </Control>
           <Control label={`Strum Speed (ms): ${strumSpeed}`}>
            <Slider value={strumSpeed} onChange={e => setStrumSpeed(parseInt(e.target.value))} min={0} max={100} step={5} />
          </Control>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Chord Progression</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ChordButton
              label="I"
              notes={progressionChords.I}
              onPlay={handlePlayChord}
              onStop={handleStopChord}
              latchMode={latchMode}
              isActive={progressionChords.I.every(n => activeNotes.has(n))}
            />
            <ChordButton
              label="IV"
              notes={progressionChords.IV}
              onPlay={handlePlayChord}
              onStop={handleStopChord}
              latchMode={latchMode}
              isActive={progressionChords.IV.every(n => activeNotes.has(n))}
            />
            <ChordButton
              label="V"
              notes={progressionChords.V}
              onPlay={handlePlayChord}
              onStop={handleStopChord}
              latchMode={latchMode}
              isActive={progressionChords.V.every(n => activeNotes.has(n))}
            />
            <ChordButton
              label="vi"
              notes={progressionChords.vi}
              onPlay={handlePlayChord}
              onStop={handleStopChord}
              latchMode={latchMode}
              isActive={progressionChords.vi.every(n => activeNotes.has(n))}
            />
          </div>
        </div>

        <footer className="p-4 bg-gray-800 rounded-lg text-sm text-gray-300">
          <h3 className="font-bold mb-2">Status</h3>
          <p>MIDI Support: <span className={midiAccess ? 'text-green-400' : 'text-red-400'}>{midiAccess ? 'Available' : 'Not Available/Permission Denied'}</span></p>
          <p>Selected Output: <span className="text-blue-300">{midiOutput?.name || 'None'}</span></p>
          <div className="mt-2">
            <p>Last Played Notes: <span className="font-mono">{lastPlayedInfo?.notes.join(', ') || 'N/A'}</span></p>
            <p>Last Velocities: <span className="font-mono">{lastPlayedInfo?.velocity.map(v => Math.round(v)).join(', ') || 'N/A'}</span></p>
            <p>Active Notes: <span className="font-mono">{Array.from(activeNotes).join(', ') || 'None'}</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
};

/*
  console.assert(assertion, message) is a built-in JavaScript function used for testing.
*/
// --- MINIMAL UNIT TESTS ---
const runInlineTests = () => {
  console.log("--- Running Inline Tests ---");
  // 1. Test transpose
  console.assert(JSON.stringify(transpose([60, 64, 67], 5)) === JSON.stringify([65, 69, 72]), "Test 1 Failed: transpose positive");
  console.assert(JSON.stringify(transpose([60, 64, 67], -2)) === JSON.stringify([58, 62, 65]), "Test 2 Failed: transpose negative");
  console.assert(JSON.stringify(transpose([], 5)) === JSON.stringify([]), "Test 3 Failed: transpose empty array");

  // 2. Test chordFromFormula
  console.assert(JSON.stringify(chordFromFormula(60, [0, 4, 7])) === JSON.stringify([60, 64, 67]), "Test 4 Failed: chordFromFormula Cmaj");

  // 3. Test applyVoicing
  const cmaj7 = [60, 64, 67, 71];
  console.assert(JSON.stringify(applyVoicing(cmaj7, 'inv1')) === JSON.stringify([64, 67, 71, 72]), "Test 5 Failed: applyVoicing inv1");
  console.log("--- Inline Tests Complete ---");
};

// Run tests once on client-side mount
if (typeof window !== 'undefined') {
  // A bit of a hack to only run tests once
  if (!window.testsHaveRun) {
    runInlineTests();
    window.testsHaveRun = true;
  }
}

// Default export for Next.js page
export default function ChordInstrumentPage() {
  return <ChordInstrument />;
}
