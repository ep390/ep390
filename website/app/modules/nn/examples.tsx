import { MlpOptions } from "./MlpSvg";
import { MlpOptionsWithData } from "./MlpWithEquation";
import { calculateActivations } from "./calculate-activations";

export const ex1: MlpOptions = {
  neuronCounts: [4, 6, 6, 6, 2],
};

export const ex2: MlpOptions = {
  neuronCounts: [3, 4, 5, 5, 4, 3, 2],
};

export const ex3: MlpOptions = {
  neuronCounts: [9, 15, 15, 15, 10],
  neuronRadius: 8,
  edgeStrokeWidth: 0.6,
  svgHeight: 450,
};

const neuronCounts = [4, 5, 3, 2];
const inputData = [1, 4, 5, 1];
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
export const exampleWithWeights: MlpOptionsWithData = {
  neuronCounts,
  weights,
  activations: calculateActivations(inputData, weights),
};

export const ex4: MlpOptions = {
  neuronCounts: exampleWithWeights.neuronCounts,
  activations: [
    exampleWithWeights.activations[0],
    [],
    [],
    exampleWithWeights.activations[3],
  ],
};
