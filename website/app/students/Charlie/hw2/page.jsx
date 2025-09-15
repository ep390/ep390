import React, { useCallback, useEffect, useMemo, useRef, useState, useContext, createContext } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'

import {
  useMidiContext,
  useMidiOutputSelection,
  MidiOutputSelector
} from '@/components/midi'

// ========================= Visual FX Engine  ========================= //

const VisualFXContext = createContext(null)

function VisualFXProvider({ children }) {
  const [particles, setParticles] = useState([])
  const nextId = useRef(0)

  const addParticle = useCallback((x, y, color) => {
    const id = nextId.current++
    setParticles(prev => [...prev, { id, x, y, color }])
  }, [])

  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id))
  }, [])

  const contextValue = useMemo(() => ({ addParticle }), [addParticle])

  return (
    <VisualFXContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {particles.map(p => (
          <ParticleBurst key={p.id} x={p.x} y={p.y} color={p.color} onComplete={() => removeParticle(p.id)} />
        ))}
      </AnimatePresence>
    </VisualFXContext.Provider>
  )
}

function useVisualFX() {
  const context = useContext(VisualFXContext)
  if (!context) {
    throw new Error('useVisualFX must be used within a VisualFXProvider')
  }
  return context
}

const PARTICLE_COUNT = 20 // More particles for a bigger burst
const PARTICLE_COLORS = ['#c07eff', '#fcbb00', '#00a544', '#155dfc']

