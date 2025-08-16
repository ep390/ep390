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
                <span className="font-semibold text-blue-800">
                  Can it be both?
                </span>
              </p>
              <p className="text-xl leading-relaxed mb-6">
                Generative models can be very helpful for writing code,
                especially for beginners who want to learn fast. Can they also
                be useful for other artistic practices? Will they be useful in
                the future? Learn to see through the hype and make your own
                informed opinions about the{" "}
                <span className="text-emerald-800 font-bold">utility</span>,{" "}
                <span className="text-emerald-800 font-bold">trajectory</span>,{" "}
                and
                <span className="text-emerald-800 font-bold"> ethics</span> of
                modern generative AI.
              </p>
              <div
                className="h-[2px] mt-8 mb-6 bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400"
                style={{ boxShadow: "0 0 7px rgba(168, 85, 247, 0.6)" }}
              />
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-black mb-6">
                In this class, you will:
              </h3>
              <ul className="space-y-3 text-lg text-gray-800 list-disc list-inside">
                <li>
                  Build understanding by studying how the generative models work
                  &quot;under the hood&quot;
                </li>
                <li>
                  Contrast the strengths and weaknesses of different modalities:
                  Image, Music, and Code to understand where these technologies
                  are headed and what they are likely to mean for artists in the
                  future.
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
                Topics We will Cover
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Students will start with code generation and learn to write better code faster using AI tools. We will use the efficacy of coding tools as a benchmark to evaluate the value and trajectory of generative AI for music and image modalities.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Each week will introduce a new topic, and work on an
                introductory lab exercise. Each lab and assignment is a possible
                starting point to expand on in the mid-term and final projects.
              </p>
              <ul className="space-y-3 text-lg text-gray-800 list-disc list-inside">
                <li>Hands on: Tools for agentic code generation</li>
                <li>Hands on: Symbolic Music Generation</li>
                <li>Research Review: Can models &quot;reason&quot;?</li>
                <li>Ethics: TESCREAL</li>
                <li>Ethics: AI and the Environment</li>
                <li>
                  <strong>Mid-term project!</strong>
                </li>
                <li>Theory: Transformers</li>
                <li>Theory and Practice: Music Generation</li>
                <li>Theory: Diffusion</li>
                <li>Theory and practice: Model internals and Comfy-UI</li>
                <li>
                  Theory and practice: Image Gen – On-device and in the cloud
                </li>
                <li>Hands on: Video Games</li>
                <li>
                  <strong>Final project!</strong>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4 italic">
                AI is changing fast! The exact make-up of this list may change
                subtly to keep up with important developments in the field.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <section className="pt-8 border-t border-gray-200">
            <div className="flex gap-8">
              <Link
                href="/syllabus"
                className="text-black font-semibold text-lg hover:text-purple-600 transition-colors"
              >
                Full Syllabus →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
