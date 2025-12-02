export default function FinalProposal() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Final Project Proposal</h1>
      
      {/* Section 1: What you would like to do */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What I Would Like to Do</h2>
        <div className="prose">
          <p>
            Building on my midterm project, I want to create a comprehensive, high-quality dataset for jazz chord progression generation 
            that is grounded in Berklee College of Music's advanced harmony and voicing theory. This dataset will incorporate 
            sophisticated voicing techniques, particularly <strong>Four Way Close</strong> voicing and other advanced voicing methods 
            taught in Berklee's curriculum, to provide a robust foundation for training AI models in jazz harmony.
          </p>
          
          <p>
            The goal is to develop an effective dataset that not only improves the quality of generated chord progressions but also 
            serves as a valuable resource for future research and development in AI-powered jazz composition. This dataset will 
            encode not just chord symbols, but the specific voicing arrangements and voice-leading principles that make jazz harmony 
            sound authentic and musically sophisticated.
          </p>
        </div>
      </section>

      {/* Section 2: Summary of Midterm Accomplishments */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Midterm Project Summary</h2>
        <div className="prose">
          <p>
            In my midterm project, I successfully created a jazz chord progression generator using a PyTorch-based MTSF (Mel-Spectrogram 
            to Sequence Framework) model. The project included:
          </p>
          
          <ul>
            <li><strong>Model Architecture:</strong> Implemented a CNN-based model that generates chord progressions from mel-spectrogram representations</li>
            <li><strong>Web Interface:</strong> Built an interactive React/Next.js frontend with real-time chord progression input and generation</li>
            <li><strong>MIDI Integration:</strong> Integrated MIDI playback and export functionality for generated progressions</li>
            <li><strong>Pattern Analysis:</strong> Implemented automatic detection of common jazz patterns (ii-V-I, I-vi-IV-V, etc.)</li>
            <li><strong>Quality Evaluation:</strong> Created a quality scoring system to evaluate generated progressions</li>
            <li><strong>Flask API Backend:</strong> Developed a RESTful API connecting the frontend to the PyTorch model</li>
          </ul>
          
          <p>
            The midterm project demonstrated proof-of-concept for AI-generated jazz harmony, but was limited by the dataset quality 
            and lack of sophisticated voicing information. The model generated chord symbols but didn't capture the nuanced voicing 
            arrangements that are essential to authentic jazz harmony.
          </p>
        </div>
      </section>

      {/* Section 3: HOW you will do it */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How I Will Do It</h2>
        <div className="prose">
          <h3 className="text-xl font-medium mt-4 mb-2">Dataset Creation Strategy</h3>
          
          <p>
            I will create a comprehensive dataset based on Berklee College of Music's harmony curriculum, focusing on:
          </p>
          
          <h4 className="text-lg font-medium mt-3 mb-2">1. Four Way Close Voicing Implementation</h4>
          <ul>
            <li>Implement Four Way Close voicing algorithm - a Berklee-specific technique for arranging 4-note chords in close position</li>
            <li>Apply proper voice leading principles between chords in progressions</li>
            <li>Ensure smooth voice movement (common tones, stepwise motion, minimal leaps)</li>
            <li>Handle chord extensions (9ths, 11ths, 13ths) within the Four Way Close framework</li>
          </ul>
          
          <h4 className="text-lg font-medium mt-3 mb-2">2. Additional Voicing Methods</h4>
          <ul>
            <li><strong>Drop Voicings:</strong> Drop 2, Drop 3, Drop 2 & 4 voicings for different harmonic textures</li>
            <li><strong>Open Voicings:</strong> Spread voicings with wider intervals for fuller sound</li>
            <li><strong>Upper Structure Triads:</strong> Triads over bass notes for modern jazz harmony</li>
            <li><strong>Shell Voicings:</strong> Minimal voicings (root, 3rd, 7th) for comping patterns</li>
            <li><strong>Cluster Voicings:</strong> Close-interval voicings for contemporary jazz sounds</li>
          </ul>
          
          <h4 className="text-lg font-medium mt-3 mb-2">3. Dataset Structure and Encoding</h4>
          <ul>
            <li><strong>Multi-format Representation:</strong> Each progression will be stored in multiple formats:
              <ul>
                <li>Chord symbols (e.g., "Cmaj7", "Dm7")</li>
                <li>MIDI note arrays with specific voicings</li>
                <li>Numerical encoding for model training</li>
                <li>MusicXML for score representation</li>
              </ul>
            </li>
            <li><strong>Metadata Tags:</strong> Each entry will include:
              <ul>
                <li>Voicing type (Four Way Close, Drop 2, etc.)</li>
                <li>Jazz style (Bebop, Modal, Contemporary, etc.)</li>
                <li>Progression type (ii-V-I, Turnaround, etc.)</li>
                <li>Difficulty level</li>
                <li>Voice leading quality score</li>
              </ul>
            </li>
          </ul>
          
          <h4 className="text-lg font-medium mt-3 mb-2">4. Data Generation Process</h4>
          <ol>
            <li><strong>Progression Collection:</strong> Gather common jazz progressions from Berklee harmony textbooks and jazz standards</li>
            <li><strong>Voicing Application:</strong> Systematically apply each voicing method to every progression</li>
            <li><strong>Voice Leading Optimization:</strong> Use algorithms to ensure smooth voice leading between chords</li>
            <li><strong>Quality Validation:</strong> Verify each voicing follows Berklee theory principles</li>
            <li><strong>Augmentation:</strong> Create variations through transposition, inversion, and substitution</li>
            <li><strong>Export Formats:</strong> Generate MIDI files, numerical arrays, and documentation</li>
          </ol>
          
          <h3 className="text-xl font-medium mt-4 mb-2">Technical Implementation</h3>
          
          <h4 className="text-lg font-medium mt-3 mb-2">Tools and Technologies:</h4>
          <ul>
            <li><strong>Python:</strong> Core dataset generation and processing</li>
            <li><strong>music21:</strong> Music theory analysis and MusicXML generation</li>
            <li><strong>mido:</strong> MIDI file creation and manipulation</li>
            <li><strong>NumPy:</strong> Numerical array processing for model training</li>
            <li><strong>Pandas:</strong> Dataset organization and metadata management</li>
            <li><strong>JSON/CSV:</strong> Structured data storage</li>
          </ul>
          
          <h4 className="text-lg font-medium mt-3 mb-2">Dataset Location:</h4>
          <p>
            The dataset will be organized in: <code className="bg-gray-100 px-2 py-1 rounded">/Users/lishi/Desktop/AdvanceTheroyDataSet/ReharmonizeChordProgressionExtension/FourWayClose</code>
          </p>
          
          <h4 className="text-lg font-medium mt-3 mb-2">Integration with Existing Model:</h4>
          <ul>
            <li>Retrain the midterm MTSF model on the new dataset</li>
            <li>Extend the model to predict voicing types in addition to chord symbols</li>
            <li>Update the web interface to display and play voicings</li>
            <li>Add voicing selection controls to the generation interface</li>
          </ul>
        </div>
      </section>

      {/* Section 4: How This Expands the Project */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How This Substantially Expands the Project</h2>
        <div className="prose">
          <p>
            This final project represents a significant expansion beyond the midterm in several key ways:
          </p>
          
          <h3 className="text-xl font-medium mt-4 mb-2">1. Depth of Musical Knowledge</h3>
          <ul>
            <li><strong>Midterm:</strong> Basic chord symbol generation with simple voicing assumptions</li>
            <li><strong>Final:</strong> Sophisticated voicing techniques based on Berklee's advanced harmony curriculum</li>
            <li><strong>Impact:</strong> Generated progressions will sound more authentic and musically sophisticated</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-4 mb-2">2. Dataset Quality and Scale</h3>
          <ul>
            <li><strong>Midterm:</strong> Limited dataset, primarily chord symbols without detailed voicing information</li>
            <li><strong>Final:</strong> Comprehensive, theory-grounded dataset with multiple voicing methods and extensive metadata</li>
            <li><strong>Impact:</strong> Better training data leads to better model performance and more musically coherent outputs</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-3 mb-2">3. Technical Sophistication</h3>
          <ul>
            <li><strong>Midterm:</strong> Single voicing approach, basic chord-to-MIDI conversion</li>
            <li><strong>Final:</strong> Multiple voicing algorithms, voice leading optimization, multi-format encoding</li>
            <li><strong>Impact:</strong> More flexible and musically intelligent system</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-3 mb-2">4. Reusability and Future Value</h3>
          <ul>
            <li><strong>Midterm:</strong> Project-specific dataset and model</li>
            <li><strong>Final:</strong> Comprehensive dataset that can be used by other researchers, musicians, and developers</li>
            <li><strong>Impact:</strong> Contributes to the broader community of AI music research</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-3 mb-2">5. Educational and Research Value</h3>
          <ul>
            <li><strong>Midterm:</strong> Proof-of-concept demonstration</li>
            <li><strong>Final:</strong> Documented, theory-grounded dataset with clear methodology for replication and extension</li>
            <li><strong>Impact:</strong> Provides a foundation for future research in AI jazz harmony</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Questions, concerns, and stretch goals */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Questions, Concerns, and Stretch Goals</h2>
        <div className="prose">
          <h3 className="text-xl font-medium mt-4 mb-2">Questions:</h3>
          <ul>
            <li>What is the optimal dataset size for training effective models? Should I aim for thousands or tens of thousands of progressions?</li>
            <li>How should I balance dataset diversity (many voicing types) vs. depth (many examples of each type)?</li>
            <li>What numerical encoding scheme will best preserve voicing information for the model?</li>
            <li>Should the dataset include both "correct" and "common variations" to allow the model to learn flexibility?</li>
            <li>How can I validate that the generated voicings follow Berklee theory principles programmatically?</li>
            <li>What file formats will be most useful for future researchers and developers?</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Concerns:</h3>
          <ul>
            <li><strong>Time Management:</strong> Creating a comprehensive dataset with multiple voicing methods is time-intensive. I need to prioritize which voicing methods to implement first.</li>
            <li><strong>Theory Accuracy:</strong> Ensuring that my implementation of Four Way Close and other voicing methods accurately reflects Berklee's teachings requires careful research and validation.</li>
            <li><strong>Voice Leading Complexity:</strong> Implementing smooth voice leading between chords with different voicing types is algorithmically complex.</li>
            <li><strong>Dataset Organization:</strong> Managing a large dataset with multiple formats and metadata requires careful file structure and documentation.</li>
            <li><strong>Model Retraining:</strong> Retraining the model on the new dataset may require significant computational resources and time.</li>
            <li><strong>Integration Challenges:</strong> Updating the web interface to display and interact with voicings adds complexity to the frontend.</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Stretch Goals:</h3>
          <ul>
            <li><strong>Interactive Voicing Editor:</strong> Allow users to modify and customize voicings in the web interface</li>
            <li><strong>Style-Specific Voicing Sets:</strong> Create voicing collections optimized for different jazz styles (Bebop, Modal, Contemporary, etc.)</li>
            <li><strong>Voice Leading Visualization:</strong> Visual representation of how voices move between chords</li>
            <li><strong>Audio Examples:</strong> Generate audio samples for each voicing type to help users understand the differences</li>
            <li><strong>Dataset Documentation Website:</strong> Create a web page documenting the dataset structure, usage examples, and theory background</li>
            <li><strong>Hugging Face Dataset:</strong> Publish the dataset on Hugging Face for easy access by the research community</li>
            <li><strong>Comparative Analysis:</strong> Compare model performance trained on the new dataset vs. the original midterm dataset</li>
            <li><strong>Real-time Voicing Suggestions:</strong> As users input chords, suggest appropriate voicings based on context</li>
            <li><strong>Educational Mode:</strong> Explain why certain voicings work well together based on voice leading principles</li>
            <li><strong>Export to DAW:</strong> Export progressions with voicings directly to popular DAWs (Logic, Ableton, etc.)</li>
          </ul>
        </div>
      </section>

      {/* Section 6: Timeline */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
        <div className="prose">
          <ul>
            <li><strong>Week 1 (Proposal Week):</strong> 
              <ul>
                <li>Research Berklee Four Way Close voicing principles</li>
                <li>Design dataset structure and file organization</li>
                <li>Set up project directory structure</li>
                <li>Begin implementing Four Way Close voicing algorithm</li>
              </ul>
            </li>
            <li><strong>Week 2 (Progress Update):</strong>
              <ul>
                <li>Complete Four Way Close implementation</li>
                <li>Implement at least one additional voicing method (Drop 2)</li>
                <li>Generate initial dataset of 100+ progressions with voicings</li>
                <li>Create data export scripts (MIDI, numerical arrays)</li>
                <li>Begin documentation</li>
              </ul>
            </li>
            <li><strong>Week 3-4 (Final Development):</strong>
              <ul>
                <li>Implement remaining voicing methods (Drop 3, Open, Shell, etc.)</li>
                <li>Expand dataset to 500+ progressions with multiple voicing variations</li>
                <li>Implement voice leading optimization algorithms</li>
                <li>Retrain model on new dataset</li>
                <li>Update web interface to display and play voicings</li>
                <li>Create comprehensive documentation</li>
              </ul>
            </li>
            <li><strong>Final Week (Presentation):</strong>
              <ul>
                <li>Final testing and refinement</li>
                <li>Prepare presentation materials</li>
                <li>Document results and comparisons</li>
                <li>Create final project page</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 7: Success Metrics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Success Metrics</h2>
        <div className="prose">
          <p>I will consider this project successful if:</p>
          <ul>
            <li>The dataset contains at least 500 unique chord progressions with multiple voicing variations</li>
            <li>Four Way Close voicing is correctly implemented according to Berklee principles</li>
            <li>At least 3 additional voicing methods are implemented and documented</li>
            <li>The dataset is well-organized, documented, and ready for use by others</li>
            <li>The retrained model generates progressions with improved musical quality</li>
            <li>The web interface successfully displays and plays voicings</li>
            <li>The dataset demonstrates clear improvement over the midterm dataset in model performance</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

