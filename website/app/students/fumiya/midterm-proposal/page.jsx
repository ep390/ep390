export default function StudentPage() {
  return (
    // Added a stronger text shadow to the container to make the text pop
    <div className="container mx-auto px-4 py-8 max-w-4xl [text-shadow:2px_2px_5px_rgba(0,0,0,0.4)]">
      <h1 className="text-4xl font-bold mb-8 text-center">Midterm Proposal</h1>

      {/* Container to arrange sections vertically */}
      <div className="flex flex-col gap-8 pb-12">
        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Project Overview</h2>
          <p> For my midterm project, I plan to create a 2–3 minute music composition using AI-generated ABC notation from NotaGen. Alongside the composition, I will design a visually engaging website that can play the track with the help of Gimni Assistant. </p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Project Plan</h2>
          <p className="mb-2"><strong>Week 1 – Composition:</strong> I will focus on creating the musical piece. My goal is to generate melodies and chord progressions using NotaGen and develop them into a house-style track.</p>
          <p><strong>Week 2 – Website Development: </strong> During the second week, I’ll shift my focus to building the website. I aim to make it visually appealing and interactive, enhancing the overall listening experience.</p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Questions / Concerns</h2>
          <p> My initial idea was to let users add sound effects to the track while it plays. However, I’m not sure how feasible or technically complex this feature might be. </p>
        </div>

        <div className="bg-sky-500/10 border border-sky-500 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mt-0 mb-3">Stretch Goals</h2>
          <p> If time permits, I would like to implement a visualizer on the webpage to create a more immersive experience.</p>
        </div>
      </div>
    </div>
  );
}
