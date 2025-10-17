export default function MidtermProposal() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Midterm Proposal</h1>
      
      {/* Section 1: What you would like to do */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What I Would Like to Do</h2>
        <div className="prose">
          <p>
            My second major and minor is Jazz composition and theory of jazz and pop music theory. 
            I would like to create app or plugin that allows users to explore Jazz chords and advanced chord progression cookbook.
          </p>
        </div>
      </section>

      {/* Section 2: HOW you will do it */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How I Will Do It</h2>
        <div className="prose">
          <p>
            I will first convert chord progressions to MIDI files, then transform the MIDI files to NCL (numerical) files for the CNN model to generate chord progressions. 
            When a user inputs a chord progression, the app or plugin will suggest 1-3 chord progressions based on the input and list the technical names of the chord progressions.
          </p>
          
          <h3 className="text-xl font-medium mt-4 mb-2">Technical Requirements:</h3>
          <ul>
            <li>I will use PyTorch to train the CNN model and mido for MIDI file processing. I will also look for datasets from Hugging Face or create a self-made dataset.</li>
            <li>Then, after training the model, I will decide whether to make a web app or plugin.</li>
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
            <li>Is CNN the best model architecture for this task, or should I consider RNN/LSTM/Transformer models for sequential chord progression generation?</li>
            <li>What's the best way to encode jazz chords (with extensions like 9th, 11th, 13th) into numerical format for the model?</li>
            <li>How large of a dataset do I need to train an effective model? Will self-made data be sufficient or should I focus on finding existing datasets?</li>
            <li>Should the model predict single next chords or entire progression sequences?</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Concerns:</h3>
          <ul>
            <li>Finding or creating a comprehensive dataset of quality jazz chord progressions might be time-consuming</li>
            <li>Encoding complex jazz harmony (alterations, voicings, substitutions) into a format suitable for CNN training could be challenging</li>
            <li>Training time and computational resources needed for the model - may need access to GPU</li>
            <li>Balancing between creating a functional ML model and building a polished user interface within the midterm timeframe</li>
            <li>Ensuring the generated chord progressions are musically meaningful and follow jazz theory principles</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Stretch Goals:</h3>
          <ul>
            <li>Add audio playback so users can hear the suggested chord progressions</li>
            <li>Include voicing suggestions (specific note arrangements) for each chord, not just chord symbols</li>
            <li>Implement style selection (bebop, modal jazz, contemporary jazz, etc.) to generate progressions in different jazz sub-genres</li>
            <li>Add a reverse-lookup feature: input a chord progression and get similar famous jazz standards that use it</li>
            <li>Create a DAW plugin (VST/AU) instead of or in addition to the web app</li>
            <li>Include educational explanations of why certain progressions work (music theory insights)</li>
          </ul>
        </div>
      </section>

      {/* Optional: Timeline section */}
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

