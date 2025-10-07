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
  inputNumberType?: "float" | "int";
};

export default function MlpEditable(options: MlpEditableOptions): ReactElement {
  const {
    weights: initialWeights,
    activations: initialActivations,
    onNodeFocusChange: upstreamOnNodeFocusChange,
    showEquation,
    inputNumberType = "float",
    ...rest
  } = options;

  const [weights, setWeights] = useState<number[][][]>(() =>
    initialWeights.map((layer) => layer.map((row) => [...row]))
  );
  const [inputs, setInputs] = useState<number[]>(() =>
    Array.isArray(initialActivations?.[0]) ? [...initialActivations[0]] : []
  );

  // Accumulates fractional integer steps per input during drag so slow drags still step
  const intAccumRef = useRef<number[]>([]);

  // Capture the initial inputs once so we can compare and reset
  const initialInputsRef = useRef<number[]>(
    Array.isArray(initialActivations?.[0]) ? [...initialActivations[0]] : []
  );
  // Capture the initial weights once (deep copy) for dirty check and reset
  const initialWeightsRef = useRef<number[][][]>(
    initialWeights.map((layer) => layer.map((row) => [...row]))
  );

  const computedActivations = useMemo(() => {
    return calculateActivations(inputs, weights);
  }, [inputs, weights]);

  const onInputBoxDrag: NonNullable<MlpOptions["onInputBoxDrag"]> = (
    inputNumber,
    _dx,
    dy
  ) => {
    const dragScale = 0.05; // change per pixel; upward drag increases value
    setInputs((prev) => {
      const next = [...prev];
      if (inputNumber >= 0 && inputNumber < next.length) {
        if (inputNumberType === "int") {
          const increment = -dy * dragScale; // value delta this frame
          const prevAccum = intAccumRef.current[inputNumber] ?? 0;
          const accum = prevAccum + increment;
          const deltaSteps = accum >= 0 ? Math.floor(accum) : Math.ceil(accum);
          intAccumRef.current[inputNumber] = accum - deltaSteps; // keep fractional remainder
          if (deltaSteps !== 0) {
            next[inputNumber] = next[inputNumber] + deltaSteps;
          }
        } else {
          next[inputNumber] = next[inputNumber] + -dy * dragScale;
        }
      }
      return next;
    });
  };

  const [focused, setFocused] = useState<
    { layerIndex: number; nodeIndex: number } | undefined
  >(undefined);

  const handleNodeFocusChange: NonNullable<MlpOptions["onNodeFocusChange"]> = (
    change,
    focused
  ) => {
    if (upstreamOnNodeFocusChange) upstreamOnNodeFocusChange(change, focused);
    if (focused)
      setFocused({
        layerIndex: change.layerNumber,
        nodeIndex: change.nodeNumber,
      });
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
    intAccumRef.current = [];
    setWeights(() =>
      initialWeightsRef.current.map((layer) => layer.map((row) => [...row]))
    );
  };

  const onWeightLabelDrag: NonNullable<MlpOptions["onWeightLabelDrag"]> = (
    fromLayer,
    fromIndex,
    toIndex,
    _dx,
    dy
  ) => {
    const dragScale = 0.02; // weight change per pixel; upward drag increases weight
    setWeights((prev) => {
      const next = prev.map((layer) => layer.map((row) => [...row]));
      const current = next?.[fromLayer]?.[toIndex]?.[fromIndex];
      if (typeof current === "number") {
        next[fromLayer][toIndex][fromIndex] = current + -dy * dragScale;
      }
      return next;
    });
  };

  const isDirty = useMemo(() => {
    // Inputs dirty
    const initInputs = initialInputsRef.current;
    if (inputs.length !== initInputs.length) return true;
    for (let i = 0; i < inputs.length; i += 1) {
      if (inputs[i] !== initInputs[i]) return true;
    }
    // Weights dirty
    const initWeights = initialWeightsRef.current;
    if (weights.length !== initWeights.length) return true;
    for (let l = 0; l < weights.length; l += 1) {
      const layer = weights[l];
      const initLayer = initWeights[l];
      if (!initLayer || layer.length !== initLayer.length) return true;
      for (let r = 0; r < layer.length; r += 1) {
        const row = layer[r];
        const initRow = initLayer[r];
        if (!initRow || row.length !== initRow.length) return true;
        for (let c = 0; c < row.length; c += 1) {
          if (row[c] !== initRow[c]) return true;
        }
      }
    }
    return false;
  }, [inputs, weights]);

  return (
    <div>
      <div className="mx-auto relative">
        <MultilayerPerceptronSvg
          {...(rest as MlpOptions)}
          weights={weights}
          activations={computedActivations}
          onInputBoxDrag={onInputBoxDrag}
          onWeightLabelDrag={onWeightLabelDrag}
          onNodeFocusChange={handleNodeFocusChange}
        />
        {isDirty && (
          <button
            type="button"
            className="absolute bottom-2 right-2 px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
            onClick={handleReset}
            aria-label="Reset inputs and weights"
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
                    (<span className="text-blue-600">{toFixed(input)}</span>
                    ✖️
                    <span className="text-orange-700">
                      {toFixed(nodeWeights?.[index])}
                    </span>
                    ){index < layerInputs.length - 1 && <span> ➕ </span>}
                  </span>
                ))}
              {layerInputs && (
                <>
                  🟰{" "}
                  <span className="text-blue-600">
                    {toFixed(nodeActivation)}
                  </span>
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
  if (typeof value !== "number") return undefined;
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(precision);
}
