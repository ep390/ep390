'use client'

import React, { useMemo, useState } from 'react'

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
    </div>
  )
}

function BarCard({ bar }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Bar {bar.bar}</span>
        <span>{bar.chords.length} chord{bar.chords.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {bar.chords.map((chord, idx) => (
          <span
            key={`${chord}-${idx}`}
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-sm"
          >
            {chord}
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {bar.voicings[idx]}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function CandidateCard({ candidate }) {
  const { score, progression } = candidate
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">Score {score.toFixed(3)}</div>
        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">Candidate #{candidate.candidate_id + 1}</div>
      </div>
      <div className="mt-2 text-xs text-gray-500">Top line snapshot</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {progression.sequence.slice(0, 8).map((chord, idx) => (
          <span
            key={`${chord}-${idx}`}
            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
          >
            {chord}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FinalProjectPage() {
  const [numBars, setNumBars] = useState(12)
  const [chordsPerBar, setChordsPerBar] = useState(2)
  const [temperature, setTemperature] = useState(0.9)
  const [numCandidates, setNumCandidates] = useState(8)
  const [topK, setTopK] = useState(50)
  const [topP, setTopP] = useState(0.95)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const bestBars = useMemo(() => result?.best?.progression?.bars ?? [], [result])

  const chordTypes = {
    maj7: [0, 4, 7, 11],
    '7': [0, 4, 7, 10],
    m7: [0, 3, 7, 10],
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    m7b5: [0, 3, 6, 10],
  }

  const pitchFromRoot = (root) => {
    const base = {
      C: 48,
      'C#': 49,
      Db: 49,
      D: 50,
      'D#': 51,
      Eb: 51,
      E: 52,
      F: 53,
      'F#': 54,
      Gb: 54,
      G: 55,
      'G#': 56,
      Ab: 56,
      A: 57,
      'A#': 58,
      Bb: 58,
      B: 59,
    }
    return base[root] ?? 48
  }

  const chordToFreqs = (symbol) => {
    const match = symbol.match(/^([A-G][#b]?)(.*)$/)
    if (!match) return []
    const [, root, type] = match
    const intervals = chordTypes[type] || chordTypes.maj
    const rootMidi = pitchFromRoot(root)
    return intervals.map((i) => 440 * 2 ** ((rootMidi + i - 69) / 12))
  }

  const playProgression = () => {
    if (!bestBars.length || isPlaying) return
    const audio = new (window.AudioContext || window.webkitAudioContext)()
    const chordDuration = 1.1
    const now = audio.currentTime
    let cursor = now
    setIsPlaying(true)

    bestBars.forEach((bar) => {
      bar.chords.forEach((chord) => {
        const freqs = chordToFreqs(chord)
        freqs.forEach((freq) => {
          const osc = audio.createOscillator()
          const gain = audio.createGain()
          osc.type = 'sine'
          osc.frequency.value = freq
          gain.gain.setValueAtTime(0.0, cursor)
          gain.gain.linearRampToValueAtTime(0.18, cursor + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.0001, cursor + chordDuration)
          osc.connect(gain).connect(audio.destination)
          osc.start(cursor)
          osc.stop(cursor + chordDuration + 0.05)
        })
        cursor += chordDuration
      })
    })

    setTimeout(() => setIsPlaying(false), (cursor - now) * 1000 + 200)
  }

  const exportProgression = () => {
    if (!result?.best?.progression) return
    const payload = {
      meta: {
        bars: numBars,
        chords_per_bar: chordsPerBar,
        temperature,
        top_k: topK,
        top_p: topP,
        num_candidates: numCandidates,
      },
      best: result.best,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chord_progression.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/chord-transformer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numBars,
          chordsPerBar,
          temperature,
          numCandidates,
          topK,
          topP,
        }),
      })

      const data = await response.json()
      if (!response.ok || data.success === false) {
        throw new Error(data.error || 'Generation failed')
      }
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-gray-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,87,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_60%_70%,rgba(236,72,153,0.12),transparent_35%)]" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Charlie Shi · Final Project</p>
              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
                Transformer-led Jazz Reharmonization Lab
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-200">
                A production-grade interface for my trained Chord Progression Transformer. Dial in bars, reharmonization
                density, sampling temperature, and candidate pool size, then audition the best-scored progression with
                voicing context.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Model" value="ChordProgressionTransformer" sub="PyTorch · auto-voicing" />
              <Stat label="Dataset" value="504 progressions" sub="Berklee voicing tags" />
              <Stat label="Timeline" value="Dec 9, 2025" sub="Final delivery" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Generation Controls</h2>
                <div className="text-xs text-slate-200">Best-of-N sampling + auto-voicing</div>
              </div>
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-200">
                  Bars: <span className="font-semibold text-white">{numBars}</span>
                </label>
                <input
                  type="range"
                  min={8}
                  max={16}
                  value={numBars}
                  onChange={(e) => setNumBars(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />

                <label className="block text-sm text-slate-200">
                  Chords per bar: <span className="font-semibold text-white">{chordsPerBar}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={chordsPerBar}
                  onChange={(e) => setChordsPerBar(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />

                <label className="block text-sm text-slate-200">
                  Temperature: <span className="font-semibold text-white">{temperature.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  step={0.05}
                  min={0.5}
                  max={1.6}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-200">
                      Candidates
                      <span className="ml-1 font-semibold text-white">{numCandidates}</span>
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={numCandidates}
                      onChange={(e) => setNumCandidates(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-200">
                        top-k <span className="font-semibold text-white">{topK}</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={200}
                        value={topK}
                        onChange={(e) => setTopK(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-200">
                        top-p <span className="font-semibold text-white">{topP.toFixed(2)}</span>
                      </label>
                      <input
                        type="number"
                        min={0.5}
                        max={1.0}
                        step={0.01}
                        value={topP}
                        onChange={(e) => setTopP(Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Classic ii–V–I', bars: 12, density: 2, temp: 0.8 },
                    { label: 'Modern reharm', bars: 16, density: 3, temp: 1.2 },
                    { label: 'Ballad space', bars: 8, density: 1, temp: 0.65 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setNumBars(preset.bars)
                        setChordsPerBar(preset.density)
                        setTemperature(preset.temp)
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white transition hover:border-amber-300 hover:text-amber-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:shadow-amber-400/50 disabled:opacity-60"
                >
                  {isLoading ? 'Generating with transformer…' : 'Generate best-scored progression'}
                </button>
                {error && (
                  <div className="rounded-xl border border-red-300 bg-red-100/80 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white">How to run this locally</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-100">
                <li>
                  1) Activate the model env: <code className="rounded bg-white/10 px-2 py-1">cd /Users/lishi/Desktop/AdvanceTheroyDataSet/ChordProgressionTransformer && ../venv/bin/python web_generate.py --help</code>
                </li>
                <li>
                  2) Start the Next.js site: <code className="rounded bg-white/10 px-2 py-1">cd /Users/lishi/Documents/GitHub/ep390/website && npm run dev</code>
                </li>
                <li>
                  3) Click “Generate”—the API route calls <code className="rounded bg-white/10 px-1">web_generate.py</code> with your settings and returns the best candidate.
                </li>
              </ol>
              <p className="mt-3 text-xs text-slate-300">
                The backend reuses my trained transformer, applies frequency-aware voicing selection, generates N candidates, scores
                them, and streams the best-scored progression back to this page.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Live Output</p>
                  <h2 className="text-2xl font-semibold text-white">Best progression with voicing context</h2>
                </div>
                {result?.best?.score !== undefined && (
                  <div className="rounded-full bg-emerald-300/20 px-4 py-2 text-sm font-semibold text-emerald-100">
                    Score {result.best.score.toFixed(3)}
                  </div>
                )}
              </div>
              <div className="px-6 py-5">
                {bestBars.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-10 text-center text-slate-200">
                    Dial in settings and generate to see the transformer’s pick. Voicings will widen from FourWayClose →
                    DropTwo → Drop24 → DropThree when the frequency profile calls for it.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex flex-wrap gap-3">
                      <button
                        onClick={playProgression}
                        disabled={isPlaying}
                        className="rounded-full bg-emerald-300/90 px-4 py-2 text-sm font-semibold text-emerald-900 shadow hover:bg-emerald-200 disabled:opacity-60"
                      >
                        {isPlaying ? 'Playing…' : 'Play preview'}
                      </button>
                      <button
                        onClick={exportProgression}
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-amber-300 hover:text-amber-200"
                      >
                        Export progression (JSON)
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {bestBars.map((bar) => (
                        <BarCard key={bar.bar} bar={bar} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {result?.frequency_profile_used && (
                <div className="border-t border-white/10 bg-white/5 px-6 py-4 text-xs text-slate-200">
                  <div className="flex flex-wrap gap-4">
                    <span>Freq profile · dominant: {result.frequency_profile_used.dominant_band}</span>
                    <span>
                      bands: low {result.frequency_profile_used.band_energies.low.toFixed(2)} / mid{' '}
                      {result.frequency_profile_used.band_energies.mid.toFixed(2)} / high{' '}
                      {result.frequency_profile_used.band_energies.high.toFixed(2)}
                    </span>
                    <span>top-k {result.top_k} · top-p {result.top_p}</span>
                  </div>
                </div>
              )}
            </div>

            {result?.candidates && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Top candidates (sorted by score)</h3>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                    {result.candidates.length} shown of {result.num_candidates} generated
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {result.candidates.map((cand) => (
                    <CandidateCard key={cand.candidate_id} candidate={cand} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">What I built</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              <li>• A production-grade web bridge to my trained Chord Progression Transformer.</li>
              <li>• Full control over bars, chords-per-bar density, temperature, top-k/p, and candidate pool.</li>
              <li>• Automatic voicing transitions driven by averaged frequency profiles from the dataset.</li>
              <li>• Best-of-N scoring surfaced directly in the UI with voicing readout per bar.</li>
              <li>• Ready-to-run instructions for anyone to reproduce the exact generation stack locally.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">How AI is used</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              <li>• Transformer backbone trained on voicing-tagged jazz progressions (Berklee voicing taxonomy).</li>
              <li>• Temperature + top-k/top-p sampling to steer creativity and reharmonization density.</li>
              <li>• Frequency-aware voicing manager (FourWayClose → DropTwo → Drop24 → DropThree) to widen texture.</li>
              <li>• Multi-metric scoring (coherence, voice leading, texture variety, frequency balance, rhythmic consistency).</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">New vs midterm</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              <li>• Replaced mel-to-chord stub with the trained Chord Progression Transformer + voicing pipeline.</li>
              <li>• Added real frequency-driven voicing transitions and best-of-N selection rather than mock scoring.</li>
              <li>• Expanded controls: chords-per-bar reharm density, top-k/p, candidate count, and bar range.</li>
              <li>• Added backend bridge to the production checkpoint at <code className="rounded bg-white/10 px-1">/Users/lishi/Desktop/AdvanceTheroyDataSet/ChordProgressionTransformer</code>.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Reflection & next steps</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-100">
              <li>• AI accelerates voicing exploration—best-of-N scoring surfaces musical options faster than manual trial.</li>
              <li>• The frequency-aware voicing manager adds realism; future work: integrate real audio renders and MIDI export here.</li>
              <li>• Stretch: expose motive-level editing, push to a lightweight Flask/FastAPI daemon for persistent model memory, add audio demos.</li>
              <li>• I’d also like to profile generation time and cache vocab/model to keep round-trips under 2s in production.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
