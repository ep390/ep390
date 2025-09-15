---
title: "Assignment 3: Chord Instrument with Agentic Workflows"
excerpt: "Build a playable chord instrument using functional components, helper functions, and an agentic coding workflow."
---

- Due Date: 6 PM EST September 23, 2024
- Cutoff: 6 PM EST September 30, 2024

Remember to create a new branch before you start.

## Overview

In this assignment you will build a small instrument that plays chords in the browser. You’ll use functional components, write helper functions to compute note arrays, and lean on an agentic coding workflow (Cursor, Gemini, Claude, Copilot, etc.) to both implement and understand code. The goal is not just to make something that works, but to practice using an AI assistant to clarify concepts and improve your design.

## 1. Set Up

1. Make sure the class website dev server is running. If needed, see [Getting Started](/modules/getting-started).
1. Create a new branch for your work (for example `yourname-hw3`).
1. Create your homework directory at `website/app/students/your-name/hw3/` and a `page.jsx` (or `page.tsx`) inside it.

## 2. Build a Chord Instrument

You will create a parent component (for example `ChordInstrument`) and one or more child components (for example `ChordButton`).

- `ChordButton` must accept a `notes` prop that is an array of MIDI note numbers. Pressing the button should send note-on for all notes; releasing should send note-off for all notes (or implement latch if you prefer — see below).
- You should create helper functions that build these `notes` arrays. For example:
  - `buildTriad(root, quality)` returns a three-note triad.
  - `buildSeventh(root, quality)` returns a four-note seventh chord.
  - `applyVoicing(notes, voicing)` transforms a base chord into close/open/drop-2, etc.
  - `transpose(notes, semitones)` returns a transposed copy of the list of notes.

Suggested features (pick several):

- Root/Quality selectors (e.g., C, F#, minor, major, maj7, min7, dom7).
- Voicing selector: close, open, 1st/2nd inversion, drop-2.
- Octave control and/or transpose controls.
- Velocity control or velocity randomization range.
- Performance option: arpeggiator mode (up/down/random) or strum timing.
- Latch mode: first press = note-on, second press = note-off.

Keep your components small and composable. Prefer props for configuration. Avoid duplicating note logic inside components — that logic should live in the helper functions listed above.

## 3. Use an Agentic Workflow (Required)

Use an AI coding assistant to both implement and understand your code. As you work, ask the assistant to:

1. Explain how MIDI messages are being sent from your button to the output (where `noteOn`/`noteOff` flow through). Write 2–3 sentences in a comment near your `ChordButton` summarizing what you learned in your own words.
1. Help you refactor: if you find yourself copying the same array math, have the AI help you extract a helper such as `chordFromFormula(root, intervals)` or `applyVoicing`. Keep the helper pure and document its inputs/outputs in a short comment.

Tip: Ask your assistant to propose prop names and types for `ChordButton` and selector components, then edit as needed. Verify changes compile and work locally.

## 4. Clean Up

Make sure your page focuses on the chord instrument. Remove placeholder text copied from modules. Ensure your buttons render clearly and that the instrument is easy to use (labels, spacing, and basic Tailwind styling).

## 5. Submit Your Assignment

1. Push/sync your assignment branch to GitHub.
1. On GitHub, create a new Pull Request.

Important: Do not merge your own PR. Your instructor will review and merge it after grading.

## Grading Rubric

- **20** Your page renders correctly on the web
- **20** Your pull request changed only files in the correct directory (you may also modify your subdirectory in `public/` if needed)
- **15** Your file names and directory structure are correct (e.g., `website/app/students/your-name/hw3/page.jsx`)
- **15** You created a single branch dedicated only to the assignment
- **10** Your JSX/TSX has valid syntax and proper formatting
- **10** Your interface sends valid MIDI messages (correct note-on/note-off lifecycle)
- **10** Your instrument includes helper functions that build note arrays (e.g., triads/sevenths/voicings) and `ChordButton` receives a `notes` array prop
- **10** You added features beyond a single static chord (selectors, voicings, octave/transpose, velocity, latch, or arpeggiator/strum)
- **10** You used an agentic workflow and added brief comments summarizing what you learned (message flow and a refactor)

