---
title: "Wanlin's Final Project Proposal — BlockSeq: A Generative-AI–Assisted Interactive Music System"
author:
  name: Wanlin Huang
---

## BlockSeq — A Block-Based Musical Sequencer (Final Project Proposal)

### What I Would Like to Do

For my final project, I propose **BlockSeq**, an interactive block-based musical sequencer inspired by DAW drum racks, step sequencers, and children's building blocks.

The project explores whether musical structure, rhythm, and harmony can be learned and created through a simple, visual, and tactile metaphor: placing colored blocks on a grid.

Unlike typical step sequencers, BlockSeq integrates:

- Two musical layers (Rhythm + Melody)
- Stackable blocks that change velocity
- Multiple synthesis engines (kick, snare, hats, bass, pad)
- Scale-locked melody + auto chord generation
- Customizable playback modes (normal, reverse, ping-pong)

It is a hybrid between a musical toy, a teaching tool, and an experimental composition interface.

This is a new project (not a continuation of my midterm) and is significantly more ambitious in scope, interaction complexity, synthesis design, and generative behavior.

### How I Will Do It

BlockSeq will be implemented as a stand-alone interactive web page using:

#### 1. UI + Interaction

- A clean, minimal 8×8 grid for block placement
- A color palette with draggable blocks (kick, snare, hats, bass, pad)
- Two layers:
  - Rhythm Layer for percussive patterns
  - Melody Layer for basslines, melodies, and pads
- Each cell stores `{ type, velocity }`, with velocity determined by stacking blocks (1–3)

#### 2. Sound Engine

Using Tone.js, I will build a custom set of instruments:

- Kick → MembraneSynth
- Snare → NoiseSynth with filtering
- Closed Hat → short decay noise
- Open Hat → long decay noise
- Bass → MonoSynth
- Pad → PolySynth (triad generation)

Velocity affects amplitude and brightness.

#### 3. Musical Logic

- Playback modes: normal / reverse / ping-pong
- Melody Layer uses Scale Lock:
  - Major
  - Minor
  - Pentatonic
- Pad blocks generate triads based on the selected scale
- Bass uses root notes of the scale
- Each row represents time; each column represents instrument/pitch mapping

#### 4. Generative AI Assistance

Generative AI will be used in three major ways:

**a. AI-assisted coding**

Using Cursor (GPT-5), I will:

- Generate sound synthesis code
- Create the playback system
- Debug drag-and-drop interactions
- Implement scale-locked harmony
- Optimize the user interface

This is essential because Tone.js synthesis, event scheduling, and UI logic are complex.

**b. AI-assisted design explorations**

ChatGPT will help me:

- Explore mapping strategies (velocity, block patterns → musical meaning)
- Consider user experience for children
- Refine visual style and system rules

**c. Future stretch: shape-based generative patterns**

If time permits, I may integrate a lightweight rule-based "pattern generator":

- L-shape triggers swing grooves
- Lines generate arpeggios
- Squares generate sustained pads

*(Not required for MVP but possible with AI help.)*

### How This Project Is More Ambitious Than the Midterm

My midterm was a smaller, less interactive, and less musically complex project (you can briefly mention your midterm theme here if needed).

BlockSeq represents a major leap in:

#### 1. Interaction Complexity

- **Midterm:** single-mode interface
- **Final:**
  - dual-layer grid
  - velocity stacking
  - drag-and-drop palette
  - playback modes
  - scale system
  - two simultaneous musical engines

#### 2. Sound & Musical Design

- **Midterm:** simpler audio logic
- **Final:**
  - full synthesis engine
  - polyphonic chord generation
  - multiple instrument types
  - tonal system
  - timing and scheduling control

#### 3. Generative Behavior

- **Midterm:** limited generative logic
- **Final:**
  - scale-driven note generation
  - algorithmic triads
  - potential pattern rules
  - AI-assisted development and exploration

#### 4. Ambition + Scope

This final project functions as:

- a small DAW
- a music toy
- a learning tool
- an interactive artwork
- a generative musical environment

### Questions, Concerns, and Stretch Goals

#### Questions / Concerns

- Managing two independent musical layers with Tone.Transport scheduling
- Ensuring UI responsiveness when many blocks update
- Creating intuitive mappings for velocity stacking
- Balancing simplicity (toy) with depth (instrument)
- Implementing scale logic without overcomplicating the UI

#### Stretch Goals (if time permits)

- Shape-based algorithmic pattern generation
- Probability per step (like Ableton Live)
- Animated block behaviors or playful visuals
- Auto-harmony engine (detect user motif → harmonize)

