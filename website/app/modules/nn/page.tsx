import styles from "@/app/[...markdown]/markdown.module.css";
import MlpWithEquation from "./MlpWithEquation";
import MlpSvg from "./MlpSvg";
import * as examples from "./examples";
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
            will also encounter the related names{" "}
            <strong>Fully Connected Neural Network (FCNN)</strong> and{" "}
            <strong>Multilayer Perceptron (MLP)</strong>.
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

          <p>In practice, networks can have millions or billions of nodes.</p>
          <h2>&quot;Feed Forward&quot; and &quot;Fully Connected&quot;</h2>

          <p>
            Can you explain that makes these networks{" "}
            <strong>fully connected</strong>? What makes them{" "}
            <strong>feed forward</strong>?
          </p>

          <MlpSvg {...examples.ex4} />

          <p>
            In machine learning, we need to represent our input and output data
            with numbers. There are lots of different ways to do that.
          </p>

          <MlpWithEquation {...examples.exampleWithWeights} />
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}
