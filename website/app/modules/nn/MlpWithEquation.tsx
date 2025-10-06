"use client";

import MultilayerPerceptronSvg, { type MlpOptions } from "./MlpSvg";
import { useState } from "react";
import Toggle from "@/components/Toggle";

export type MlpOptionsWithData = MlpOptions & {
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
            if (focused) {
              setNodeWeights(options.nodeWeights);
              setLayerInputs(options.layerInputs);
              setNodeActivation(options.nodeActivation);
            } else {
              setNodeWeights(undefined);
              setLayerInputs(undefined);
              setNodeActivation(undefined);
            }
          }}
        />
      </div>
      <div>
        <Toggle title="Show equation">
          <div className="text-xl">
            {layerInputs &&
              layerInputs?.map((input, index) => (
                <span key={index} className="">
                  (<span className="text-purple-500">{input}</span>
                  &nbsp;✖️&nbsp;
                  <span>{nodeWeights?.[index]}</span>)
                  {index < layerInputs.length - 1 && <span> ➕ </span>}
                </span>
              ))}
            {layerInputs && (
              <>
                🟰 <span className="text-purple-500">{nodeActivation}</span>
              </>
            )}
          </div>
        </Toggle>
      </div>
    </div>
  );
}
