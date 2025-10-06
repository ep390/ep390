import { MlpOptions } from "./MlpSvg";
import { MlpEditableOptions, MlpOptionsWithData } from "./MlpEditable";
import { calculateActivations } from "./calculate-activations";
import { weights4537, trivialWeights } from "./weights";

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

export const initWeights: MlpEditableOptions = {
  neuronCounts: [4, 5, 3, 7],
  weights: weights4537,
  activations: calculateActivations([1, 4, 5, 1], weights4537),
};

const ex4Activations = calculateActivations([1, 4, 5], trivialWeights);
export const ex4: MlpOptionsWithData = {
  neuronCounts: [3, 5, 3],
  weights: trivialWeights,
  activations: ex4Activations,
};
