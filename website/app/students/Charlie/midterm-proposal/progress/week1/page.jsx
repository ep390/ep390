export default function Week1Report() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Week 1 Progress Report</h1>
      
      {/* Project Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <div className="prose">
          <p>
            I'm building an app/plugin that helps users explore jazz chords and learn advanced chord progressions. 
            Think of it as a digital cookbook for jazz harmony - users can try different chord substitutions, 
            reharmonize jazz standards, and learn why they work.
          </p>
        </div>
      </section>

      {/* Research & Landscape Scan */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Research & Landscape Scan</h2>
        
        <h3 className="text-xl font-medium mb-3">Research Sources</h3>
        <ul className="mb-4">
          <li><strong><a href="https://github.com/tosiron/jazznet" className="text-blue-600 underline" target="_blank">JazzNet</a></strong>: Good reference for data format and basic modeling patterns</li>
          <li><strong><a href="https://chordseqai.com/app" className="text-blue-600 underline" target="_blank">chord-seq-ai app</a></strong>: Analyzed for UI ideas and user experience</li>
          <li><strong><a href="https://github.com/PetrIvan/chord-seq-ai-app" className="text-blue-600 underline" target="_blank">chord-seq-ai repo</a></strong>: Studied their code to understand how they represent chords and generate sequences</li>
        </ul>

        <h3 className="text-xl font-medium mb-3">Two Main Approaches</h3>
        <p className="mb-2">I'm comparing two different ways to build this:</p>
        <ol className="list-decimal list-inside mb-4">
          <li><strong>Rule-based approach</strong>: Use music theory rules (like secondary dominants, tritone substitutions) to generate progressions</li>
          <li><strong>AI learning approach</strong>: Train a model on existing jazz songs to learn what chord progressions work well together</li>
        </ol>
      </section>

      {/* Data Strategy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Strategy</h2>
        
        <h3 className="text-xl font-medium mb-3">What Makes Good Training Data</h3>
        <p className="mb-2">I figured out what the computer needs to learn jazz chords well:</p>
        <ul className="mb-4">
          <li><strong>Clear chord names</strong>: Key, Roman numerals (like ii-V-I), extensions (9th, 11th, 13th), alterations, slash bass</li>
          <li><strong>Timing info</strong>: Which bar and beat each chord happens on</li>
          <li><strong>Function labels</strong>: Whether chords are tonic, dominant, or predominant; cadences, tritone subs, borrowed chords</li>
          <li><strong>Style tags</strong>: Bebop, hard bop, contemporary jazz, pop-jazz crossovers</li>
          <li><strong>How to play them</strong>: Optional - specific ways to voice each chord</li>
        </ul>

        <h3 className="text-xl font-medium mb-3">Data Research</h3>
        <ul className="mb-4">
          <li>Started checking if existing datasets have all this information</li>
          <li>Figured out what data I might need to create or fix myself</li>
        </ul>
      </section>

      {/* Modeling Architecture Analysis */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Modeling Architecture Analysis</h2>
        
        <h3 className="text-xl font-medium mb-3">RNN vs. Transformer Models</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">RNN/LSTM/GRU:</h4>
            <ul className="text-sm">
              <li>• Simpler to build and understand</li>
              <li>• Good for short chord sequences</li>
              <li>• Works well with smaller datasets</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Transformers:</h4>
            <ul className="text-sm">
              <li>• Better for longer progressions</li>
              <li>• Can understand complex song structures</li>
              <li>• Can consider the whole song context</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-medium mb-3">How to Test if It Works</h3>
        <p className="mb-2">I need to check more than just "does it sound right":</p>
        <ul className="mb-4">
          <li>Do the chord progressions make musical sense?</li>
          <li>Do the voice leading (note movement) sound smooth?</li>
          <li>Do the cadences (endings) feel strong?</li>
          <li>Do real musicians think it sounds good?</li>
        </ul>
      </section>

      {/* Product Specification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Product Specification</h2>
        
        <h3 className="text-xl font-medium mb-3">Core User Flows</h3>
        <ol className="list-decimal list-inside mb-4">
          <li>Choose key & style</li>
          <li>Browse cookbook progressions (II–V–I variants, turnarounds, backdoor moves, Coltrane cycles)</li>
          <li>Audition with live playback</li>
          <li>View functional analysis</li>
          <li>Export as MIDI/lead-sheet</li>
        </ol>

        <h3 className="text-xl font-medium mb-3">Explainability Features</h3>
        <ul className="mb-4">
          <li>Show Roman numerals</li>
          <li>Arrows for tension–resolution</li>
          <li>Alternative reharm paths</li>
        </ul>

        <h3 className="text-xl font-medium mb-3">Safety Constraints</h3>
        <ul className="mb-4">
          <li>Keep diatonic anchors</li>
          <li>Allow substitutions with tunable "spice" control</li>
        </ul>
      </section>

      {/* Open Questions & Trade-offs */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Open Questions & Trade-offs</h2>
        <ol className="list-decimal list-inside mb-4">
          <li><strong>Data first vs. model first</strong>: Invest in gold-standard annotated set now, or stand up fast baselines and backfill curation?</li>
          <li><strong>Symbolic vs. audio</strong>: Start symbolic; consider audio-conditioned features later (e.g., melody-aware reharm)</li>
          <li><strong>Pedagogy vs. autonomy</strong>: How much to explain vs. just generate? Leaning toward explainable suggestions</li>
        </ol>
      </section>

      {/* What I Accomplished This Week */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What I Accomplished This Week</h2>
        <div className="grid gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">✅ Data Research</h3>
            <p className="text-sm text-gray-600">Figured out what makes good training data for jazz chords and started checking existing datasets</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">✅ Research Links</h3>
            <p className="text-sm text-gray-600">Found and studied JazzNet, chord-seq-ai, and other projects to understand different approaches</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">✅ Product Ideas</h3>
            <p className="text-sm text-gray-600">Designed the basic user flow and sketched out the "progression cookbook" concept</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">✅ Technical Planning</h3>
            <p className="text-sm text-gray-600">Made a plan to study the chord-seq-ai codebase to understand how they built their system</p>
          </div>
        </div>
      </section>

      {/* Potential Problems & Solutions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Potential Problems & Solutions</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Problem: Inconsistent chord names</h3>
            <p className="text-sm text-gray-600">Different datasets might call the same chord different names (like "Cmaj7" vs "CΔ7")</p>
            <p className="text-sm text-green-600"><strong>Solution:</strong> Build a converter that standardizes all chord names</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Problem: Not enough good data</h3>
            <p className="text-sm text-gray-600">Might not find enough high-quality jazz chord progression datasets</p>
            <p className="text-sm text-green-600"><strong>Solution:</strong> Create my own data or use rules to generate more examples</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-red-600 mb-2">Problem: Model sounds technical but not musical</h3>
            <p className="text-sm text-gray-600">The AI might generate progressions that are "correct" but don't sound good to musicians</p>
            <p className="text-sm text-green-600"><strong>Solution:</strong> Get real musicians to test and rate the results early</p>
          </div>
        </div>
      </section>

      {/* Next Week's Plan */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Next Week's Plan</h2>
        
        <h3 className="text-xl font-medium mb-3">Technical Goals</h3>
        <ol className="list-decimal list-inside mb-4">
          <li><strong>Build a simple model</strong>: Try both LSTM and Transformer to see which works better for chord sequences</li>
          <li><strong>Set up data processing</strong>: Figure out how to convert chord progressions into numbers the computer can understand</li>
          <li><strong>Make a working demo</strong>: Create a simple interface where users can pick a key and get chord progressions at different "spice" levels</li>
        </ol>

        <h3 className="text-xl font-medium mb-3">Research Goals</h3>
        <ol className="list-decimal list-inside mb-4">
          <li><strong>Study the chord-seq-ai code</strong>: Understand how they tokenize chords, train their model, and generate sequences</li>
          <li><strong>Decide on data strategy</strong>: Should I clean up existing datasets or create my own from scratch?</li>
        </ol>
      </section>

      {/* Key Insights */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Insights</h2>
        <ul className="list-disc list-inside">
          <li>I need to balance the technical AI work with making it actually useful for musicians</li>
          <li>Good data is really important - bad data will give bad results</li>
          <li>Users should be able to understand why the AI suggests certain progressions</li>
          <li>I could combine both rule-based and AI approaches for the best results</li>
        </ul>
      </section>

      {/* Back to Progress */}
      <section className="mb-8">
        <div className="text-center">
          <a href="../" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Progress Overview
          </a>
        </div>
      </section>
    </div>
  );
}