function ParticleBurst({ x, y, onComplete, color }) {
  const burstColor = color || PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0"
      style={{ x, y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.3 }}
      onAnimationComplete={onComplete}
    >
      {/* Ripple */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2"
        style={{ borderColor: burstColor }}
        animate={{ scale: 1.5, opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
      />
      {/* Particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i / PARTICLE_COUNT) * 360
        const distance = 60 + Math.random() * 60 // Increased travel distance
        const particleSize = 3 + Math.random() * 4 // Larger and more varied particle sizes
        return (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              backgroundColor: burstColor,
              width: particleSize,
              height: particleSize,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle * (Math.PI / 180)) * distance,
              y: Math.sin(angle * (Math.PI / 180)) * distance,
              opacity: 0,
              scale: 0.5,
              rotate: Math.random() * 360, // Add random rotation
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.5 }}
          />
        )
      })}
    </motion.div>
  )
}


// ========================= Audio Engine ========================= //
const NOTE_ON = 0x90
const NOTE_OFF = 0x80

function midiNoteToFrequency(note) {
  return Math.pow(2, (note - 69) / 12) * 440
}

class AudioEngine {
  ctx = null
  master = null
  compressor = null
  reverb = null
  reverbWet = null
  lowEQ = null
  midEQ = null
  highEQ = null
  clickEnabled = false
  voices = new Map() // noteNumber -> { osc, gain, stop }
  analyser = null

  // Global ADSR (seconds / ratio)
  attack = 0.01
  decay = 0.12
  sustain = 0.6   // 0..1
  release = 0.18


  constructor() {
    this.clickHandler = this.clickHandler.bind(this)
  }

  async ensureStarted() {
    if (!this.ctx) {
      const Ctor = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
      if (!Ctor) return null
      this.ctx = new Ctor()

      // Master nodes
      this.master = this.ctx.createGain()
      this.master.gain.setValueAtTime(0.9, this.ctx.currentTime)

      this.compressor = this.ctx.createDynamicsCompressor()
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime)
      this.compressor.knee.setValueAtTime(30, this.ctx.currentTime)
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime)
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime)
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime)

      // EQ Nodes
      this.lowEQ = this.ctx.createBiquadFilter(); this.lowEQ.type = 'lowshelf'; this.lowEQ.frequency.value = 320;
      this.midEQ = this.ctx.createBiquadFilter(); this.midEQ.type = 'peaking'; this.midEQ.frequency.value = 1000; this.midEQ.Q.value = 0.8;
      this.highEQ = this.ctx.createBiquadFilter(); this.highEQ.type = 'highshelf'; this.highEQ.frequency.value = 3200;

      // Reverb Nodes
      this.reverb = this.ctx.createConvolver()
      this.reverb.buffer = this.makeImpulseResponse(1.1, 2.2)
      this.reverbWet = this.ctx.createGain()
      this.reverbWet.gain.setValueAtTime(0.2, this.ctx.currentTime) // Default reverb level

      // Routing: voice -> EQ chain -> compressor -> master -> destination
      // EQ chain is also sent to reverb
      this.lowEQ.connect(this.midEQ).connect(this.highEQ).connect(this.compressor)
      this.highEQ.connect(this.reverbWet) // Send to reverb
      this.reverbWet.connect(this.reverb).connect(this.compressor)
      this.compressor.connect(this.master)
      this.master.connect(this.ctx.destination)

            // ---- FFT analyser (for visualization) ----
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 1024            // 1024 点频谱（可视化较细腻）
      this.analyser.smoothingTimeConstant = 0.8
      // 并联监听主总线（不改变音频路径）
      this.master.connect(this.analyser)

    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    return this.ctx
  }

  makeImpulseResponse(duration = 1.1, decay = 2.2) {
    const rate = this.ctx.sampleRate
    const length = Math.max(1, rate * duration)
    const impulse = this.ctx.createBuffer(2, length, rate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
      }
    }
    return impulse
  }

  setReverb(value) { if (this.reverbWet) this.reverbWet.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01) }
  setLowEQ(value) { if (this.lowEQ) this.lowEQ.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01) }
  setMidEQ(value) { if (this.midEQ) this.midEQ.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01) }
  setHighEQ(value) { if (this.highEQ) this.highEQ.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01) }

  setAttack(v)  { this.attack  = Math.max(0, Math.min(5, Number(v) || 0)) }
  setDecay(v)   { this.decay   = Math.max(0, Math.min(5, Number(v) || 0)) }
  setSustain(v) { this.sustain = Math.max(0, Math.min(1, Number(v) || 0)) }
  setRelease(v) { this.release = Math.max(0, Math.min(8, Number(v) || 0)) }


  playNote(noteNumber, velocity = 127, type = 'sine', sustainMs = 400) {
    if (!this.ctx) return null
    const t0 = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(midiNoteToFrequency(noteNumber), t0)

    const v = Math.max(0.05, Math.min(1, velocity / 127))

    // ADSR-ish envelope
    const attack = 0.01; const decay = 0.1; const sustain = 0.55 * v
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.2, v), t0 + attack)
    gain.gain.exponentialRampToValueAtTime(sustain, t0 + attack + decay)
    // ---- ADSR envelope (global) ----
    const a = this.attack
    const d = this.decay
    const sLevel = Math.max(0.0001, this.sustain * v) // sustain 按力度缩放
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.2, v), t0 + Math.max(0.001, a))
    gain.gain.exponentialRampToValueAtTime(sLevel,         t0 + Math.max(0.001, a) + Math.max(0.001, d))
    
    osc.connect(gain)
    gain.connect(this.lowEQ) // Connect voice to the start of the EQ chain
    osc.start(t0)

    const stop = (releaseMs = null) => {
      const now = this.ctx.currentTime
      const r = (releaseMs != null ? releaseMs / 1000 : this.release) // 允许外部传 ms，否则用全局 release(s)
      const end = now + Math.max(0.01, r)
      try {
        gain.gain.cancelScheduledValues(now)
        // 用 exp ramp 防止pop
        gain.gain.exponentialRampToValueAtTime(0.0001, end)
        osc.stop(end + 0.02)
      } catch {}
    }


    const timer = setTimeout(() => stop(140), sustainMs)
    const voice = { osc, gain, stop, _timer: timer }
    this.voices.set(noteNumber, voice)
    return voice
  }

  noteOff(noteNumber, _releaseMs = 100) {
    const voice = this.voices.get(noteNumber)
    if (voice) {
      clearTimeout(voice._timer)
      voice.stop()                 // 不传参 => 使用 engine.release
      this.voices.delete(noteNumber)
    }
  }


  clickHandler = (e) => {
    if (!this.ctx) return
    const tag = (e.target?.tagName || '').toLowerCase()
    if (['input', 'select', 'textarea'].includes(tag)) return
    if (e.target?.closest?.('[data-no-page-click]')) return

    const pentatonic = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69]
    const n = pentatonic[Math.floor(Math.random() * pentatonic.length)]
    const types = ['triangle', 'sine', 'sawtooth']
    const type = types[Math.floor(Math.random() * types.length)]
    this.playNote(n, 110, type, 220)
    const { addParticle } = useVisualFX.getState ? useVisualFX.getState() : { addParticle: () => {} }
    addParticle(e.clientX, e.clientY, '#a855f7')
  }

  enablePageClicks() {
    if (this.clickEnabled) return
    document.addEventListener('pointerdown', this.clickHandler, { passive: true })
    this.clickEnabled = true
  }

  disablePageClicks() {
    if (!this.clickEnabled) return
    document.removeEventListener('pointerdown', this.clickHandler)
    this.clickEnabled = false
  }
}

const engine = new AudioEngine()

// ========================= UI Components ========================= //

export default function MidiPage() {
  const { error } = useMidiContext()

  useEffect(() => {
    return () => engine.disablePageClicks()
  }, [])

  return (
    <VisualFXProvider>
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className={`${styles.markdownContent} space-y-6`}>
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">MIDI & Web Audio Playground</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  An interactive instrument with MIDI output, a built-in synth, and visual effects.
                </p>
              </div>
              <AudioGate />
            </header>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <MidiOutputSelector />
                <PageClickToggle />
              </div>
              <p className="text-sm text-zinc-400">
                Select a MIDI Output or just use the built-in synthesizer.
              </p>
            </section>

            <FXControls />

             <ADSRControls />

            <FFTVisualizer height={180} />

            <KeyboardRow notes={[48, 50, 52, 55, 57, 60, 62, 64, 67, 69]} labels={["C3","D3","E3","G3","A3","C4","D4","E4","G4","A4"]} />

            <Pads />

            {error && <p className="text-red-400 mt-2">{error}</p>}
            <ModuleFooter />
          </div>
        </div>
      </div>
    </VisualFXProvider>
  )
}

function AudioGate() {
  const [ready, setReady] = useState(false)

  const start = useCallback(async () => {
    const ctx = await engine.ensureStarted()
    if (ctx) setReady(true)
  }, [])

  return (
    <button
      onClick={start}
      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all data-[on=true]:bg-emerald-600 data-[on=true]:border-emerald-500 data-[on=true]:text-white ${
        ready ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-400/20' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
      }`}
      aria-pressed={ready}
      data-on={ready}
      title="Initialize AudioContext"
    >
      {ready ? 'Audio On' : 'Enable Audio'}
    </button>
  )
}

function PageClickToggle() {
  const [enabled, setEnabled] = useState(false)

  const onToggle = useCallback(async () => {
    await engine.ensureStarted()
    setEnabled((prev) => {
      const next = !prev
      if (next) engine.enablePageClicks()
      else engine.disablePageClicks()
      return next
    })
  }, [])

  useEffect(() => () => engine.disablePageClicks(), [])

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
        enabled
          ? 'bg-indigo-600/90 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
          : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:border-zinc-600'
      }`}
      data-no-page-click
    >
      <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-lime-300 animate-pulse' : 'bg-zinc-500'}`} />
      {enabled ? 'Page Clicks On' : 'Page Clicks Off'}
    </button>
  )
}

function Knob({ label, value, onChange, min = 0, max = 1, step = 0.01 }) {
  const knobY = useMotionValue(value)
  const rotation = useTransform(knobY, [min, max], [-135, 135])

  const clamp = (v) => Math.max(min, Math.min(max, v))

  const handlePan = useCallback((_, info) => {
    // 向上拖 -> 增加；向下拖 -> 减少
    const delta = -info.delta.y
    const range = max - min
    const next = clamp(value + (delta / 100) * range)
    const stepped = Math.round(next / step) * step
    onChange(stepped)   // 更新外部状态
    knobY.set(stepped)  // 立即更新旋转（不用等父组件回流）
  }, [value, min, max, step, onChange, knobY])

  useEffect(() => {
    knobY.set(value)
  }, [value, knobY])

  return (
    <div className="flex flex-col items-center gap-2" data-no-page-click>
      <motion.div
        onPanStart={(e) => { e.preventDefault() }}  // 防止选择/滚动干扰
        onPan={handlePan}
        className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-zinc-600 flex items-center justify-center cursor-ns-resize touch-none"
      >
        <motion.div
          className="w-1 h-8 bg-zinc-400 rounded-full"
          style={{ rotate: rotation, transformOrigin: '50% 100%' }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </motion.div>
      <label className="text-xs text-zinc-400 font-mono select-none">{label}</label>
      <span className="text-sm font-mono text-white select-none">{Number(value).toFixed(2)}</span>
    </div>
  )
}



function FXControls() {
  const [reverb, setReverb] = useState(0.2)
  const [lowEQ, setLowEQ] = useState(0)
  const [midEQ, setMidEQ] = useState(0)
  const [highEQ, setHighEQ] = useState(0)

  useEffect(() => { engine.setReverb(reverb) }, [reverb])
  useEffect(() => { engine.setLowEQ(lowEQ) }, [lowEQ])
  useEffect(() => { engine.setMidEQ(midEQ) }, [midEQ])
  useEffect(() => { engine.setHighEQ(highEQ) }, [highEQ])

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-lg font-semibold mb-4">Effects</h2>
      <div className="flex flex-wrap justify-around gap-4" data-no-page-click>
        <Knob label="Reverb" value={reverb} onChange={setReverb} min={0} max={1} />
        <Knob label="Low EQ" value={lowEQ} onChange={setLowEQ} min={-24} max={24} step={0.1} />
        <Knob label="Mid EQ" value={midEQ} onChange={setMidEQ} min={-24} max={24} step={0.1} />
        <Knob label="High EQ" value={highEQ} onChange={setHighEQ} min={-24} max={24} step={0.1} />
      </div>
    </section>
  )
}

function ADSRControls() {
  const [attack, setAttack]   = useState(0.01)
  const [decay, setDecay]     = useState(0.12)
  const [sustain, setSustain] = useState(0.6)
  const [release, setRelease] = useState(0.18)

  useEffect(() => { engine.setAttack(attack) }, [attack])
  useEffect(() => { engine.setDecay(decay) }, [decay])
  useEffect(() => { engine.setSustain(sustain) }, [sustain])
  useEffect(() => { engine.setRelease(release) }, [release])

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-lg font-semibold mb-4">ADSR Envelope</h2>
      <div className="flex flex-wrap gap-6 items-center" data-no-page-click>
        <div className="flex flex-col items-center">
          <Knob label="Attack" value={attack} onChange={setAttack} min={0} max={2} step={0.01} />
          <span className="mt-1 text-xs text-zinc-400">{attack.toFixed(2)} s</span>
        </div>
        <div className="flex flex-col items-center">
          <Knob label="Decay" value={decay} onChange={setDecay} min={0} max={3} step={0.01} />
          <span className="mt-1 text-xs text-zinc-400">{decay.toFixed(2)} s</span>
        </div>
        <div className="flex flex-col items-center">
          <Knob label="Sustain" value={sustain} onChange={setSustain} min={0} max={1} step={0.01} />
          <span className="mt-1 text-xs text-zinc-400">{Math.round(sustain*100)}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Knob label="Release" value={release} onChange={setRelease} min={0} max={4} step={0.01} />
          <span className="mt-1 text-xs text-zinc-400">{release.toFixed(2)} s</span>
        </div>
      </div>
    </section>
  )
}

function FFTVisualizer({ height = 160, barWidth = 3, gap = 1 }) {
  const canvasRef = useRef(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let raf = null
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
    const ctx = canvas.getContext('2d')

    function loop() {
      const analyser = engine.analyser
      if (!analyser || !engine.ctx) {
        setOk(false)
        raf = requestAnimationFrame(loop)
        return
      }
      setOk(true)

      const fftSize = analyser.frequencyBinCount
      const data = new Uint8Array(fftSize)
      analyser.getByteFrequencyData(data)

      // 尺寸自适应
      const rect = canvas.getBoundingClientRect()
      const W = Math.max(320, Math.floor(rect.width))
      const H = height
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr
        canvas.height = H * dpr
        canvas.style.width = W + 'px'
        canvas.style.height = H + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      // 背景
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // 渐变
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0,   '#a78bfa')  // violet-400
      grad.addColorStop(0.5, '#22d3ee')  // cyan-400
      grad.addColorStop(1,   '#34d399')  // emerald-400
      ctx.fillStyle = grad

      // 选择若干频点绘制（下采样以保证柱宽+间距）
      const step = Math.max(1, Math.floor((barWidth + gap) * 2)) // 简单步进
      const bars = Math.floor(W / (barWidth + gap))
      for (let i = 0; i < bars; i++) {
        const idx = Math.min(data.length - 1, i * step)
        const mag = data[idx] / 255    // 0..1
        const h = Math.max(2, mag * (H - 4))
        const x = i * (barWidth + gap)
        const y = H - h
        ctx.fillRect(x, y, barWidth, h)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => raf && cancelAnimationFrame(raf)
  }, [height, barWidth, gap])

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Spectrum (FFT)</h2>
        <span className={`text-xs ${ok ? 'text-emerald-400' : 'text-zinc-500'}`}>
          {ok ? 'listening...' : 'enable audio to start'}
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full block rounded-lg bg-black/60" style={{ height }} />
    </section>
  )
}


function KeyboardRow({ notes, labels }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-lg font-semibold mb-3">Quick Keys</h2>
      <div className="flex flex-wrap gap-3" data-no-page-click>
        {notes.map((n, i) => (
          <NoteButton key={n} noteNumber={n} label={labels?.[i]} />
        ))}
      </div>
    </section>
  )
}

function Pads() {
  const grid = useMemo(() => [
    { n: 48, l: 'C3' }, { n: 50, l: 'D3' }, { n: 52, l: 'E3' }, { n: 55, l: 'G3' },
    { n: 57, l: 'A3' }, { n: 60, l: 'C4' }, { n: 62, l: 'D4' }, { n: 64, l: 'E4' }
  ], [])
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-lg font-semibold mb-3">Pads</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-no-page-click>
        {grid.map(({ n, l }) => (
          <NotePad key={n} noteNumber={n} label={l} />
        ))}
      </div>
    </section>
  )
}

function NotePad({ noteNumber, label }) {
  const { selectedOutput } = useMidiOutputSelection()
  const [pressed, setPressed] = useState(false)
  const { addParticle } = useVisualFX()

  const onDown = useCallback(async (e) => {
    await engine.ensureStarted()
    if (selectedOutput) selectedOutput.send([NOTE_ON, noteNumber, 127])
    engine.playNote(noteNumber, 127, 'triangle', 500)
    setPressed(true)
    if (e.clientX && e.clientY) {
      addParticle(e.clientX, e.clientY, '#10b981')
    }
  }, [noteNumber, selectedOutput, addParticle])

  const onUp = useCallback(() => {
    if (selectedOutput) selectedOutput.send([NOTE_OFF, noteNumber, 0])
    engine.noteOff(noteNumber, 120)
    setPressed(false)
  }, [noteNumber, selectedOutput])

  return (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        onDown({ clientX: touch.clientX, clientY: touch.clientY })
      }}
      onTouchEnd={(e) => { e.preventDefault(); onUp() }}
      className={`aspect-square rounded-2xl border text-left p-4 flex flex-col justify-between transition-all select-none ${
        pressed
          ? 'scale-[1.02] border-emerald-500 bg-emerald-600/20 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]'
          : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-500'
      }`}
      data-no-page-click
    >
      <span className="text-2xl font-semibold">{label || noteNumber}</span>
      <span className="text-xs text-zinc-400">MIDI {noteNumber}</span>
    </button>
  )
}

function NoteButton({ noteNumber, label }) {
  const { selectedOutput } = useMidiOutputSelection()
  const [isPressed, setIsPressed] = useState(false)
  const { addParticle } = useVisualFX()

  const sendNoteOn = useCallback(async (e) => {
    await engine.ensureStarted()
    if (selectedOutput) selectedOutput.send([NOTE_ON, noteNumber, 127])
    engine.playNote(noteNumber, 127, 'sine', 420)
    setIsPressed(true)
    if (e?.clientX && e?.clientY) {
      addParticle(e.clientX, e.clientY, '#10b981')
    }
  }, [noteNumber, selectedOutput, addParticle])

  const sendNoteOff = useCallback(() => {
    if (selectedOutput) selectedOutput.send([NOTE_OFF, noteNumber, 0])
    engine.noteOff(noteNumber, 120)
    setIsPressed(false)
  }, [noteNumber, selectedOutput])

  // Keyboard shortcuts (A/S/D/F... row)
  useEffect(() => {
    const map = {
      KeyA: 48, KeyS: 50, KeyD: 52, KeyF: 55, KeyG: 57, KeyH: 60, KeyJ: 62, KeyK: 64
    }
    const down = (e) => {
      const n = map[e.code]
      if (n === noteNumber && !isPressed) {
        sendNoteOn()
        addParticle(window.innerWidth / 2, window.innerHeight / 2, '#10b981')
      }
    }
    const up = (e) => {
      const n = map[e.code]
      if (n === noteNumber && isPressed) sendNoteOff()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [isPressed, noteNumber, sendNoteOff, sendNoteOn, addParticle])

  return (
    <button
      onMouseDown={sendNoteOn}
      onMouseUp={sendNoteOff}
      onMouseLeave={sendNoteOff}
      onTouchStart={(e) => {
        e.preventDefault()
        const touch = e.touches[0]
        sendNoteOn({ clientX: touch.clientX, clientY: touch.clientY })
      }}
      onTouchEnd={(e) => { e.preventDefault(); sendNoteOff() }}
      className={`px-4 py-2 rounded-xl text-white disabled:opacity-50 cursor-pointer transition-transform duration-100 ease-in-out data-[pressed=true]:bg-emerald-700 ${
        isPressed ? 'bg-emerald-600 scale-105 shadow-lg shadow-emerald-400/40' : 'bg-emerald-600/90 hover:bg-emerald-600'
      }`}
      data-pressed={isPressed}
      data-no-page-click
    >
      {label ? `Play ${label}` : `Play ${noteNumber}`}
    </button>
  )
}
