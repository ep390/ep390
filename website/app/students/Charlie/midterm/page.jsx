'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  useMidiOutputSelection, 
  MidiOutputSelector,
  MidiMessage 
} from '@/components/midi'

// Chord progression patterns and analysis
const CHORD_PATTERNS = {
  'ii-V-I': ['Dm7', 'G7', 'Cmaj7'],
  'I-vi-IV-V': ['Cmaj7', 'Am7', 'Fmaj7', 'G7'],
  'I-IV-V-I': ['Cmaj7', 'Fmaj7', 'G7', 'Cmaj7'],
  'vi-ii-V-I': ['Am7', 'Dm7', 'G7', 'Cmaj7'],
  'iii-vi-ii-V': ['Em7', 'Am7', 'Dm7', 'G7'],
  'I-vi-ii-V': ['Cmaj7', 'Am7', 'Dm7', 'G7']
}

const CHORD_NOTES = {
  'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
  'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
  'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
}

const CHORD_TYPES = {
  'maj7': [0, 4, 7, 11],
  '7': [0, 4, 7, 10],
  'm7': [0, 3, 7, 10],
  'maj': [0, 4, 7],
  'min': [0, 3, 7],
  'dim': [0, 3, 6],
  'aug': [0, 4, 8],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  'm7b5': [0, 3, 6, 10],
  '7#5': [0, 4, 8, 10],
  '7b5': [0, 4, 6, 10]
}

function parseChord(chordSymbol) {
  // Parse chord symbols like "Cmaj7", "Dm7", "G7"
  const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return null
  
  const [, root, type] = match
  const rootNote = CHORD_NOTES[root]
  if (!rootNote) return null
  
  const intervals = CHORD_TYPES[type] || CHORD_TYPES['maj']
  return intervals.map(interval => rootNote + interval)
}

function analyzeProgression(chords) {
  const patterns = Object.keys(CHORD_PATTERNS)
  const matches = []
  
  for (const pattern of patterns) {
    const patternChords = CHORD_PATTERNS[pattern]
    if (chords.length >= patternChords.length) {
      for (let i = 0; i <= chords.length - patternChords.length; i++) {
        const segment = chords.slice(i, i + patternChords.length)
        if (segment.every((chord, idx) => chord === patternChords[idx])) {
          matches.push({
            pattern,
            start: i,
            length: patternChords.length,
            chords: segment
          })
        }
      }
    }
  }
  
  return matches
}

