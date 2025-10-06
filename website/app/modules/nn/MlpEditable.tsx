"use client";

import React, { useMemo, useRef, useState, type ReactElement } from "react";
import MultilayerPerceptronSvg, { type MlpOptions } from "./MlpSvg";
import { calculateActivations } from "./calculate-activations";
import Toggle from "@/components/Toggle";

export type MlpOptionsWithData = MlpOptions & {
    weights: number[][][];
    activations: number[][];
  };

export type MlpEditableOptions = MlpOptionsWithData & {
  showEquation?: boolean;
};

export default function MlpEditable(options: MlpEditableOptions): ReactElement {
  const {
    weights: initialWeights,
    activations: initialActivations,
    onNodeFocusChange: upstreamOnNodeFocusChange,
    showEquation,
    ...rest
  } = options;

  const [weights] = useState<number[][][]>(initialWeights);
  const [inputs, setInputs] = useState<number[]>(
    () => (Array.isArray(initialActivations?.[0]) ? [...initialActivations[0]] : [])
  );

  // Capture the initial inputs once so we can compare and reset
  const initialInputsRef = useRef<number[]>(Array.isArray(initialActivations?.[0]) ? [...initialActivations[0]] : []);

  const computedActivations = useMemo(() => {
    return calculateActivations(inputs, weights);
  }, [inputs, weights]);

  const onInputBoxDrag: NonNullable<MlpOptions["onInputBoxDrag"]> = (inputNumber, _dx, dy) => {
    const dragScale = 0.008; // change per pixel; upward drag increases value
    setInputs(prev => {
      const next = [...prev];
      if (inputNumber >= 0 && inputNumber < next.length) {
        next[inputNumber] = next[inputNumber] + (-dy) * dragScale;
      }
      return next;
    });
  };

  const [focused, setFocused] = useState<{ layerIndex: number; nodeIndex: number } | undefined>(undefined);

  const handleNodeFocusChange: NonNullable<MlpOptions["onNodeFocusChange"]> = (change, focused) => {
    if (upstreamOnNodeFocusChange) upstreamOnNodeFocusChange(change, focused);
    if (focused) setFocused({ layerIndex: change.layerNumber, nodeIndex: change.nodeNumber });
    else setFocused(undefined);
  };

  const layerInputs = useMemo(() => {
    if (!focused) return undefined;
    if (focused.layerIndex === 0) return inputs;
    return computedActivations[focused.layerIndex - 1];
  }, [focused, inputs, computedActivations]);

  const nodeWeights = useMemo(() => {
    if (!focused) return undefined;
    if (focused.layerIndex === 0) return undefined;
    return weights?.[focused.layerIndex - 1]?.[focused.nodeIndex];
  }, [focused, weights]);

  const nodeActivation = useMemo(() => {
    if (!focused) return undefined;
    return computedActivations?.[focused.layerIndex]?.[focused.nodeIndex];
  }, [focused, computedActivations]);

  const handleReset = () => {
    setInputs(() => [...initialInputsRef.current]);
  };

  const isDirty = useMemo(() => {
    const init = initialInputsRef.current;
    if (inputs.length !== init.length) return true;
    for (let i = 0; i < inputs.length; i += 1) {
      if (inputs[i] !== init[i]) return true;
    }
    return false;
  }, [inputs]);

  return (
    <div>
      <div className="mx-auto relative">
        <MultilayerPerceptronSvg
          {...(rest as MlpOptions)}
          weights={weights}
          activations={computedActivations}
          onInputBoxDrag={onInputBoxDrag}
          onNodeFocusChange={handleNodeFocusChange}
        />
        {isDirty && (
          <button
            type="button"
            className="absolute bottom-2 right-2 px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
            onClick={handleReset}
            aria-label="Reset inputs"
          >
            Reset
          </button>
        )}
      </div>
      {showEquation && (
        <div>
          <Toggle title="Show equation">
            <div className="text-xl font-mono">
              {layerInputs &&
                layerInputs.map((input, index) => (
                  <span key={index}>
                    (<span className="text-purple-500">{toFixed(input)}</span>
                    &nbsp;✖️&nbsp;
                    <span>{toFixed(nodeWeights?.[index])}</span>)
                    {index < layerInputs.length - 1 && <span> ➕ </span>}
                  </span>
                ))}
              {layerInputs && (
                <>
                  🟰 <span className="text-purple-500">{toFixed(nodeActivation)}</span>
                </>
              )}
            </div>
          </Toggle>
        </div>
      )}
    </div>
  );
}

function toFixed(value: number | undefined, precision: number = 2) {
  if (typeof value !== 'number') return undefined;
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(precision);
}


