'use client'

import { useState, useEffect } from 'react'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

export default function MidiPage() {
  const { error } = useMidiContext();
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [activeNotes, setActiveNotes] = useState(new Set())

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
            {whiteKeys.map(({ note, name }) => (
              <Key key={note} noteNumber={note} name={name} type="white" isMouseDown={isMouseDown} activeNotes={activeNotes} setActiveNotes={setActiveNotes} />
            ))}
            {/* Black Keys */}
            <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
              {blackKeys.map(({ note, name }) => {
                const precedingWhiteKeyIndex = whiteKeys.findIndex(wk => wk.note > note) - 1;
                const leftPosition = (precedingWhiteKeyIndex + 0.75) * 48; // 48px is key width
                return (
                  <div key={note} className="absolute top-0 pointer-events-auto" style={{ left: `${leftPosition}px` }}>
                    <Key noteNumber={note} name={name} type="black" isMouseDown={isMouseDown} activeNotes={activeNotes} setActiveNotes={setActiveNotes} />
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

const NOTE_ON = 0x90
const NOTE_OFF = 0x80

function Key({ noteNumber, name, type, isMouseDown, activeNotes, setActiveNotes }) {
  const { selectedOutput } = useMidiOutputSelection();
  const isActive = activeNotes.has(noteNumber);

  const sendNoteOn = () => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_ON, noteNumber, 127]);
    setActiveNotes(prev => new Set(prev).add(noteNumber));
  };

  const sendNoteOff = () => {
    if (!selectedOutput) return;
    selectedOutput.send([NOTE_OFF, noteNumber, 0]);
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(noteNumber);
      return newSet;
    });
  };

  const handleMouseEnter = () => {
    if (isMouseDown) sendNoteOn();
  };

  // Ensure note is turned off if component unmounts while active
  useEffect(() => {
    return () => {
      if (activeNotes.has(noteNumber)) {
        sendNoteOff();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseClasses = "flex items-end justify-center p-2 border-2 border-black rounded-b-md cursor-pointer transition-colors duration-100";
  const typeClasses = type === 'white'
    ? `w-12 h-48 text-black ${isActive ? 'bg-gray-300' : 'bg-white'}`
    : `w-8 h-32 text-white z-10 ${isActive ? 'bg-gray-600' : 'bg-black'}`;

  return (
    <button
      onMouseDown={sendNoteOn}
      onMouseUp={sendNoteOff}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={sendNoteOff} // Stop note if mouse leaves button while pressed
      disabled={!selectedOutput}
      className={`${baseClasses} ${typeClasses} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <span className="font-semibold">{name}</span>
    </button>
  );
}