'use client'

import { useState, useEffect } from 'react'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

export default function MidtermProjectPage() {
  const [revealed, setRevealed] = useState({})
  const [frequency, setFrequency] = useState(4)
  const [signalType, setSignalType] = useState('bipolar') // 'bipolar', 'unipolar-positive', 'unipolar-negative'
  const [time, setTime] = useState(0)
  const [filterType, setFilterType] = useState('LPF')
  const [cutoffFreq, setCutoffFreq] = useState(1000)
  const [resonance, setResonance] = useState(1)
  const [poles, setPoles] = useState(1)

  const toggleReveal = (id) => {
    setRevealed(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Generate triangle wave data points
  const generateWaveData = () => {
    const points = []
    const duration = 1000 // 1000ms
    const samples = 200
    const timeStep = duration / samples
    
    for (let i = 0; i <= samples; i++) {
      const t = i * timeStep
      const phase = (t / 1000) * frequency * 2 * Math.PI
      
      let value
      
      if (signalType === 'unipolar-positive') {
        // Unipolar positive: triangle wave from 0 to +5V, starting at 0V
        const sawtooth = (phase / (2 * Math.PI)) % 1  // 0 to 1
        value = 5 * (sawtooth < 0.5 ? 2 * sawtooth : 2 - 2 * sawtooth)  // 0 to 5, starting at 0
      } else if (signalType === 'unipolar-negative') {
        // Unipolar negative: triangle wave from 0 to -5V, starting at 0V
        const sawtooth = (phase / (2 * Math.PI)) % 1  // 0 to 1
        value = -5 * (sawtooth < 0.5 ? 2 * sawtooth : 2 - 2 * sawtooth)  // 0 to -5, starting at 0
      } else {
        // Bipolar: triangle wave from -5V to +5V
        value = (2 / Math.PI) * Math.asin(Math.sin(phase)) * 5
      }
      
      points.push({ x: t, y: value })
    }
    
    return points
  }

  const waveData = generateWaveData()

  // Generate filter response data
  const generateFilterData = () => {
    const points = []
    const frequencies = []
    
    // Generate frequency points from 20Hz to 20kHz (log scale)
    for (let i = 0; i <= 100; i++) {
      const freq = 20 * Math.pow(10, (i / 100) * 3) // 20Hz to 20kHz
      frequencies.push(freq)
    }
    
    frequencies.forEach(freq => {
      let response = 0
      const normalizedFreq = freq / cutoffFreq
      
      switch (filterType) {
        case 'LPF':
          // Low Pass Filter
          response = 1 / Math.sqrt(1 + Math.pow(normalizedFreq, 2 * poles))
          break
        case 'HPF':
          // High Pass Filter
          response = normalizedFreq / Math.sqrt(1 + Math.pow(normalizedFreq, 2 * poles))
          break
        case 'BP':
          // Band Pass Filter
          const q = resonance
          const centerFreq = cutoffFreq
          const bandwidth = centerFreq / q
          const lowCutoff = centerFreq - bandwidth / 2
          const highCutoff = centerFreq + bandwidth / 2
          
          if (freq >= lowCutoff && freq <= highCutoff) {
            response = 1 - Math.abs(freq - centerFreq) / (bandwidth / 2)
          } else {
            response = 0.1
          }
          break
        case 'BR':
          // Band Reject (Notch) Filter
          const q2 = resonance
          const centerFreq2 = cutoffFreq
          const bandwidth2 = centerFreq2 / q2
          const lowCutoff2 = centerFreq2 - bandwidth2 / 2
          const highCutoff2 = centerFreq2 + bandwidth2 / 2
          
          if (freq >= lowCutoff2 && freq <= highCutoff2) {
            response = Math.abs(freq - centerFreq2) / (bandwidth2 / 2)
          } else {
            response = 1
          }
          break
        case 'notch':
          // Notch Filter (same as Band Reject)
          const q3 = resonance
          const centerFreq3 = cutoffFreq
          const bandwidth3 = centerFreq3 / q3
          const lowCutoff3 = centerFreq3 - bandwidth3 / 2
          const highCutoff3 = centerFreq3 + bandwidth3 / 2
          
          if (freq >= lowCutoff3 && freq <= highCutoff3) {
            response = Math.abs(freq - centerFreq3) / (bandwidth3 / 2)
          } else {
            response = 1
          }
          break
      }
      
      // Convert to dB
      const dbResponse = 20 * Math.log10(response)
      points.push({ x: freq, y: dbResponse })
    })
    
    return points
  }

  const filterData = generateFilterData()
  const slope = -6 * poles // dB per octave
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-2xl font-bold mb-6">Modular Synthesizer Definitions</h1>

        {/* Generator vs Processor Explanation */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Module Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 mb-2">Generator</h3>
              <p className="text-sm text-gray-600">Creates new signals from scratch (VCO, LFO)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="font-semibold text-blue-700 mb-2">Processor</h3>
              <p className="text-sm text-gray-600">Modifies existing signals (VCF, VCA, Attenuator)</p>
            </div>
          </div>
        </div>


        <div className="space-y-4">
          {/* Generator Modules */}
          <div className="border-l-4 border-green-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('vco')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              VCO (Voltage-Controlled Oscillator)
              <span className="ml-2 text-xs text-gray-500">
                {revealed.vco ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.vco && (
              <p className="text-sm text-gray-600 ml-9">
                A VCO is a generator module that produces periodic waveforms such as sine, triangle, square (or pulse), and sawtooth. Its frequency is controlled by voltage — a higher control voltage creates a higher pitch. Each waveform carries different harmonics, which determine its timbre and brightness.
              </p>
            )}
          </div>

          {/* Processor Modules */}
          <div className="border-l-4 border-blue-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('vcf')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </span>
              VCF (Voltage-Controlled Filter)
              <span className="ml-2 text-xs text-gray-500">
                {revealed.vcf ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.vcf && (
              <p className="text-sm text-gray-600 ml-9">
                A VCF is a processor that removes or emphasizes specific frequencies from an audio signal. The cutoff frequency determines where the filtering begins, while resonance (Q) boosts the frequencies around that cutoff point.
              </p>
            )}
          </div>

          <div className="border-l-4 border-purple-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('vca')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </span>
              VCA (Voltage-Controlled Amplifier)
              <span className="ml-2 text-xs text-gray-500">
                {revealed.vca ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.vca && (
              <div className="ml-9">
                <p className="text-sm text-gray-600">
                  A VCA is a processor that controls the amplitude of an audio or control signal through another control voltage. The VCA can act as both a carrier and a modulator — bipolar when used as a carrier, and unipolar when used as a modulator.
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-xs text-gray-500">
                  <li><strong>Two-quadrant (unipolar):</strong> controls level only, no inversion — used for envelopes.</li>
                  <li><strong>Four-quadrant (bipolar):</strong> allows both positive and negative modulation</li>
                </ul>
              </div>
            )}
          </div>

          <div className="border-l-4 border-orange-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('attenuator')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </span>
              Attenuator
              <span className="ml-2 text-xs text-gray-500">
                {revealed.attenuator ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.attenuator && (
              <p className="text-sm text-gray-600 ml-9">
                An attenuator reduces the amplitude or strength of a signal without changing its shape. It doesn't generate or filter sound — it only scales signals down in level. When combined with a DC offset, it can convert bipolar signals to unipolar (or the opposite).
              </p>
            )}
          </div>

          {/* Generator Modules */}
          <div className="border-l-4 border-red-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('envelope')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              Envelope Generator
              <span className="ml-2 text-xs text-gray-500">
                {revealed.envelope ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.envelope && (
              <div className="ml-9">
                <p className="text-sm text-gray-600 mb-3">
                  An envelope generator produces a control voltage that changes over time when a key or gate is pressed and released. Unipolar positive
                </p>
                
                {/* Gate Envelope Subcategory */}
                <div className="ml-4 border-l-2 border-indigo-300 pl-3 mb-3">
                  <h4 className="text-base font-medium text-indigo-700 mb-1 flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleReveal('gate'); }}>
                    Gate Envelope
                    <span className="ml-2 text-xs text-gray-500">
                      {revealed.gate ? '▼' : '▶'}
                    </span>
                  </h4>
                  {revealed.gate && (
                    <p className="text-xs text-gray-500">
                      A gate envelope turns ON (high voltage) when a key is pressed and OFF (low voltage) when released. It helps coordinate which modules are active in a patch at any given time.
                    </p>
                  )}
                </div>

                {/* ADSR Envelope Subcategory */}
                <div className="ml-4 border-l-2 border-pink-300 pl-3">
                  <h4 className="text-base font-medium text-pink-700 mb-1 flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleReveal('adsr'); }}>
                    ADSR Envelope
                    <span className="ml-2 text-xs text-gray-500">
                      {revealed.adsr ? '▼' : '▶'}
                    </span>
                  </h4>
                  {revealed.adsr && (
                    <p className="text-xs text-gray-500">
                      The ADSR envelope has four stages: Attack, Decay, Sustain, and Release. Attack, Decay, and Release are time-based, while Sustain sets a steady level that holds while a key is pressed.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Processor Modules */}
          <div className="border-l-4 border-teal-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('tremolo')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </span>
              Tremolo
              <span className="ml-2 text-xs text-gray-500">
                {revealed.tremolo ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.tremolo && (
              <p className="text-sm text-gray-600 ml-9">
                Tremolo is amplitude modulation — a periodic change in volume over time. It is created by sending a Low-Frequency Oscillator (LFO) to control a VCA.
              </p>
            )}
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 cursor-pointer hover:bg-gray-50 p-3 rounded-r-lg transition-colors" onClick={() => toggleReveal('vibrato')}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </span>
              Vibrato
              <span className="ml-2 text-xs text-gray-500">
                {revealed.vibrato ? '▼' : '▶'}
              </span>
            </h3>
            {revealed.vibrato && (
              <p className="text-sm text-gray-600 ml-9">
                Vibrato is frequency modulation — a periodic change in pitch over time. It is achieved by using an LFO to modulate a VCO's frequency input.
              </p>
            )}
          </div>
        </div>

        {/* Hz Generator */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interactive Hz Generator</h2>
          
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Frequency:</label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {frequency} Hz
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Signal Type:</label>
              <button
                onClick={() => setSignalType('bipolar')}
                className={`px-3 py-1 rounded text-sm ${
                  signalType === 'bipolar' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Bipolar (±5V)
              </button>
              <button
                onClick={() => setSignalType('unipolar-positive')}
                className={`px-3 py-1 rounded text-sm ${
                  signalType === 'unipolar-positive' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Unipolar Positive (0+5V)
              </button>
              <button
                onClick={() => setSignalType('unipolar-negative')}
                className={`px-3 py-1 rounded text-sm ${
                  signalType === 'unipolar-negative' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Unipolar Negative (0-5V)
              </button>
            </div>
          </div>

          {/* Waveform Display */}
          <div className="bg-white p-4 rounded border">
            <div className="text-center mb-2">
              <h3 className="text-sm font-medium">
                {signalType === 'bipolar' && 'Bipolar Triangle Wave'}
                {signalType === 'unipolar-positive' && 'Unipolar Positive Triangle Wave'}
                {signalType === 'unipolar-negative' && 'Unipolar Negative Triangle Wave'}
                {' '}- {frequency}Hz
              </h3>
            </div>
            
            <div className="relative h-48 border border-gray-300 bg-white">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {/* Horizontal lines */}
                <div className="absolute top-1/2 left-0 right-0 border-t border-gray-200"></div>
                <div className="absolute top-1/4 left-0 right-0 border-t border-gray-100"></div>
                <div className="absolute top-3/4 left-0 right-0 border-t border-gray-100"></div>
                
                {/* Vertical lines */}
                <div className="absolute left-1/4 top-0 bottom-0 border-l border-gray-100"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-gray-100"></div>
                <div className="absolute left-3/4 top-0 bottom-0 border-l border-gray-100"></div>
              </div>
              
              {/* Waveform */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={waveData.map(point => {
                    const x = (point.x / 1000) * 100
                    // Map voltage to y position on bipolar scale (- 5V to +5V)
                    let y
                    if (signalType === 'unipolar-positive') {
                      // Map 0-5V range to 50-0 (0V to +5V on display)
                      y = 50 - (point.y / 5) * 50
                    } else if (signalType === 'unipolar-negative') {
                     
                      y = 100 - ((point.y + 5) / 5) * 50  
                    } else {
             
                      y = 50 - (point.y / 5) * 50  
                    }
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
              </svg>
              
              {/* Axis labels - Always bipolar scale */}
              <div className="absolute -left-8 top-0 text-xs text-gray-500">
                +5V
              </div>
              <div className="absolute -left-8 top-1/4 text-xs text-gray-500">
                +2.5V
              </div>
              <div className="absolute -left-8 top-1/2 text-xs text-gray-500">
                0V
              </div>
              <div className="absolute -left-8 top-3/4 text-xs text-gray-500">
                -2.5V
              </div>
              <div className="absolute -left-8 bottom-0 text-xs text-gray-500">
                -5V
              </div>
              
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500">0ms</div>
              <div className="absolute -bottom-6 left-1/4 text-xs text-gray-500">250ms</div>
              <div className="absolute -bottom-6 left-1/2 text-xs text-gray-500">500ms</div>
              <div className="absolute -bottom-6 left-3/4 text-xs text-gray-500">750ms</div>
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">1000ms</div>
            </div>
          </div>
        </div>

        {/* Filter Visualization */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interactive Filter Visualization</h2>
          
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Filter Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border rounded"
              >
                <option value="LPF">Low Pass Filter (LPF)</option>
                <option value="HPF">High Pass Filter (HPF)</option>
                <option value="BP">Band Pass Filter (BP)</option>
                <option value="BR">Band Reject Filter (BR)</option>
                <option value="notch">Notch Filter</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Cutoff Frequency:</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={cutoffFreq}
                onChange={(e) => setCutoffFreq(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {cutoffFreq} Hz
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Resonance (Q):</label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={resonance}
                onChange={(e) => setResonance(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {resonance}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Poles:</label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={poles}
                onChange={(e) => setPoles(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {poles} pole{poles > 1 ? 's' : ''} ({slope} dB/octave)
              </span>
            </div>
          </div>

          {/* Filter Response Display */}
          <div className="bg-white p-4 rounded border">
            <div className="text-center mb-2">
              <h3 className="text-sm font-medium">
                {filterType === 'LPF' && 'Low Pass Filter'}
                {filterType === 'HPF' && 'High Pass Filter'}
                {filterType === 'BP' && 'Band Pass Filter'}
                {filterType === 'BR' && 'Band Reject Filter'}
                {filterType === 'notch' && 'Notch Filter'}
                {' '}Response - {cutoffFreq}Hz Cutoff, Q={resonance}
              </h3>
            </div>
            
            <div className="relative h-64 border border-gray-300 bg-white">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {/* Horizontal lines (dB) */}
                <div className="absolute top-1/4 left-0 right-0 border-t border-gray-200"></div>
                <div className="absolute top-1/2 left-0 right-0 border-t border-gray-200"></div>
                <div className="absolute top-3/4 left-0 right-0 border-t border-gray-200"></div>
                
                {/* Vertical lines (frequency) */}
                <div className="absolute left-1/4 top-0 bottom-0 border-l border-gray-100"></div>
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-gray-100"></div>
                <div className="absolute left-3/4 top-0 bottom-0 border-l border-gray-100"></div>
              </div>
              
              {/* Filter Response Curve */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={filterData.map(point => {
                    const x = Math.log10(point.x / 20) / 3 * 100 // Log scale: 20Hz to 20kHz
                    const y = 50 - (point.y / 60) * 50 // -60dB to +20dB range
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="0.5"
                />
                
                {/* Cutoff frequency line */}
                <line
                  x1={Math.log10(cutoffFreq / 20) / 3 * 100}
                  y1="0"
                  x2={Math.log10(cutoffFreq / 20) / 3 * 100}
                  y2="100"
                  stroke="#3B82F6"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                />
              </svg>
              
              {/* Axis labels */}
              <div className="absolute -left-8 top-0 text-xs text-gray-500">+20dB</div>
              <div className="absolute -left-8 top-1/4 text-xs text-gray-500">-10dB</div>
              <div className="absolute -left-8 top-1/2 text-xs text-gray-500">-40dB</div>
              <div className="absolute -left-8 top-3/4 text-xs text-gray-500">-70dB</div>
              <div className="absolute -left-8 bottom-0 text-xs text-gray-500">-100dB</div>
              
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500">20Hz</div>
              <div className="absolute -bottom-6 left-1/4 text-xs text-gray-500">200Hz</div>
              <div className="absolute -bottom-6 left-1/2 text-xs text-gray-500">2kHz</div>
              <div className="absolute -bottom-6 left-3/4 text-xs text-gray-500">20kHz</div>
              
              {/* Cutoff frequency label */}
              <div className="absolute -bottom-6" style={{left: `${Math.log10(cutoffFreq / 20) / 3 * 100}%`}}>
                <div className="text-xs text-blue-600 font-medium">{cutoffFreq}Hz</div>
              </div>
            </div>
            
            {/* Filter Information */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Filter Characteristics:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>Pass Band:</strong> {filterType === 'LPF' ? 'Below cutoff' : filterType === 'HPF' ? 'Above cutoff' : filterType === 'BP' ? 'Around cutoff' : 'Outside cutoff'}</li>
                  <li><strong>Stop Band:</strong> {filterType === 'LPF' ? 'Above cutoff' : filterType === 'HPF' ? 'Below cutoff' : filterType === 'BP' ? 'Outside cutoff' : 'Around cutoff'}</li>
                  <li><strong>Cutoff Frequency:</strong> {cutoffFreq} Hz</li>
                  <li><strong>Resonance (Q):</strong> {resonance}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Technical Specs:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>Poles:</strong> {poles}</li>
                  <li><strong>Slope:</strong> {slope} dB/octave</li>
                  <li><strong>Rolloff:</strong> {Math.abs(slope)} dB per octave</li>
                  <li><strong>Type:</strong> {poles === 1 ? '1st order' : poles === 2 ? '2nd order' : poles === 3 ? '3rd order' : '4th order'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ModuleFooter />
      </div>
    </div>
  )
}
