export default function StudentPage() {
  return (
    // Added a stronger text shadow to the container to make the text pop
    <div className="container mx-auto px-4 py-8 max-w-4xl [text-shadow:2px_2px_5px_rgba(0,0,0,0.4)]">
      <h1 className="text-4xl font-bold mb-8 text-center">Midterm Proposal</h1>

      {/* Container to arrange sections vertically */}
      <div className="flex flex-col gap-8 pb-12">
        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Project Overview</h2>
          <p>
            For my final project, I will create a 2–3 minute music composition using AI-generated music tools.
            For the midterm, I composed a track using only AI-generated or processed audio.
            While the result was a great experiment in demonstrating how AI can be used for composition,
            the final track sounded a bit uncontrolled, which also made it interesting.
            Therefore, for this project, I plan to balance AI-generated content with my own work 
            to create a track that sounds more commercial than experimental.
          </p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Project Plan</h2>
          <p className="mb-2"><strong>Tools:</strong></p>
          <p>1. Neutone Morph</p>
          <p> 2. Neutone FX</p>
          <p> 3. Synplant 2</p>
          <p> 4. Moises AI Studio</p>
          <p className="mb-2"><strong>DAW:</strong></p>
          <p>Ableton Live 12</p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Questions / Concerns</h2>
          <p>
            While my goal is to demonstrate the practical use of AI tools for commercial composition, 
            my main concern is that the final track might end up sounding too similar to my more experimental midterm project. 
            To avoid this, I will need to be mindful of my creative direction throughout the process to ensure a polished, commercial sound.
          </p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Stretch Goals</h2>
          <p> If time permits, I'd like to create vocals with Moises' Voice Studio and create cover art using an AI generation tool.</p>
        </div>
      </div>
    </div>
  );
}
