export function calculateActivations(
  inputData: number[],
  weights: number[][][],
  biases?: number[][],
  activationFn?: (x: number) => number
) {
  let previousLayerOutputs = inputData;
  const activations = [inputData];
  for (let layer = 0; layer < weights.length; layer++) {
    const layerOutputs: number[] = [];
    activations.push(layerOutputs);
    for (let neuron = 0; neuron < weights[layer].length; neuron++) {
      let activation = 0;
      for (let input = 0; input < previousLayerOutputs.length; input++) {
        activation +=
          previousLayerOutputs[input] * weights[layer][neuron][input];
      }
      if (biases && biases[layer] && typeof biases[layer][neuron] === 'number') {
        activation += biases[layer][neuron];
      }
      layerOutputs.push(activationFn ? activationFn(activation) : activation);
    }
    previousLayerOutputs = layerOutputs;
  }
  return activations;
}

// Note: applyActivation helper removed; activation can be applied inline during calculation
