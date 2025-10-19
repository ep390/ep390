"use client";

import React, { useMemo, useRef, useState, type ReactElement } from "react";
import MultilayerPerceptronSvg, { type MlpOptions } from "./MlpSvg";
import { calculateActivations } from "./calculate-activations";
import Toggle from "@/components/Toggle";

const WEIGHT_DECIMALS = 1;
const BIAS_DECIMALS = 1;
function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
const WEIGHT_STEP = Math.pow(10, -WEIGHT_DECIMALS);
const BIAS_STEP = Math.pow(10, -BIAS_DECIMALS);

export type MlpOptionsWithData = MlpOptions & {
  weights: number[][][];
  activations: number[][];
};

export type MlpEditableOptions = MlpOptionsWithData & {
  showEquation?: boolean;
  inputNumberType?: "float" | "int";
  activation?: "sigmoid" | "relu";
};

export default function MlpEditable(options: MlpEditableOptions): ReactElement {
  const {
    weights: initialWeights,
    activations: initialActivations,
    biases: initialBiases,
    activation,
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
  const [biases, setBiases] = useState<number[][] | undefined>(() =>
    Array.isArray(initialBiases)
      ? initialBiases.map((layer) =>
          Array.isArray(layer) ? [...layer] : layer
        )
      : undefined
  );

  // Accumulates fractional integer steps per input during drag so slow drags still step
  const intAccumRef = useRef<number[]>([]);
  // Accumulate fractional drag deltas per weight/bias so updates are step-based, not event-rate-based
  const weightAccumRef = useRef<Map<string, number>>(new Map());
  const biasAccumRef = useRef<Map<string, number>>(new Map());

  // Capture the initial inputs once so we can compare and reset
  const initialInputsRef = useRef<number[]>(
    Array.isArray(initialActivations?.[0]) ? [...initialActivations[0]] : []
  );
  // Capture the initial weights once (deep copy) for dirty check and reset
  const initialWeightsRef = useRef<number[][][]>(
    initialWeights.map((layer) => layer.map((row) => [...row]))
  );
  // Capture the initial biases once for dirty check and reset
  const initialBiasesRef = useRef<number[][] | undefined>(
    Array.isArray(initialBiases)
      ? initialBiases.map((layer) =>
          Array.isArray(layer) ? [...layer] : layer
        )
      : undefined
  );

  const activationFn = useMemo<((x: number) => number) | undefined>(() => {
    if (activation === "relu") return (x: number) => Math.max(0, x);
    if (activation === "sigmoid") return (x: number) => 1 / (1 + Math.exp(-x));
    return undefined;
  }, [activation]);

  const computedActivations = useMemo(() => {
    return calculateActivations(inputs, weights, biases, activationFn);
  }, [inputs, weights, biases, activationFn]);

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

  const nodeBias = useMemo(() => {
    if (!focused) return undefined;
    if (!biases) return undefined;
    if (focused.layerIndex === 0) return undefined;
    return biases?.[focused.layerIndex - 1]?.[focused.nodeIndex];
  }, [focused, biases]);

  const nodePreActivation = useMemo(() => {
    if (!focused) return undefined;
    if (!layerInputs) return undefined;
    if (!nodeWeights) return undefined;
    const sum = layerInputs.reduce(
      (acc, val, idx) => acc + val * (nodeWeights?.[idx] ?? 0),
      0
    );
    return typeof nodeBias === "number" ? sum + nodeBias : sum;
  }, [focused, layerInputs, nodeWeights, nodeBias]);

  const handleReset = () => {
    setInputs(() => [...initialInputsRef.current]);
    intAccumRef.current = [];
    setWeights(() =>
      initialWeightsRef.current.map((layer) => layer.map((row) => [...row]))
    );
    setBiases(() =>
      initialBiasesRef.current
        ? initialBiasesRef.current.map((layer) => [...layer])
        : undefined
    );
  };

  const onWeightLabelDrag: NonNullable<MlpOptions["onWeightLabelDrag"]> = (
    fromLayer,
    fromIndex,
    toIndex,
    _dx,
    dy
  ) => {
    const dragScale = 0.02; // value change per pixel; upward drag increases value
    const key = `${fromLayer}:${toIndex}:${fromIndex}`;
    const prevAccum = weightAccumRef.current.get(key) ?? 0;
    const accum = prevAccum + -dy * dragScale;
    const steps =
      accum >= 0
        ? Math.floor(accum / WEIGHT_STEP)
        : Math.ceil(accum / WEIGHT_STEP);
    weightAccumRef.current.set(key, accum - steps * WEIGHT_STEP);
    if (steps === 0) return;
    setWeights((prev) => {
      const next = prev.map((layer) => layer.map((row) => [...row]));
      const current = next?.[fromLayer]?.[toIndex]?.[fromIndex];
      if (typeof current === "number") {
        const updated = current + steps * WEIGHT_STEP;
        next[fromLayer][toIndex][fromIndex] = roundToDecimals(
          updated,
          WEIGHT_DECIMALS
        );
      }
      return next;
    });
  };

  const onBiasDrag: NonNullable<MlpOptions["onBiasDrag"]> = (
    layerIndex,
    nodeIndex,
    _dx,
    dy
  ) => {
    if (!biases) return;
    const dragScale = 0.02; // value change per pixel; upward drag increases value
    const key = `${layerIndex}:${nodeIndex}`;
    const prevAccum = biasAccumRef.current.get(key) ?? 0;
    const accum = prevAccum + -dy * dragScale;
    const steps =
      accum >= 0 ? Math.floor(accum / BIAS_STEP) : Math.ceil(accum / BIAS_STEP);
    biasAccumRef.current.set(key, accum - steps * BIAS_STEP);
    if (steps === 0) return;
    setBiases((prev) => {
      if (!prev) return prev;
      const next = prev.map((layer) => [...layer]);
      const current = next?.[layerIndex - 1]?.[nodeIndex];
      if (typeof current === "number") {
        const updated = current + steps * BIAS_STEP;
        next[layerIndex - 1][nodeIndex] = roundToDecimals(
          updated,
          BIAS_DECIMALS
        );
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
    // Biases dirty
    const initBiases = initialBiasesRef.current;
    if (!initBiases && biases) return true;
    if (initBiases && !biases) return true;
    if (initBiases && biases) {
      if (biases.length !== initBiases.length) return true;
      for (let l = 0; l < biases.length; l += 1) {
        const layer = biases[l];
        const initLayer = initBiases[l];
        if (!initLayer || layer.length !== initLayer.length) return true;
        for (let n = 0; n < layer.length; n += 1) {
          if (layer[n] !== initLayer[n]) return true;
        }
      }
    }
    return false;
  }, [inputs, weights, biases]);

  const fName =
    activation === "relu" ? "ReLU" : activation === "sigmoid" ? "Sigmoid" : "f";

  return (
    <div>
      <div className="mx-auto relative">
        <MultilayerPerceptronSvg
          {...(rest as MlpOptions)}
          weights={weights}
          biases={biases}
          activations={computedActivations}
          onInputBoxDrag={onInputBoxDrag}
          onWeightLabelDrag={onWeightLabelDrag}
          onBiasDrag={onBiasDrag}
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
            <div className="text-xl font-mono min-h-20 bg-gray-100 flex flex-col justify-center gap-2 p-2 rounded-sm">
              {layerInputs && (
                <>
                  <div>
                    {layerInputs.map((input, index) => (
                      <span key={index}>
                        (<span className="text-blue-600">{toFixed(input)}</span>
                        ✖️
                        <span className="text-orange-700">
                          {toFixed(nodeWeights?.[index])}
                        </span>
                        ){index < layerInputs.length - 1 && <span> ➕ </span>}
                      </span>
                    ))}
                    {
                      <>
                        {typeof nodeBias === "number" && (
                          <>
                            <span> {nodeBias >= 0 ? "➕" : "➖"} </span>
                            <span className="text-orange-700">
                              {Math.abs(nodeBias).toFixed(1)}
                            </span>
                          </>
                        )}{" "}
                        🟰{" "}
                        <span className="text-blue-600">
                          {toFixed(nodePreActivation)}
                        </span>
                      </>
                    }
                  </div>
                  {typeof nodePreActivation === "number" &&
                    typeof nodeActivation === "number" &&
                    activationFn && (
                      <div>
                        {fName}(
                        <span className="text-blue-600">
                          {nodePreActivation.toFixed(2)}
                        </span>
                        ) 🟰{" "}
                        <span className="text-blue-600 font-bold">
                          {nodeActivation.toFixed(2)}
                        </span>
                      </div>
                    )}
                </>
              )}
              {layerInputs ? null : (
                <span className="text-gray-500">
                  Select a node to see the equation
                </span>
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
