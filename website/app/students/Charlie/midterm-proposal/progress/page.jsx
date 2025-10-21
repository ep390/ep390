export default function ProgressPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Midterm Project Progress </h1>
      
      {/* Project Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <div className="prose">
          <p>
            Building an app/plugin that allows users to explore jazz chords and advanced chord progressions 
            through an interactive "cookbook" interface with real-time playback and theoretical explanations.
          </p>
        </div>
      </section>

      {/* Progress Reports Navigation */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Weekly Progress Reports</h2>
        <div className="grid gap-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Week 1 - Research & Planning</h3>
            <p className="text-gray-600 mb-2">
              Initial research, data strategy, and product specification. Explored modeling approaches 
              and defined quality criteria for jazz harmony data.
            </p>
            <a href="./week1/" className="text-blue-600 hover:text-blue-800 underline">
              Read Week 1 Report →
            </a>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 2 - Coming Soon</h3>
            <p className="text-gray-600">
              Baseline model implementation and data pipeline development.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 3 - Coming Soon</h3>
            <p className="text-gray-600">
              Model training and evaluation.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 4 - Coming Soon</h3>
            <p className="text-gray-600">
              Frontend development and integration.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 5 - Coming Soon</h3>
            <p className="text-gray-600">
              Testing and refinement.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 6 - Coming Soon</h3>
            <p className="text-gray-600">
              Final polish and documentation.
            </p>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="text-lg font-medium mb-2">Week 7 - Coming Soon</h3>
            <p className="text-gray-600">
              Presentation preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Key Milestones */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Milestones</h2>
        <div className="prose">
          <ul>
            <li><strong>Week 1:</strong> Research & planning phase ✅</li>
            <li><strong>Week 2-3:</strong> Data collection and model architecture</li>
            <li><strong>Week 4:</strong> Model training and evaluation</li>
            <li><strong>Week 5:</strong> Frontend development</li>
            <li><strong>Week 6:</strong> Integration and testing</li>
            <li><strong>Week 7:</strong> Final refinements and presentation</li>
          </ul>
        </div>
      </section>

      {/* Project Structure */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm">
{`midterm-proposal/
├── page.jsx              # Main proposal document
├── progress/             # Progress tracking
│   ├── page.jsx         # This progress overview
│   ├── README.md        # Progress documentation
│   ├── week1.md         # Week 1 detailed report
│   └── ...              # Future weekly reports
└── assets/              # Supporting files (if any)`}
          </pre>
        </div>
      </section>

      {/* Back to Proposal */}
      <section className="mb-8">
        <div className="text-center">
          <a href="../" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Main Proposal
          </a>
        </div>
      </section>
    </div>
  );
}