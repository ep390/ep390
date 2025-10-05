"use client";

import { MultilayerPerceptronSvg, type MlpOptions } from "./svg";
import { useState } from "react";

type MlpOptionsWithData = MlpOptions & {
  weights: number[][][];
  activations: number[][];
};

export default function MlpWithEquation(options: MlpOptionsWithData) {
  const [layerInputs, setLayerInputs] = useState<number[] | undefined>(
    undefined
  );
  const [nodeWeights, setNodeWeights] = useState<number[] | undefined>(
    undefined
  );
  const [nodeActivation, setNodeActivation] = useState<number | undefined>(
    undefined
  );


  return (
    <div>
      <div className="mx-auto">
        <MultilayerPerceptronSvg
          {...options}
          onNodeFocusChange={(options, focused) => {
            if (!focused) return;
            setNodeWeights(options.nodeWeights);
            setLayerInputs(options.layerInputs);
            setNodeActivation(options.nodeActivation);
          }}
        />
      </div>
      <div>
        <h2>Equation</h2>
        <div>
        {layerInputs?.map((input, index) => (
          <span key={index} className="text-lg">
            (<span className="text-purple-500">{input}</span>&nbsp;✖️&nbsp;<span>{nodeWeights?.[index]}</span>)
            {index < layerInputs.length - 1 && <span> ➕ </span>}
          </span>
        ))} = <span className="text-purple-500">{nodeActivation}</span>
        </div>
      </div>
    </div>
  );
}
