'use client'

import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'
import PrettyJsObject from '@/components/PrettyJsObject'
import MlpSvg from '../nn/MlpSvg'

const inputData = [0, 1, 2];
const layer1Weights = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12]
];
const layer1Biases = [
  0,
  10,
  100,
  1000
];
// TODO: The output data below is incorrect. Try to fix it.
const outputData = [
  0,
  10,
  100,
  1000
];

export default function JSPlaygroundPage() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Neural Networks Hands On</h1>
        <p>Open the source code for this page in your code editor.</p>
        <h2>Single layer fully connected FFNN</h2>
        <p>Take a look at the code for the neural network below. The outputs data is incorrect: It only accounts for the biases, but not the weights. Can you fix it?</p>

        <div className="flex flex-row justify-center">
          <MlpSvg
            neuronCounts={[3, 4]}
            weights={[layer1Weights]}
            activations={[inputData, outputData]}
            biases={[layer1Biases]}
            svgWidth={500}
            svgHeight={300}
            neuronRadius={35}
          />
        </div>
        <h2>How many weights are there per layer?</h2>
        <ModuleFooter />
      </div>
    </div>
  )
}
