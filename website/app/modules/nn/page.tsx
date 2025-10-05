import type { ReactElement } from "react";
import { MultilayerPerceptronSvg, type NodeFocusChange } from "./svg";
import styles from "@/app/[...markdown]/markdown.module.css";
import PrettyJsObject from "@/components/PrettyJsObject";
import { calculateActivations } from "./calculate-activations";
import MlpWithEquation from "./MlpWithEquation";

export default function Page(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <div>
          <h1>Neural Network</h1>

          <div className="flex justify-center">
            <MlpWithEquation
              neuronCounts={[4, 5, 3, 2]}
              weights={weights}
              activations={activations}
            />
          </div>
        </div>
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
