import styles from "@/app/[...markdown]/markdown.module.css";
import { calculateActivations } from "./calculate-activations";
import MlpWithEquation from "./MlpWithEquation";
import MlpSvg from "./MlpSvg";
import  * as examples from "./examples";
import ModuleFooter from "@/components/ModuleFooter";
import AiTaxonomy from "./AiTaxonomy";
import AiTaxonomySmall from "./AiTaxonomySmall";
import Toggle from "@/components/Toggle";

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
          <p>
            The diagrams below all represent the simplest category of neural
            networks called a <strong>Feed Forward Networks (FFNN)</strong>. You
            will also see them called{" "}
            <strong>Fully Connected Neural Networks (FCNNs)</strong> or{" "}
            <strong>Multilayer Perceptrons (MLPs)</strong>.
          </p>

          <div className="mb-4">
            <Toggle title="Where do FFNNs fit in the AI space?">
              <AiTaxonomySmall />
            </Toggle>
            <Toggle title="A Larger, but still incomplete AI Taxonomy">
              <AiTaxonomy />
            </Toggle>
          </div>

          <p>Nerual Networks come in many shapes and sizes.</p>
          <MlpSvg {...examples.ex2} />
          <MlpSvg {...examples.ex3} />

          <p>
            These images represent very small networks. In practice, networks
            can have millions or billions of nodes.
          </p>
          <h2>What does &quot;Feed Forward&quot; mean?</h2>
          <MlpSvg {...examples.ex4} />

          <MlpWithEquation
            neuronCounts={[4, 5, 3, 2]}
            weights={weights}
            activations={activations}
          />
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}

const weights = [
  // W1: shape (5, 4) - Matrices are specified  as (height, width)
  [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
  ],
  // W2: shape (3, 5)
  [
    [0.2, 0.3, 0.4, 0.5, 0.6],
    [0.7, 0.8, 0.9, 1.0, 1.1],
    [1.2, 1.3, 1.4, 1.5, 1.6],
  ],
  // W3: shape (2, 3)
  [
    [0.2, 0.3, 0.4],
    [0.5, 0.6, 0.7],
    [0.8, 0.9, 1.0],
  ],
];

const inputData = [1, 4, 5, 1];

const activations = calculateActivations(inputData, weights);
