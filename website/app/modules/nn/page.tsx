import styles from "@/app/[...markdown]/markdown.module.css";
import MlpEditable from "./MlpEditable";
import MlpSvg from "./MlpSvg";
import * as examples from "./examples";
import ModuleFooter from "@/components/ModuleFooter";
import AiTaxonomy from "./AiTaxonomy";
import AiTaxonomySmall from "./AiTaxonomySmall";
import Toggle from "@/components/Toggle";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <div>
          <h1>Neural Networks</h1>
          <p>
            You&apos;ve probably seen images liket the ones below that represent
            machine learning models, but what do they actually mean? The goal of
            this module is to begin to build some intuition about these models.
          </p>
          <MlpSvg {...examples.ex1} />

          <p>Neural networks are a sub-category of machine learning models.</p>

          <div className="mb-4">
            <Toggle title="Where do FFNNs fit in the AI space?">
              <AiTaxonomySmall />
            </Toggle>
            <Toggle title="A Larger, but still incomplete AI Taxonomy">
              <AiTaxonomy />
            </Toggle>
          </div>

          <p>
            The diagrams below all represent the simplest category of neural
            networks called a <strong>Feed Forward Networks (FFNN)</strong>. You
            will also encounter the related names{" "}
            <strong>Fully Connected Neural Network (FCNN)</strong> and{" "}
            <strong>Multilayer Perceptron (MLP)</strong>.
          </p>

          <p>Nerual Networks come in many shapes and sizes.</p>
          <MlpSvg {...examples.ex2} />
          <MlpSvg {...examples.ex3} />

          <p>In practice, networks can have many millions of nodes.</p>
          <h2>&quot;Feed Forward&quot; and &quot;Fully Connected&quot;</h2>

          <p>
            Can you explain that makes these networks{" "}
            <strong>fully connected</strong>? What makes them{" "}
            <strong>feed forward</strong>?
          </p>

          <MlpSvg neuronCounts={examples.ex4.neuronCounts} />

          <h2>Inputs and Outputs</h2>

          <p>
            In machine learning, we need to represent our input and output data
            with numbers. There are lots of different ways to do that. Any of
            methods below are valid targets for the inputs and outputs of a
            neural network.
          </p>

          <ul>
            <li>MIDI Note Number</li>
            <li>Frequency (Hz)</li>
            <li>Spectrograms</li>
            <li>
              Audio waveforms (
              <a
                href="https://deepmind.google/discover/blog/wavenet-a-generative-model-for-raw-audio/"
                target="_blank"
              >
                Wavenet
              </a>{" "}
              did this, but there are now better ways to generate waveforms)
            </li>
            <li>
              <Link href="/modules/abc/">ABC notation</Link> (via{" "}
              <a href="https://gpt-tokenizer.dev/" target="_blank">
                tokens
              </a>
              )
            </li>
            <li className="font-bold">What are some others?</li>
          </ul>

          <span className="font-bold text-orange-700">
            Some formats work better than others!
          </span>

          <MlpSvg
            neuronCounts={examples.ex4.neuronCounts}
            activations={examples.ex4.activations}
          />

          <p className="mt-4 p-3 rounded-md bg-amber-50 border-l-4 border-amber-500 text-slate-900">
            Think of{" "}
            <span className="text-blue-700 font-bold">each blue dot</span> as a
            function that takes multiple inputs and produces{" "}
            <span className="text-blue-700 font-bold">1 output value</span>.
            <br /> <br />
            Think of the{" "}
            <span className="text-purple-700 font-bold">entire network</span> as
            a function that makes multiple inputs and produces{" "}
            <span className="text-purple-700 font-bold">multiple outputs</span>.
          </p>

          <h2>Weights</h2>
          <p>
            How did we calculate the{" "}
            <code className="text-blue-700 font-bold">
              {examples.ex4.activations[1][0]}
            </code>{" "}
            in the first hidden layer?
          </p>
          <p>
            Where do these{" "}
            <span className="text-orange-700 font-bold">orange</span> values
            come from?
          </p>

          <MlpEditable {...examples.ex4} showEquation inputNumberType="int" />

          <p className="mt-8 p-3 rounded-md bg-amber-50 border-l-4 border-amber-500 text-slate-900">
            <span className="text-red-700 font-bold">
              ⚠️ Some steps where omitted! ⚠️
            </span>
            <br />
            The functions in the hidden layer do a little more than this... but
            we will get to that later.
          </p>

          <h2>A more practical example</h2>
          <p>
            Let&apos;s discuss how we could create a neural network that
            generates chord sequences.
          </p>
          <MlpEditable {...examples.initWeights} showEquation />
          <h2>Resources</h2>
          <ul>
            <li>
              <a
                href="https://www.youtube.com/watch?v=aircAruvnKk"
                target="_blank"
              >
                But what is a neural network?
              </a>{" "}
              A Great YouTube video by 3Blue1Brown that covers this material and
              more.
            </li>
          </ul>
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}
