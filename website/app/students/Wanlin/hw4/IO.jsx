"use client";

import { useState, useRef } from "react";
import ModuleFooter from "@/components/ModuleFooter";
import {
  MidiInputSelector,
  MidiOutputSelector,
  MidiMessage,
  useMidiOutputSelection,
  useMidiContext,
  useMidiHandlers,
} from "@/components/midi";

// Small pause helper
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Scale definitions (degrees 1-3-5)
const scales = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Dorian: [0, 3, 7],
  Mixolydian: [0, 4, 7]
};

const keyRoots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function Hw4Page() {
  const { error } = useMidiContext();
  const { selectedOutput } = useMidiOutputSelection();
  const [activeNotes, setActiveNotes] = useState(new Set());
  
  // Controls state
  const [keyRoot, setKeyRoot] = useState(0); // C
  const [scale, setScale] = useState('Major');
  const [chordMode, setChordMode] = useState(true);
  const [delayMs, setDelayMs] = useState(500);
  
  // Mapping from input note to all generated notes
  const noteMappingRef = useRef(new Map());

  // Quantize note to key/scale
  const quantizeToScale = (note) => {
    const octave = Math.floor(note / 12);
    const pitchClass = note % 12;
    const rootPitchClass = (pitchClass + (12 - keyRoot)) % 12;
    
    // Find closest scale degree
    const scaleIntervals = scales[scale];
    let closestDegree = 0;
    let minDistance = 12;
    
    for (const interval of scaleIntervals) {
      const distance = Math.abs(rootPitchClass - interval);
      const wrappedDistance = Math.min(distance, 12 - distance);
      if (wrappedDistance < minDistance) {
        minDistance = wrappedDistance;
        closestDegree = interval;
      }
    }
    
    return octave * 12 + (keyRoot + closestDegree) % 12;
  };

  // Build triad from root note
  const buildTriad = (rootNote) => {
    const scaleIntervals = scales[scale];
    return scaleIntervals.map(interval => rootNote + interval);
  };

  useMidiHandlers({
    noteOn: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      
      const generatedNotes = new Set();
      
      // 1. Send original note immediately
      selectedOutput.send(MidiMessage.noteOn(note, velocity, channel));
      generatedNotes.add(note);
      
      // 2. Send chord (if chord mode enabled)
      if (chordMode) {
        const quantizedRoot = quantizeToScale(note);
        const triadNotes = buildTriad(quantizedRoot);
        
        triadNotes.forEach(triadNote => {
          if (triadNote !== note) { // Avoid double-sending the root
            selectedOutput.send(MidiMessage.noteOn(triadNote, velocity, channel));
            generatedNotes.add(triadNote);
          }
        });
      }
      
      // 3. Send delayed fifth after delay
      setTimeout(async () => {
        if (!selectedOutput) return;
        const delayedNote = note + 7;
        selectedOutput.send(MidiMessage.noteOn(delayedNote, velocity, channel));
        generatedNotes.add(delayedNote);
        
        // Update active notes display
        setActiveNotes(prev => new Set([...prev, ...generatedNotes]));
      }, delayMs);
      
      // Store mapping
      noteMappingRef.current.set(note, generatedNotes);
      
      // Update active notes display (immediate notes)
      setActiveNotes(prev => new Set([...prev, ...generatedNotes]));
    },
    
    noteOff: async (note, velocity, channel) => {
      if (!selectedOutput) return;
      
      // Get all generated notes for this input
      const generatedNotes = noteMappingRef.current.get(note);
      if (generatedNotes) {
        // Send note-off for all generated notes
        generatedNotes.forEach(generatedNote => {
          selectedOutput.send(MidiMessage.noteOff(generatedNote, velocity, channel));
        });
        
        // Remove from active notes display
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          generatedNotes.forEach(genNote => newSet.delete(genNote));
          return newSet;
        });
        
        // Clear mapping
        noteMappingRef.current.delete(note);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              MIDI Harmony Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Play notes; each note becomes a triad in the chosen key/scale + a delayed fifth.
            </p>
          </div>

          {/* MIDI Controls */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">🎹</span>
              MIDI Connection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">MIDI Input</label>
                <div className="bg-gray-50 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  <MidiInputSelector />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">MIDI Output</label>
                <div className="bg-gray-50 p-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors">
                  <MidiOutputSelector />
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">⚠️</span>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Key & Scale Controls */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">🎵</span>
              Harmony Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Key Root</label>
                <div className="relative">
                  <select 
                    value={keyRoot} 
                    onChange={(e) => setKeyRoot(parseInt(e.target.value))}
                    className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer"
                  >
                    {keyRoots.map((root, index) => (
                      <option key={index} value={index}>{root}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-blue-500">🎼</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Scale</label>
                <div className="relative">
                  <select 
                    value={scale} 
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all appearance-none cursor-pointer"
                  >
                    {Object.keys(scales).map(scaleName => (
                      <option key={scaleName} value={scaleName}>{scaleName}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-purple-500">🎶</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Chord Mode</label>
                <div className="flex items-center justify-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="chordMode"
                        checked={chordMode}
                        onChange={(e) => setChordMode(e.target.checked)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor="chordMode" 
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          chordMode ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          chordMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </label>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {chordMode ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Delay: {delayMs}ms
                </label>
                <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={delayMs}
                    onChange={(e) => setDelayMs(parseInt(e.target.value))}
                    className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100ms</span>
                    <span>1000ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Notes Display */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">🎯</span>
              Active Notes
            </h2>
            <div className="min-h-[60px] bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex flex-wrap gap-3">
                {activeNotes.size > 0 ? (
                  Array.from(activeNotes).map(note => (
                    <span 
                      key={note} 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-105 transition-transform"
                    >
                      {note}
                    </span>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-12 text-gray-400">
                    <span className="text-lg">🎵 No active notes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ModuleFooter />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #eab308);
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f97316, #eab308);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  );
}
