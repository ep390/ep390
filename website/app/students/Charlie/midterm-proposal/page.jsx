export default function MidtermProposal() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Midterm Proposal</h1>
      
      {/* Section 1: What you would like to do */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What I Would Like to Do</h2>
        <div className="prose">
          <p>
            I'm studying Jazz composition and music theory. I want to build an app or plugin that helps users 
            explore jazz chords and learn advanced chord progressions - like a digital cookbook for jazz harmony.
          </p>
        </div>
      </section>

      {/* Section 2: HOW you will do it */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How I Will Do It</h2>
        <div className="prose">
          <p>
            I'll use machine learning to analyze jazz chord progressions and suggest new ones. Users can input a chord progression, 
            and the app will suggest 1-3 related progressions with explanations of why they work.
          </p>
          
          <h3 className="text-xl font-medium mt-4 mb-2">My Approach:</h3>
          <ul>
            <li><strong>Data Research:</strong> Study existing projects like <a href="https://github.com/tosiron/jazznet" className="text-blue-600 underline" target="_blank">JazzNet</a> and <a href="https://chordseqai.com/app" className="text-blue-600 underline" target="_blank">chord-seq-ai</a> to understand what makes good training data</li>
            <li><strong>Model Choice:</strong> Compare RNN vs Transformer models to see which works better for chord sequences</li>
            <li><strong>Deep Analysis:</strong> Study the <a href="https://github.com/PetrIvan/chord-seq-ai-app" className="text-blue-600 underline" target="_blank">chord-seq-ai codebase</a> to understand their approach</li>
            <li><strong>Implementation:</strong> Use PyTorch to build the model, then create either a web app or plugin</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Implementation Steps:</h3>
          <ol>
            <li>Research and collect/create dataset of jazz chord progressions in MIDI format</li>
            <li>Convert MIDI files to numerical representation (NCL format) suitable for CNN training</li>
            <li>Design and implement CNN model architecture using PyTorch for chord progression generation</li>
            <li>Train the model on the dataset and validate performance</li>
            <li>Build backend API to serve model predictions based on user input chord progressions</li>
            <li>Create frontend interface (web app or plugin) for users to input chords and receive suggestions</li>
            <li>Implement chord progression naming/labeling system to identify technical names (e.g., ii-V-I, tritone substitution, etc.)</li>
            <li>Test the system with various jazz progressions and refine model/interface</li>
          </ol>
        </div>
      </section>

      {/* Section 3: Questions, concerns, and stretch goals */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Questions, Concerns, and Stretch Goals</h2>
        <div className="prose">
          {/* TODO: List your questions, concerns, and stretch goals */}
          
          <h3 className="text-xl font-medium mt-4 mb-2">Questions:</h3>
          <ul>
            <li>Should I use RNN or Transformer models for generating chord progressions?</li>
            <li>How do I encode complex jazz chords (with 9th, 11th, 13th extensions) for the computer to understand?</li>
            <li>Do I need to create my own dataset or can I use existing ones?</li>
            <li>Should the model suggest one chord at a time or entire progressions?</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Concerns:</h3>
          <ul>
            <li>Finding good jazz chord progression data might take a long time</li>
            <li>Making complex jazz harmony work with machine learning could be tricky</li>
            <li>Training the model might need a powerful computer with GPU</li>
            <li>Balancing the technical ML work with building a user-friendly interface</li>
            <li>Making sure the generated progressions actually sound good and follow jazz theory</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Stretch Goals:</h3>
          <ul>
            <li>Let users hear the chord progressions with audio playback</li>
            <li>Show specific ways to play each chord (voicings), not just the chord names</li>
            <li>Add different jazz styles (bebop, modal jazz, etc.) so users can pick their preferred sound</li>
            <li>Create a "reverse lookup" - input a progression and find famous songs that use it</li>
            <li>Make it work as a plugin for music software (like Logic or Ableton)</li>
            <li>Explain why certain progressions work (music theory education)</li>
          </ul>
        </div>
      </section>

      {/* Progress section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress</h2>
        <div className="prose">
          <p>
            Weekly progress reports are documented in the <code>progress/</code> folder. 
            Each week includes research findings, technical decisions, and tangible outputs.
          </p>
          <div className="mt-4">
            <a href="./progress/" className="text-blue-600 hover:text-blue-800 underline">
              View Progress Reports →
            </a>
          </div>
        </div>
      </section>

      {/* Timeline section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
        <div className="prose">
          <ul>
            <li><strong>Week 1-2:</strong> Research and dataset collection/creation. Experiment with MIDI to numerical encoding methods.</li>
            <li><strong>Week 3:</strong> Design CNN model architecture and begin implementation in PyTorch.</li>
            <li><strong>Week 4:</strong> Train initial model version, evaluate results, and iterate on architecture if needed.</li>
            <li><strong>Week 5:</strong> Build basic web interface or plugin structure for user input and model integration.</li>
            <li><strong>Week 6:</strong> Implement chord progression labeling/naming system and refine UI/UX.</li>
            <li><strong>Week 7:</strong> Testing, debugging, and final refinements. Documentation and presentation preparation.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

