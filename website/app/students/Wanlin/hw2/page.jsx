'use client'

import { useState, useEffect } from 'react'
import { useCallback } from 'react'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

export default function MidiPage() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())

  const NOTE_ON = 0x90
  const NOTE_OFF = 0x80

  // Centralized function to send MIDI Note On
  const sendNoteOn = useCallback((noteNumber) => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_ON, noteNumber, 127]); // Velocity 127 (max)
    setActiveNotes(prev => new Set(prev).add(noteNumber));
  }, [selectedOutput]);

  // Centralized function to send MIDI Note Off
  const sendNoteOff = useCallback((noteNumber) => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_OFF, noteNumber, 0]);
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteNumber);
      return newSet;
    });
  }, [selectedOutput]);

  // Mapping computer keyboard keys to MIDI note numbers (two octaves)
  const keyToNoteMap = {
    'a': 48, 'w': 49, 's': 50, 'e': 51, 'd': 52, 'f': 53, 't': 54, 'g': 55, 'y': 56, 'h': 57, 'u': 58, 'j': 59,
    'k': 60, 'o': 61, 'l': 62, 'p': 63, ';': 64, "'": 65, '[': 66, ']': 67, '\\': 68, 'z': 69, 'x': 70, 'c': 71,
    'v': 72 // C5
  };

  // Two octaves of piano keys from C3 to C5
  const pianoKeys = [
    { note: 48, name: 'C3', type: 'white' }, { note: 49, name: 'C#3', type: 'black' },
    { note: 50, name: 'D3', type: 'white' }, { note: 51, name: 'D#3', type: 'black' },
    { note: 52, name: 'E3', type: 'white' },
    { note: 53, name: 'F3', type: 'white' }, { note: 54, name: 'F#3', type: 'black' },
    { note: 55, name: 'G3', type: 'white' }, { note: 56, name: 'G#3', type: 'black' },
    { note: 57, name: 'A3', type: 'white' }, { note: 58, name: 'A#3', type: 'black' },
    { note: 59, name: 'B3', type: 'white' },
    { note: 60, name: 'C4', type: 'white' }, { note: 61, name: 'C#4', type: 'black' },
    { note: 62, name: 'D4', type: 'white' }, { note: 63, name: 'D#4', type: 'black' },
    { note: 64, name: 'E4', type: 'white' },
    { note: 65, name: 'F4', type: 'white' }, { note: 66, name: 'F#4', type: 'black' },
    { note: 67, name: 'G4', type: 'white' }, { note: 68, name: 'G#4', type: 'black' },
    { note: 69, name: 'A4', type: 'white' }, { note: 70, name: 'A#4', type: 'black' },
    { note: 71, name: 'B4', type: 'white' },
    { note: 72, name: 'C5', type: 'white' }
  ];

  const whiteKeys = pianoKeys.filter(k => k.type === 'white');
  const blackKeys = pianoKeys.filter(k => k.type === 'black');

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      const noteNumber = keyToNoteMap[event.key.toLowerCase()];
      if (noteNumber !== undefined) {
        event.preventDefault(); // Prevent default browser actions (e.g., scrolling)
        if (!activeNotes.has(noteNumber)) { // Only trigger if note isn't already active
          sendNoteOn(noteNumber);
        }
      }
    };

    const handleKeyUp = (event) => {
      const noteNumber = keyToNoteMap[event.key.toLowerCase()];
      if (noteNumber !== undefined) {
        event.preventDefault();
        sendNoteOff(noteNumber);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes, sendNoteOn, sendNoteOff, keyToNoteMap]); // Dependencies for useEffect

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <h1>Wanlin's MIDI Web</h1>
        <p className="mb-4">A web-based MIDI piano keyboard.</p>

        <div className="mb-3">
          <div className="flex items-center gap-4 mb-4">
            <MidiOutputSelector />
          </div>
          <div
            className="relative flex select-none w-fit"
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onMouseLeave={() => setIsMouseDown(false)}
          >
            {/* White Keys */}
            {whiteKeys.map(({ note, name, type }) => (
              <Key key={note} noteNumber={note} name={name} type={type} isMouseDown={isMouseDown} activeNotes={activeNotes} sendNoteOn={sendNoteOn} sendNoteOff={sendNoteOff} />
            ))}
            {/* Black Keys */}
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
              {blackKeys.map(({ note, name, type }) => {
                const precedingWhiteKeyIndex = whiteKeys.findIndex(wk => wk.note > note) - 1;
                const leftPosition = (precedingWhiteKeyIndex + 0.75) * 48; // 48px is key width
                return (
                  <div key={note} className="absolute top-0 pointer-events-auto" style={{ left: `${leftPosition}px` }}>
                    <Key noteNumber={note} name={name} type={type} isMouseDown={isMouseDown} activeNotes={activeNotes} sendNoteOn={sendNoteOn} sendNoteOff={sendNoteOff} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

function Key({ noteNumber, name, type, isMouseDown, activeNotes, sendNoteOn, sendNoteOff }) {
  const isActive = activeNotes.has(noteNumber);

  // Use the centralized sendNoteOn/Off functions
  const handleMouseDown = () => sendNoteOn(noteNumber);
  const handleMouseUp = () => sendNoteOff(noteNumber);
  const handleMouseLeave = () => {
    // Only send note off if the mouse was pressed on this key
    // and it's still active (prevents accidental note-off if mouse just passes over)
    if (isActive) {
      sendNoteOff(noteNumber);
    }
  };

  const handleMouseEnter = () => {
    if (isMouseDown) sendNoteOn(noteNumber);
  };

  // Ensure note is turned off if component unmounts while active
  useEffect(() => {
    // No need for this useEffect anymore as activeNotes is managed globally
    // and notes are turned off on keyUp/mouseUp/mouseLeave
    // This was primarily for cleanup if the component itself was unmounted while a note was active.
    // With global state and explicit note-off events, it's less critical here.
  }, []);

  const baseClasses = "flex items-end justify-center p-2 border-2 border-black rounded-b-md cursor-pointer transition-colors duration-100";
  const typeClasses = type === 'white'
    ? `w-12 h-48 text-black ${isActive ? 'bg-gray-300' : 'bg-white'}`
    : `w-8 h-32 text-white z-10 ${isActive ? 'bg-gray-600' : 'bg-black'}`;

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={!sendNoteOn || !sendNoteOff} // Disable if MIDI output is not selected
      className={`${baseClasses} ${typeClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <span className="font-semibold">{name}</span>
    </button>
  );
}