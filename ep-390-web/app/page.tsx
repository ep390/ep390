import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
              EP-390
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Generative AI for Music,
            <br />
            Code, and Image
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">Charles Holbrow</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Tuesday 6-8pm</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-16">
          {/* Course Content */}
          <section className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What This Class Is
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong className="text-purple-700">AI Hype</strong> is
                  everywhere! Major tech companies are betting no AI and
                  offering annual salaries in the hundreds of millions to AI
                  researchers.
                </p>

                <p>
                  <strong className="text-amber-700">AI Scorn</strong> is
                  everywhere too. Detractors point to environmental costs,
                  ethical implications, and technical limitations of generative
                  AI.
                </p>

                <p>
                  So which is it? Over-hyped purveyor of{" "}
                  <strong className="text-amber-700">AI Slop</strong>? Or
                  impending{" "}
                  <strong className="text-purple-700">
                    economic revolution
                  </strong>{" "}
                  posing a real threat to artists, musicians, and anyone who is
                  not positioned to benefit with the major tech companies?{" "}
                </p>
                <p>
                  <strong className="">Can it be both?</strong>
                </p>

                <p>
                  This class aims to help you see through the hype and make your
                  own informed opinions about the utility, trajectory, and
                  ethics of modern generative AI.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                In this class we will:
              </h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  • Get hands-on practice with modern tools for generating media
                </p>
                <p>
                  • Build understanding by studying how the models work under
                  the hood
                </p>
                <p>• Explore research and criticism of Generative AI</p>
                <p>
                  • Build a portfolio of content and reflections that expose AI
                  strengths and weaknesses
                </p>
                <p>
                  • Develop an informed critical take on the ethics and
                  economics of generative AI
                </p>
                <p>
                  • Learn to identify pitfalls in Generative AI
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Prerequisites
              </h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  We will be writing code, using the terminal, and submitting
                  assignments on GitHub.
                </p>
                <p>The class requires a B or better in LMSC-261 to enroll.</p>
                <p>
                  We will be using both Python and JavaScript. Comfort with at
                  least one of these is required.
                </p>
              </div>
            </div>
          </section>

          {/* Final Project */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Final Project</h2>
            <p className="text-blue-100">
              Create a music and multimedia work using AI tools. Show what
              you&apos;ve learned.
            </p>
          </section>

          {/* Navigation */}
          <section className="text-center">
            <div className="inline-flex gap-4">
              <Link
                href="/tutorials"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Tutorials
              </Link>
              <Link
                href="/projects"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Student Projects
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
