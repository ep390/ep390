import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <header className="mb-14">
          <div className="flex items-baseline gap-4 mb-8">
            <h1 className="text-5xl font-bold text-black tracking-tight">
              Berklee College of Music EP-390
            </h1>
            <div className="text-gray-500 text-lg">
              Charles&nbsp;Holbrow Tuesdays&nbsp;6-8pm
            </div>
          </div>
          <h2 className="text-4xl font-medium text-gray-900 mb-6 max-w-3xl leading-tight">
            Generative AI for Music, Code, and Image
          </h2>
        </header>

        {/* Main Content */}
        <main className="space-y-16">
          <section>
            <div className="mb-12">
              <p className="text-xl text-gray-800 leading-relaxed mb-6">
                <span className="font-semibold text-purple-600">AI Hype</span>{" "}
                is everywhere! Major tech companies are betting on AI and
                offering annual salaries in the hundreds of millions to AI
                researchers.
              </p>
              <p className="text-xl text-gray-800 leading-relaxed mb-6">
                <span className="font-semibold text-amber-600">AI Scorn</span>{" "}
                is everywhere too. Detractors point to the environmental costs,
                ethical implications, and technical limitations of generative
                AI.
              </p>
              <p className="text-xl text-gray-800 leading-relaxed mb-6">
                So which is it?{" "}
                <span className="font-semibold text-amber-600">
                  Over-hyped purveyor of AI Slop?
                </span>{" "}
                <span className="font-semibold text-purple-600">
                  Or impending economic revolution
                </span>{" "}
                posing a real threat to artists, musicians, and anyone not
                poised to benefit from the success of major tech companies?{" "}
                <span className="font-semibold text-blue-700">
                  Can it be both?
                </span>
              </p>
              <p className="text-xl text-emerald-800 font-bold leading-relaxed mb-6">
                Learn to see through the hype and make informed opinions about
                the utility, trajectory, and ethics of modern generative AI.
              </p>
              <div
                className="h-[2px] bg-purple-400 mt-8 mb-6"
                style={{ boxShadow: "0 0 8px rgba(168, 85, 247, 0.8)" }}
              />
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-black mb-6">
                In this class, you will:
              </h3>
              <ul className="space-y-3 text-lg text-gray-800 list-disc list-inside">
                <li>
                  Get hands-on practice with modern tools for generating media
                </li>
                <li>
                  Build understanding by studying how the models work under the
                  hood
                </li>
                <li>Explore research and criticism of Generative AI</li>
                <li>
                  Build a portfolio of content and reflections that expose AI
                  strengths and weaknesses
                </li>
                <li>Learn to identify pitfalls in Generative AI</li>
                <li>
                  Develop an informed critical take on the utility and ethics of
                  generative AI
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-black mb-6">
                Prerequisites
              </h3>
              <ul className="space-y-3 text-lg text-gray-800 list-disc list-inside">
                <li>
                  We will be writing code, using the terminal, and submitting
                  assignments on GitHub
                </li>
                <li>The class requires a B or better in LMSC-261 to enroll</li>
                <li>
                  We will be using both Python and JavaScript – Comfort with at
                  least one of these is required
                </li>
              </ul>
            </div>
          </section>

          {/* Navigation */}
          <section className="pt-8 border-t border-gray-200">
            <div className="flex gap-8">
              <Link
                href="/tutorials"
                className="text-black font-semibold text-lg hover:text-purple-600 transition-colors"
              >
                Tutorials →
              </Link>
              <Link
                href="/projects"
                className="text-black font-semibold text-lg hover:text-purple-600 transition-colors"
              >
                Student Projects →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
