import styles from "@/app/[...markdown]/markdown.module.css";
import MlpEditable from "./MlpEditable";
import MlpWithActivation from "./MlpWithActivation";
import MlpSvg from "./MlpSvg";
import * as examples from "./examples";
import ModuleFooter from "@/components/ModuleFooter";
import AiTaxonomy from "./AiTaxonomy";
import AiTaxonomySmall from "./AiTaxonomySmall";
import Toggle from "@/components/Toggle";
import Link from "next/link";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

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
          <MlpEditable
            {...examples.initWeights}
            showEquation
            inputNumberType="int"
          />
          <h2>Points so far</h2>
          <ul>
            <li>
              A neural network is a function that takes multiple inputs and
              produces multiple outputs.
            </li>
            <li>
              There are two kinds of values that we need to think about:{" "}
              <span className="text-blue-700 font-bold">data</span> and{" "}
              <span className="text-orange-700 font-bold">parameters</span>
              <ul>
                <li className="">
                  <span className="text-blue-700 font-bold">Data</span> is the
                  information flowing through the network{" "}
                  <span className="text-blue-700">
                    (inputs, activations, and outputs)
                  </span>
                  .
                </li>
                <li className="">
                  <span className="text-orange-700 font-bold">Parameters</span>{" "}
                  are the internal values of the network{" "}
                  <span className="text-orange-700">(weights and biases)</span>{" "}
                  that are updated during training.
                </li>
              </ul>
            </li>
          </ul>
          <h2>Neurons with bias</h2>
          <p>
            Remember I said that we skipped over some of the details of the
            neurons? Let us add it for completeness.
          </p>
          <MlpEditable {...examples.ex5} showEquation inputNumberType="int" />
          <h2>Neurons with bias and &quot;activation&quot;</h2>
          The{" "}
          <a
            href="https://en.wikipedia.org/wiki/Activation_function#Table_of_activation_functions"
            target="_blank"
          >
            activation function
          </a>{" "}
          is the final missing piece of our neuron model.
          <MlpWithActivation />
          <h2>Softmax</h2>
          Take a look at the output of the output of the matrix above. Data
          flowing through a neural network is typically represented as a column
          vector.
          <div className="text-xl">
            <BlockMath>{"z = " + columnVectorLatex([18, 17, 0])}</BlockMath>
          </div>
          What we want is a array or probabilities for each possible output.
          That is, we want a vector that sums to <InlineMath>1</InlineMath>. A
          naive way to do this would be to divide each value by the sum of the
          vector.
          <div className="text-xl">
            <BlockMath>
              {columnVectorLatex(
                [18, 17, 0].map((x) => `\\frac{${x}}{18 + 17 + 0}`),
                1.8
              ) +
                " \\approx " +
                columnVectorLatex(
                  [18, 17, 0].map((x) => toFixed(x / 35) as string),
                  1.8
                )}
            </BlockMath>
          </div>
          Here is how this would be written in machine learning resources:
          <div className="text-2xl">
            <BlockMath>
              {`\\hat{y}_i = \\frac{z_i}{\\sum_{j=1}^{K} z_j}`}
            </BlockMath>
          </div>
          In practice, we use a slightly different approach called the softmax
          function.
          <br /> For an input vector,{" "}
          <InlineMath>{"\\mathbf{z}=[z_1,z_2,…,z_K]"}</InlineMath>, the softmax
          function is defined as:
          <div className="text-2xl">
            <BlockMath>
              {`\\hat{y}_i = \\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}`}
            </BlockMath>
          </div>
          This evaluates to a <span className="font-bold">probability distribution</span>, which is a vector of
          probabilities that sum to 1.
          <div className="text-2xl">
            <BlockMath>
              {"\\hat{y} = " +
                columnVectorLatex(
                  [18, 17, 0].map(
                    (x, _, all) =>
                      ` \\frac{e^{${x}}}{${all
                        .map((y) => `e^{${y}}`)
                        .join(" + ")}}`
                  ),
                  2
                ) +
                " \\approx " +
                columnVectorLatex(
                  [18, 17, 0].map(
                    (x, _, all) =>
                      toFixed(
                        Math.exp(x) /
                          all.reduce((acc, y) => acc + Math.exp(y), 0),
                        2
                      ) as string
                  ),
                  2
                )}
            </BlockMath>
          </div>
          Notice how the softmax exaggarates the difference between the values?
          This is one of the reasons it is preferred over the naive approach.
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

export function columnVectorLatex(
  x: (number | string)[],
  arrayStretch: number = 1
) {
  // Make the matrix taller by increasing row height via arraystretch
  const rows = x.map((cell) => toFixed(cell)).join(" \\\\ ");
  return `{\\def\\arraystretch{${arrayStretch}}\\begin{bmatrix}
${rows}
\\end{bmatrix}}`;
}

function toFixed(value: number | string | undefined, precision: number = 2) {
  if (typeof value === "string") return value;
  if (typeof value !== "number") return undefined;
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(precision);
}
