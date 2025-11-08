{/* 
Midterm Project Proposal
Title: Modular Functions Review — Interactive Quiz Website
Student: Wanlin Huang
Tech Stack: HTML + CSS + vanilla JavaScript (no frameworks; no Max embedding)

Overview:
I will build a lightweight website to review core modular functions—VCO, VCF, VCA (2Q vs. 4Q), Envelope (Gate/ADSR), LFO, Attenuator, Mixer—through short lessons and quiz-style activities.
Audio demos will illustrate concepts (e.g., filter sweeps, tremolo vs. vibrato).
The site aims to mirror quick, in-class checks to reinforce learning.

Learning Goals:
• Reinforce vocabulary and signal vs. control concepts.
• Practice by-ear identification using short audio examples.
• Test signal-flow logic (ordering/routing).
• Prepare for exams via targeted, low-friction quizzes.

Content & Quiz Modes:
1. Module Cards (Study Mode)
   One-paragraph definitions + small diagrams for VCO, VCF, VCA, Envelope, LFO, Attenuator, Mixer.
2. Terminology Quiz
   Multiple choice / fill-in questions for definitions and voltage ranges (e.g., Eurorack ±12V).
3. Signal Flow Ordering
   Drag-and-drop or up/down ordering (e.g., VCO → VCF → VCA → Output).
4. By-Ear ID (Audio Quiz)
   Play a clip and identify: tremolo or vibrato? LPF or HPF sweep? AM or FM feel?
   (Audio via <audio> tags; files recorded/rendered in DAW and exported as .wav/.mp3.)
5. Patch Troubleshooting
   Given a short description + diagram, choose the fix (e.g., missing Gate vs. VCA closed).

Audio Plan:
I’ll render short, clean examples in my DAW:
• Tremolo (LFO→VCA), Vibrato (LFO→VCO pitch)
• LPF vs. HPF sweeps
• AM/FM textures
• ADSR variations
Normalize to consistent loudness for fair comparisons.

Technical Approach:
• Static HTML/CSS/JS site hosted on GitHub Pages.
• JS handles quiz logic and scoring.
• Accessible (keyboard-friendly, clear labels, visible focus, high contrast).

File Structure:
  /modular-quiz
    index.html
    quiz.html
    /css/styles.css
    /js/quiz.js
    /js/questions.js
    /audio/
    /img/
    README.md

Milestones:
Week 1 – draft content + audio examples + question bank
Week 2 – study mode + terminology quiz
Week 3 – audio quiz + flow ordering + polish + README

Risks & Mitigation:
• Cannot embed Max patches → use pre-rendered audio
• Limited time → focus on terminology + audio quiz first

Success Criteria:
• At least 6 module cards
• 20+ quiz questions across 3 modes
• Audio plays reliably; scoring works; README complete
*/}