function ChordButton({ chord, isActive, onClick, className = "" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
        isActive 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${className}`}
    >
      {chord}
    </motion.button>
  )
}

function ChordProgressionInput({ chords, onChordsChange }) {
  const [inputValue, setInputValue] = useState('')
  
  const addChord = useCallback((chord) => {
    onChordsChange([...chords, chord])
  }, [chords, onChordsChange])
  
  const removeChord = useCallback((index) => {
    onChordsChange(chords.filter((_, i) => i !== index))
  }, [chords, onChordsChange])
  
  const addFromInput = useCallback(() => {
    if (inputValue.trim()) {
      addChord(inputValue.trim())
      setInputValue('')
    }
  }, [inputValue, addChord])
  
  const addPattern = useCallback((pattern) => {
    const patternChords = CHORD_PATTERNS[pattern]
    onChordsChange([...chords, ...patternChords])
  }, [chords, onChordsChange])
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Progression
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatePresence>
            {chords.map((chord, index) => (
              <motion.div
                key={`${chord}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <ChordButton chord={chord} isActive={false} />
                <button
                  onClick={() => removeChord(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Chord
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., Cmaj7"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addFromInput()}
          />
          <button
            onClick={addFromInput}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Common Patterns
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(CHORD_PATTERNS).map(pattern => (
            <button
              key={pattern}
              onClick={() => addPattern(pattern)}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              {pattern}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function GenerationControls({ 
  temperature, 
  onTemperatureChange, 
  length, 
  onLengthChange, 
  isGenerating, 
  onGenerate 
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Temperature: {temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Conservative</span>
          <span>Creative</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Length: {length} chords
        </label>
        <input
          type="range"
          min="4"
          max="16"
          step="1"
          value={length}
          onChange={(e) => onLengthChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          isGenerating
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg'
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating...
          </div>
        ) : (
          'Generate Progression'
        )}
      </button>
    </div>
  )
}

function ProgressionAnalysis({ chords }) {
  const analysis = analyzeProgression(chords)
  
  if (analysis.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          No recognized jazz patterns found. Try adding some common progressions!
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">Pattern Analysis</h3>
      {analysis.map((match, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-800">{match.pattern}</span>
            <span className="text-sm text-blue-600">
              Chords {match.start + 1}-{match.start + match.length}
            </span>
          </div>
          <div className="text-sm text-blue-700 mt-1">
            {match.chords.join(' → ')}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MidiPlayer({ chords, isPlaying, onPlay, onStop }) {
  const { selectedOutput } = useMidiOutputSelection()
  const [currentChord, setCurrentChord] = useState(0)
  const intervalRef = useRef(null)
  
  const playChord = useCallback((chordSymbol) => {
    if (!selectedOutput) return
    
    const notes = parseChord(chordSymbol)
    if (!notes) return
    
    // Send note on messages
    notes.forEach(note => {
      const message = MidiMessage.noteOn(note, 80, 0)
      selectedOutput.send(message)
    })
    
    // Schedule note off messages
    setTimeout(() => {
      notes.forEach(note => {
        const message = MidiMessage.noteOff(note, 0, 0)
        selectedOutput.send(message)
      })
    }, 1000)
  }, [selectedOutput])
  
  const startPlayback = useCallback(() => {
    if (chords.length === 0) return
    
    setCurrentChord(0)
    playChord(chords[0])
    
    intervalRef.current = setInterval(() => {
      setCurrentChord(prev => {
        const next = (prev + 1) % chords.length
        playChord(chords[next])
        return next
      })
    }, 1200)
    
    onPlay()
  }, [chords, playChord, onPlay])
  
  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setCurrentChord(0)
    onStop()
  }, [onStop])
  
  const exportMidi = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/export/midi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chords })
      })
      
      if (!response.ok) {
        throw new Error('Export failed')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Create download link
        const midiData = atob(data.midi_data)
        const blob = new Blob([midiData], { type: 'audio/midi' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = 'chord_progression.mid'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('MIDI export failed:', error)
    }
  }, [chords])
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">MIDI Playback</h3>
        <MidiOutputSelector />
      </div>
      
      {selectedOutput ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isPlaying
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button
              onClick={exportMidi}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Export MIDI
            </button>
          </div>
          
          {isPlaying && (
            <div className="flex gap-2">
              {chords.map((chord, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    index === currentChord
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {chord}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-500 text-sm">
            Select a MIDI output device to play chords
          </p>
          <button
            onClick={exportMidi}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Export MIDI
          </button>
        </div>
      )}
    </div>
  )
}

export default function MidtermPage() {
  const [inputChords, setInputChords] = useState(['Cmaj7', 'Am7', 'Dm7', 'G7'])
  const [generatedChords, setGeneratedChords] = useState([])
  const [temperature, setTemperature] = useState(1.2)
  const [length, setLength] = useState(8)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generationHistory, setGenerationHistory] = useState([])
  const [apiStatus, setApiStatus] = useState('checking')
  
  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/health')
        if (response.ok) {
          const data = await response.json()
          setApiStatus(data.model_loaded ? 'connected' : 'model_error')
        } else {
          setApiStatus('disconnected')
        }
      } catch (error) {
        setApiStatus('disconnected')
      }
    }
    
    checkApiStatus()
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const generateProgression = useCallback(async () => {
    setIsGenerating(true)
    
    try {
      // Call your Python API backend
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_chords: inputChords,
          temperature: temperature,
          length: length
        })
      })
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedChords(data.chords)
        setGenerationHistory(prev => [
          { 
            id: Date.now(), 
            input: [...inputChords], 
            output: data.chords,
            temperature,
            quality_score: data.quality_score,
            timestamp: new Date()
          },
          ...prev.slice(0, 4) // Keep last 5 generations
        ])
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation failed:', error)
      
      // Show user-friendly error message
      if (error.message.includes('Failed to fetch')) {
        alert('❌ Cannot connect to the AI model server.\n\nPlease make sure the backend is running:\n1. Open terminal\n2. cd to midterm folder\n3. Run: ./start.sh\n\nOr check if port 5001 is available.')
      } else {
        alert(`❌ Generation failed: ${error.message}`)
      }
      
      // Fallback to mock data if API is not available
      const mockProgression = [
        'Cmaj7', 'Am7', 'Dm7', 'G7',
        'Fmaj7', 'Dm7', 'G7', 'Cmaj7'
      ].slice(0, length)
      
      setGeneratedChords(mockProgression)
      setGenerationHistory(prev => [
        { 
          id: Date.now(), 
          input: [...inputChords], 
          output: mockProgression,
          temperature,
          quality_score: 0.5,
          timestamp: new Date()
        },
        ...prev.slice(0, 4)
      ])
    } finally {
      setIsGenerating(false)
    }
  }, [inputChords, temperature, length])
  
  const currentChords = generatedChords.length > 0 ? generatedChords : inputChords
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Jazz Chord Progression Generator
          </h1>
          <p className="text-gray-600 mb-4">
            AI-powered jazz harmony exploration using your trained model
          </p>
          
          {/* API Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-500' :
              apiStatus === 'disconnected' ? 'bg-red-500' :
              apiStatus === 'model_error' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {apiStatus === 'connected' ? '✅ AI Model Connected' :
               apiStatus === 'disconnected' ? '❌ AI Model Disconnected' :
               apiStatus === 'model_error' ? '⚠️ Model Loading Error' :
               '🔄 Checking Connection...'}
            </span>
          </div>
          
          {apiStatus === 'disconnected' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-800 text-sm">
                <strong>Backend not running!</strong><br/>
                Start the AI server: <code className="bg-red-100 px-1 rounded">./start.sh</code>
              </p>
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input and Controls */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Input Progression
              </h2>
              <ChordProgressionInput 
                chords={inputChords} 
                onChordsChange={setInputChords} 
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Generation Controls
              </h2>
              <GenerationControls
                temperature={temperature}
                onTemperatureChange={setTemperature}
                length={length}
                onLengthChange={setLength}
                isGenerating={isGenerating}
                onGenerate={generateProgression}
              />
            </motion.div>
          </div>
          
          {/* Right Column - Output and Analysis */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Generated Progression
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {currentChords.map((chord, index) => (
                  <ChordButton 
                    key={index} 
                    chord={chord} 
                    isActive={true}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  />
                ))}
              </div>
              
              <ProgressionAnalysis chords={currentChords} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <MidiPlayer
                chords={currentChords}
                isPlaying={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onStop={() => setIsPlaying(false)}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Generation History */}
        {generationHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Generations
            </h2>
            <div className="space-y-3">
              {generationHistory.map((gen) => (
                <div key={gen.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      Temperature: {gen.temperature} | Length: {gen.output.length}
                      {gen.quality_score !== undefined && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Quality: {gen.quality_score.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {gen.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-600">Input:</span>
                    <div className="flex gap-1">
                      {gen.input.map((chord, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {chord}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm text-gray-600">Output:</span>
                    <div className="flex gap-1">
                      {gen.output.map((chord, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 rounded text-sm">
                          {chord}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Model Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            About This Model
          </h2>
          <p className="text-gray-700">
            This interface connects to your trained PyTorch model that generates jazz chord progressions 
            from mel-spectrogram representations. The model uses a MTSF architecture to learn patterns 
            from jazz harmony and can suggest creative progressions based on your input.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
