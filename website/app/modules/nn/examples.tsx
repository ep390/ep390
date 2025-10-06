import { MlpOptions } from "./MlpSvg";
import { MlpOptionsWithData } from "./MlpWithEquation";
import { calculateActivations } from "./calculate-activations";
import { weights } from "./weights";

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

const neuronCounts = [4, 5, 3, 7];
const inputData = [1, 4, 5, 1];

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

