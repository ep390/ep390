'use client'

import hljs from 'highlight.js'
import styles from '@/app/[...markdown]/markdown.module.css'
import ModuleFooter from '@/components/ModuleFooter'
import MlpSvg from '../nn/MlpSvg'
import { MatrixEquation, columnVectorLatex } from '@/components/latex'
import Toggle from '@/components/Toggle'
import { BlockMath, InlineMath } from 'react-katex'

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

export default function NeuralNetworkExamplePage() {

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Neural Networks Hands On</h1>
        <p>Open the source code for this page in your code editor.</p>
        <h2>Single layer fully connected FFNN</h2>
        <p>
          Take a look at the code for the neural network below. The output data
          is incorrect: It only accounts for the biases, but not the weights.
          Can you fix it?
        </p>

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
        <Toggle title="Matrix Multiplication">
          <MatrixEquation
            A={layer1Weights}
            x={inputData.map(x => [x])}
            b={outputData.map(x => [x])}
            result={outputData.map(x => [x])}
          />
          <div>
            The standard way to represent ann layer is with a matrix
            multiplication. This concept comes from linear algebra. In practice
            you would never specify the all the values in a matrix. Instead, you
            typically just give it an upper-case letter <InlineMath>W</InlineMath> and the input vector <InlineMath>a</InlineMath> like this:
          </div>
          <BlockMath>
            {`W \\times a + b`}
          </BlockMath>
          <div>
            And we often omit the multiplication sign and just write:
            <BlockMath>
              {`Wa + b`}
            </BlockMath>
          </div>
          <div>
            So with the bias and our activation function:
            <BlockMath>
              {`\\sigma(Wa + b)`}
            </BlockMath>
          </div>
          <div>
            I like to think about rotating <InlineMath>x</InlineMath> around to
            the top of the <InlineMath>A</InlineMath> matrix so that it sits
            above it like this:
            <BlockMath>
              {`\\begin{array}{c}
\\begin{bmatrix}
0 & 1 & 2
\\end{bmatrix}\\\\[6pt]
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9 \\\\
10 & 11 & 12
\\end{bmatrix}
\\end{array}`}
            </BlockMath>
          </div>
          <div>
            That means we can add together <InlineMath>0</InlineMath> of the
            first column, <InlineMath>1</InlineMath> of the second column,
            and <InlineMath>2</InlineMath> of the third column to get the full
            result in one pass.
          </div>

        </Toggle>
        <h2>Python</h2>

        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <code
            className="hljs language-javascript"
            dangerouslySetInnerHTML={{ __html: hljs.highlight(pythonNnLayerCode, { language: 'python' }).value }}
          />
        </pre>
        <ModuleFooter />
      </div>
    </div>
  )
}

const pythonNnLayerCode = `import numpy as np
W = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]])
a = np.array([[0], [1], [2]])
b = np.array([[0], [10], [100], [1000]])

def sigma(x):
  return 1 / (1 + np.exp(-x))

print(W @ a)
print(W @ a + b)
print(sigma(W @ a + b))
`