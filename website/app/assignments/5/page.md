---
title: "Assignment 5: Composition with NotaGen (ABC + MIDI)"
excerpt: "Generate ABC scores with NotaGen, document experiments, export MIDI, and produce an original composition with audio."
---

- Due Date: 5pm October 7, 2025
- Cutoff: 6pm October 14, 2025

## Overview

In this assignment, you will collaborate with an AI model to create music. You will:

- Generate ABC notation scores with NotaGen
- Document at least three generation experiments (inputs, results, observations)
- Export MIDI from one of the generations
- Use the exported MIDI as source material for an original composition in your DAW
- Add an audio render of your composition to the site and write a short process note

## 1. Prepare Your Page

1. Create a new Git branch for your homework (e.g., `yourname-hw5`).
1. Open the template at: [assignments/5/hw5](/assignments/5/hw5/)
1. Copy that `hw5` directory into your student directory at `website/app/students/your-name/hw5/` so your page is at `website/app/students/your-name/hw5/page.jsx`.
1. Open your local page at `http://localhost:3000/students/your-name/hw5/` and verify it renders.

## 2. Run Generation Experiments with NotaGen

- Generate scores with NotaGen (free Hugging Face Space):
  - Repo: `https://github.com/ElectricAlexis/NotaGen`
  - Space: `https://huggingface.co/spaces/ElectricAlexis/NotaGen`

Document results in `hw5/page.jsx` (replace TODOs).

## 3. Create an Original Composition from the Model Output

1. Choose a musically interesting section (any length) from a generated score.
1. Export MIDI and import into your DAW.
1. Produce a short composition (≈30s or longer) using this material. Feel free to edit, orchestrate, reharmonize, and add layers.

## 4. Add Audio and Write Your Process Note

1. Place your rendered audio file in `website/public/students/your-name/`. Use a compressed audio format like `.mp3`.
1. Update the `<audio>` tag in your page so that `src` points to your file, for example:

```html
<audio src="/students/your-name/hw5.mp3" controls />
```

Ensure you completed all **TODO** placeholders in the template, including the
documentation of your composition process.

## 5. Submit Your Assignment

1. Commit your changes to your homework branch and push to GitHub.
1. Create a Pull Request (PR) from your branch to `main`.
1. Do not merge your own PR. Your instructor will review and merge it after grading.

## Grading Rubric

- **20** Template completed; all TODOs replaced with substantive content
- **20** Page renders correctly
- **10** PR changes only allowed directories (and `public/students/your-name/` if needed)
- **10** Correct filenames/structure (e.g., `.../hw5/page.jsx`)
- **10** Single, dedicated homework branch
- **15** Three experiments documented (inputs + observations) using provided components
- **15** Audio plays correctly on your page; file under `public/students/your-name/`
- **10** Concise process note on AI’s influence
- **10** No leftover template text
