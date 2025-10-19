"use client";

import React, { useState, useCallback, useMemo, useId, useRef, type ReactElement } from "react";

type Point = {
  x: number;
  y: number;
};

export type NodeFocusChange = {
  layerNumber: number;
  nodeNumber: number;
  layerInputs?: number[];
  nodeWeights?: number[];
  nodeActivation?: number;
};

export type MlpOptions = {
  layerCount?: number;
  neuronsPerLayer?: number;
  neuronCounts?: number[];
  svgWidth?: number;
  svgHeight?: number;
  margin?: number;
  neuronRadius?: number;
  weights?: number[][][];
  // Biases for each non-input layer's nodes; shape: biases[layerIndex-1][nodeIndex]
  biases?: number[][];
  weightFontSize?: number;
  weightLabelPadding?: number;
  inputNeuronRadius?: number;
  inputFontSize?: number;
  activations?: number[][];
  responsive?: boolean; // when true, svg scales down with container but not above svgWidth
  edgeStrokeWidth?: number; // thickness of lines between nodes
  showOutputBarChart?: boolean;
  onNodeFocusChange?: (change: NodeFocusChange, focused: boolean) => void;
  // Called during drag gestures that start on an input (purple) data box
  // Arguments: (inputNumber, dx, dy)
  onInputBoxDrag?: (inputNumber: number, dx: number, dy: number) => void;
  // Called during drag gestures that start on a weight label box
  // Arguments: (fromLayer, fromIndex, toIndex, dx, dy)
  onWeightLabelDrag?: (
    fromLayer: number,
    fromIndex: number,
    toIndex: number,
    dx: number,
    dy: number
  ) => void;
  // Called during drag gestures that start on a node's bias label
  // Arguments: (layerIndex, nodeIndex, dx, dy)
  onBiasDrag?: (
    layerIndex: number,
    nodeIndex: number,
    dx: number,
    dy: number
  ) => void;
};

type ActiveNode = { layerIndex: number; nodeIndex: number } | null;

export default function MultilayerPerceptronSvg(options: MlpOptions = {}): ReactElement {
  const imageWidth = options.svgWidth ?? 800;
  const imageHeight = options.svgHeight ?? 380;
  const {
    layerCount = 3,
    neuronsPerLayer = 5,
    neuronCounts,
    margin = 40,
    neuronRadius = 15,
    weights,
    biases,
    weightFontSize = 16,
    weightLabelPadding,
    inputNeuronRadius = 4,
    inputFontSize = 16,
    activations,
    responsive = true,
    edgeStrokeWidth = 2,
    showOutputBarChart,
    onNodeFocusChange,
    onInputBoxDrag,
    onWeightLabelDrag,
    onBiasDrag,
  } = options;

  const outputArrowGap = 0;
  const outputArrowLength = 12;
  const outputArrowHead = 10;
  const inputArrowGap = 0;
  const inputArrowLength = 12;
  const inputArrowHead = 10;
  const arrowHalfHeight = 6;

  // Centralized color constants (not exported)
  const COLOR_EDGE = "#7b8290"; // lines and arrows
  const COLOR_NODE_FILL = "#bfdbfe"; // hidden/output nodes fill
  const COLOR_NODE_STROKE = "#1e40af"; // nodes stroke
  const COLOR_DATA = "#1d4ed8"; // data (inputs/outputs/activations) - blue 700
  const COLOR_WEIGHTS = "#c2410c"; // weights - orange 700
  // Base arrow padding (without labels)
  const baseRightPaddingForArrows =
    outputArrowGap + outputArrowLength + outputArrowHead;
  const baseLeftPaddingForArrows =
    inputArrowGap + inputArrowLength + inputArrowHead;

  // Measure label widths so the diagram never overflows the viewBox
  const approxCharWidth = (fontSize: number) => fontSize * 0.6;
  const measureLabelWidth = (text: string, fontSize: number, padding: number) => {
    const charWidth = approxCharWidth(fontSize);
    return Math.max(fontSize + 4, text.length * charWidth + padding * 2);
  };

  // Input labels (purple boxes on the left)
  const inputRectPadding = Math.max(2, Math.round((inputFontSize ?? 16) * 0.3));
  const inputValues = Array.isArray(activations) && activations.length > 0
    ? activations[0]
    : undefined;
  // Reserve a fixed width for ~6 digits so layout doesn't shift with value length
  const reservedInputDigits = 6;
  const inputLabelMaxWidth = measureLabelWidth(
    "0".repeat(reservedInputDigits),
    inputFontSize ?? 16,
    inputRectPadding
  );

  // Output activation labels (purple boxes on the right)
  const outputFontSize = weightFontSize ?? 16;
  const outputRectPadding = weightLabelPadding ?? Math.max(2, Math.round(outputFontSize * 0.3));
  const lastActivations = Array.isArray(activations) && activations.length > 0
    ? activations[activations.length - 1]
    : undefined;
  const formatOutputValue = (v: number) => (Number.isInteger(v) ? String(v) : String(v.toFixed(2)));
  // Compute auto width based on current outputs, but enforce a minimum equal to the input box width
  const outputAutoWidth = Array.isArray(lastActivations)
    ? lastActivations.reduce((max, v) => {
        if (typeof v !== "number") return max;
        const w = measureLabelWidth(formatOutputValue(v), outputFontSize, outputRectPadding);
        return Math.max(max, w);
      }, 0)
    : 0;
  const outputLabelMaxWidth = Math.max(inputLabelMaxWidth, outputAutoWidth);

  const rightPaddingForArrows = baseRightPaddingForArrows + outputLabelMaxWidth;
  const leftPaddingForArrows = baseLeftPaddingForArrows + inputLabelMaxWidth;

  const getWeight = (fromLayer: number, fromIndex: number, toIndex: number) => {
    return weights?.[fromLayer]?.[toIndex]?.[fromIndex];
  };

  const getNodeRadius = (layerIndex: number): number =>
    layerIndex === 0 ? inputNeuronRadius : neuronRadius;

  const getActivation = useCallback((layerIndex: number, nodeIndex: number) => {
    return activations?.[layerIndex]?.[nodeIndex];
  }, [activations]);

  const counts: number[] = Array.isArray(neuronCounts)
    ? neuronCounts
    : Array.from({ length: layerCount }, () => neuronsPerLayer);
  const resolvedLayerCount = counts.length;

  const innerWidth = Math.max(
    0,
    imageWidth - margin * 2 - leftPaddingForArrows - rightPaddingForArrows
  );
  const innerHeight = Math.max(0, imageHeight - margin * 2);
  const maxNodesInAnyLayer = Math.max(1, ...counts);
  const uniformRowSpacing =
    maxNodesInAnyLayer > 1 ? innerHeight / (maxNodesInAnyLayer - 1) : 0;

  const layers: Point[][] = Array.from(
    { length: resolvedLayerCount },
    (_, layerIndex) => {
      const nodesInLayer = counts[layerIndex] ?? neuronsPerLayer;
      return Array.from({ length: nodesInLayer }, (_, neuronIndex) => {
        const x =
          margin +
          leftPaddingForArrows +
          (resolvedLayerCount === 1
            ? innerWidth / 2
            : (layerIndex * innerWidth) / (resolvedLayerCount - 1));
        const layerHeight = (nodesInLayer - 1) * uniformRowSpacing;
        const startY = margin + (innerHeight - layerHeight) / 2;
        const y =
          nodesInLayer === 1
            ? margin + innerHeight / 2
            : startY + neuronIndex * uniformRowSpacing;
        return { x, y };
      });
    }
  );

  const [active, setActive] = useState<ActiveNode>(null);
  const [isLocked, setIsLocked] = useState(false); // true when focus comes from click/touch
  const [dragState, setDragState] = useState<
    | { kind: "input"; inputIndex: number; lastX: number; lastY: number }
    | { kind: "weight"; fromLayer: number; fromIndex: number; toIndex: number; lastX: number; lastY: number }
    | { kind: "bias"; layerIndex: number; nodeIndex: number; lastX: number; lastY: number }
    | null
  >(null);
  const biasDownRef = useRef<{
    startX: number;
    startY: number;
    layerIndex: number;
    nodeIndex: number;
  } | null>(null);

  const getLayerInputs = useCallback((layerIndex: number): number[] | undefined => {
    if (layerIndex === 0) return activations?.[0];
    return activations?.[layerIndex - 1];
  }, [activations]);

  const getLayerWeightsForNode = useCallback((layerIndex: number, nodeIndex: number): number[] | undefined => {
    if (layerIndex === 0) return undefined;
    return weights?.[layerIndex - 1]?.[nodeIndex];
  }, [weights]);

  const emitNodeFocusChange = useCallback((layerIndex: number, nodeIndex: number, focused: boolean) => {
    if (!onNodeFocusChange) return;
    onNodeFocusChange({
      layerNumber: layerIndex,
      nodeNumber: nodeIndex,
      layerInputs: getLayerInputs(layerIndex),
      nodeWeights: getLayerWeightsForNode(layerIndex, nodeIndex),
      nodeActivation: getActivation(layerIndex, nodeIndex),
    }, focused);
  }, [onNodeFocusChange, getLayerInputs, getLayerWeightsForNode, getActivation]);

  // Clear focus helper
  const clearFocus = useCallback(() => {
    if (active) {
      emitNodeFocusChange(active.layerIndex, active.nodeIndex, false);
    }
    setActive(null);
  }, [active, emitNodeFocusChange]);

  const isNodeHighlighted = (layerIndex: number, nodeIndex: number): boolean => {
    if (!active) return true;
    if (layerIndex === active.layerIndex && nodeIndex === active.nodeIndex) {
      return true;
    }
    if (layerIndex === active.layerIndex - 1) {
      // Inputs (previous layer) to the active node
      return true;
    }
    return false;
  };

  const isEdgeHighlighted = (
    fromLayer: number,
    fromIndex: number,
    toIndex: number
  ): boolean => {
    if (!active) return true;
    // Only edges that feed into the active node remain full opacity
    return fromLayer === active.layerIndex - 1 && toIndex === active.nodeIndex;
  };

  const isInputArrowHighlighted = (firstLayerIndex: number): boolean => {
    if (!active) return true;
    // If active is in the first layer, only its corresponding input arrow is highlighted
    if (active.layerIndex === 0) {
      return firstLayerIndex === active.nodeIndex;
    }
    // If focusing the first hidden layer, all network inputs feed into it
    if (active.layerIndex === 1) {
      return true;
    }
    // For deeper layers, network inputs are not direct inputs -> dim them
    return false;
  };

  const isOutputArrowHighlighted = (lastLayerIndex: number): boolean => {
    if (!active) return true;
    // If active is in the last layer, only its corresponding output arrow/label is highlighted
    if (active.layerIndex === resolvedLayerCount - 1) {
      return lastLayerIndex === active.nodeIndex;
    }
    return false;
  };

  const dimOpacity = 0.2;

  // Toggle for showing outputs as bars or numbers; default from prop
  const [showOutputBars, setShowOutputBars] = useState<boolean>(!!showOutputBarChart);

  // Softmax helper for output scaling
  const outputProbs = useMemo(() => {
    const values = Array.isArray(lastActivations)
      ? lastActivations.filter((v): v is number => typeof v === 'number' && Number.isFinite(v))
      : undefined;
    if (!values || values.length === 0) return undefined;
    // Use all lastActivations in original order; if any non-number, bail
    if (!Array.isArray(lastActivations) || lastActivations.some(v => typeof v !== 'number' || !Number.isFinite(v as number))) return undefined;
    const nums = lastActivations as number[];
    const max = Math.max(...nums);
    const exps = nums.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    if (sum <= 0) return nums.map(() => 0);
    return exps.map(v => v / sum);
  }, [lastActivations]);

  // Mask id to clip edges under node circles (prevents edges showing through on hover opacity)
  const edgesMaskId = useId();

  return (
    <svg
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      className="select-none"
      style={
        responsive
          ? {
              maxWidth: imageWidth,
              width: "100%",
              height: "auto",
              aspectRatio: `${imageWidth} / ${imageHeight}`,
            }
          : undefined
      }
      width={responsive ? undefined : imageWidth}
      height={responsive ? undefined : imageHeight}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${resolvedLayerCount}-layer dense neural network with layer sizes ${counts.join(
        ","
      )}`}
      onPointerMove={(e) => {
        if (!dragState) return;
        const dx = e.clientX - dragState.lastX;
        const dy = e.clientY - dragState.lastY;
        if (dragState.kind === "input") {
          if (onInputBoxDrag) {
            onInputBoxDrag(dragState.inputIndex, dx, dy);
          }
          setDragState({ kind: "input", inputIndex: dragState.inputIndex, lastX: e.clientX, lastY: e.clientY });
        } else if (dragState.kind === "weight") {
          if (onWeightLabelDrag) {
            onWeightLabelDrag(dragState.fromLayer, dragState.fromIndex, dragState.toIndex, dx, dy);
          }
          setDragState({ kind: "weight", fromLayer: dragState.fromLayer, fromIndex: dragState.fromIndex, toIndex: dragState.toIndex, lastX: e.clientX, lastY: e.clientY });
        } else if (dragState.kind === "bias") {
          if (onBiasDrag) {
            onBiasDrag(dragState.layerIndex, dragState.nodeIndex, dx, dy);
          }
          setDragState({ kind: "bias", layerIndex: dragState.layerIndex, nodeIndex: dragState.nodeIndex, lastX: e.clientX, lastY: e.clientY });
        }
      }}
      onPointerUp={() => {
        if (dragState) {
          setDragState(null);
        }
      }}
      onPointerCancel={() => {
        if (dragState) {
          setDragState(null);
        }
      }}
      onPointerDown={(e) => {
        // Do not change focus if an input drag is in progress
        if (dragState) return;
        const target = e.target as Element | null;
        // If the target is a node (circle), do not clear focus here
        if (target && target.closest('circle')) return;
        // Click/touch outside any node clears focus lock and active state
        setIsLocked(false);
        clearFocus();
      }}
    >
      <defs>
        <mask id={edgesMaskId} maskUnits="userSpaceOnUse">
          {/* Show everything by default */}
          <rect x={0} y={0} width={imageWidth} height={imageHeight} fill="#ffffff" />
          {/* Hide areas under node circles */}
          {layers.flatMap((layer, i) =>
            layer.map((p) => (
              <circle key={`mask-node-${i}-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={getNodeRadius(i)} fill="#000000" />
            ))
          )}
        </mask>
      </defs>
      {/* Edges between layers */}
      <g mask={`url(#${edgesMaskId})`}>
        {layers.flatMap((layer, i) => {
          const next = layers[i + 1];
          if (!next) return [] as ReactElement[];
          const lines: ReactElement[] = [];
          for (let a = 0; a < layer.length; a += 1) {
            for (let b = 0; b < next.length; b += 1) {
              const p1 = layer[a];
              const p2 = next[b];
              const highlighted = isEdgeHighlighted(i, a, b);
              lines.push(
                <line
                  key={`edge-${i}-${a}-${b}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={COLOR_EDGE}
                  strokeWidth={edgeStrokeWidth}
                  strokeLinecap="round"
                  style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}
                />
              );
            }
          }
          return lines;
        })}
      </g>

      {/* Neurons */}
      <g>
        {layers.flatMap((layer, i) =>
          layer.map((p, j) => {
            const highlighted = isNodeHighlighted(i, j);
            const r = getNodeRadius(i);
            const isFirstLayer = i === 0;
            return (
              <circle
                key={`node-${i}-${j}`}
                cx={p.x}
                cy={p.y}
                r={r}
                fill={isFirstLayer ? COLOR_EDGE : COLOR_NODE_FILL}
                stroke={COLOR_NODE_STROKE}
                strokeWidth={2}
                style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}
                onMouseEnter={() => {
                  if (dragState) return; // do not change focus while dragging input value
                  if (isLocked) return; // hover should not change focus when locked by click/touch
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
                onMouseLeave={(e) => {
                  if (dragState) return; // preserve current focus while dragging input value
                  if (isLocked) return; // keep focus while locked
                  const rt = (e as unknown as React.MouseEvent<SVGCircleElement>).relatedTarget as Element | null;
                  if (rt && rt.closest(`[data-bias-for='${i}-${j}']`)) {
                    // moving into this node's bias overlay - keep focus to avoid flicker
                    return;
                  }
                  emitNodeFocusChange(i, j, false);
                  setActive(null);
                }}
                onPointerDown={() => {
                  // Toggle off if clicking the already click/touch-focused node
                  if (isLocked && active && active.layerIndex === i && active.nodeIndex === j) {
                    setIsLocked(false);
                    clearFocus();
                    return;
                  }
                  // If a different node was active, emit unfocus for it first
                  if (active && (active.layerIndex !== i || active.nodeIndex !== j)) {
                    emitNodeFocusChange(active.layerIndex, active.nodeIndex, false);
                  }
                  setIsLocked(true);
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
              />
            );
          })
        )}
      </g>

      {/* Bias labels centered inside non-input nodes */}
      <g>
        {layers.flatMap((layer, i) =>
          layer.map((p, j) => {
            if (i === 0) return null as unknown as ReactElement; // no biases for input layer
            const value = biases?.[i - 1]?.[j];
            if (typeof value !== 'number' || !Number.isFinite(value)) return null as unknown as ReactElement;
            const highlighted = isNodeHighlighted(i, j);
            const textStr = `${value >= 0 ? '+' : ''}${value.toFixed(1)}`;
            const fontSize = weightFontSize;
            const biasPointerEnabled = !!onBiasDrag && !!active && active.layerIndex === i && active.nodeIndex === j;
            return (
              <g
                key={`bias-${i}-${j}`}
                transform={`translate(${p.x}, ${p.y})`}
                data-bias-for={`${i}-${j}`}
                style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease", pointerEvents: 'auto', cursor: biasPointerEnabled ? 'ns-resize' : undefined, touchAction: biasPointerEnabled ? 'none' : undefined }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  biasDownRef.current = { startX: e.clientX, startY: e.clientY, layerIndex: i, nodeIndex: j };
                  if (biasPointerEnabled) {
                    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
                    setDragState({ kind: 'bias', layerIndex: i, nodeIndex: j, lastX: e.clientX, lastY: e.clientY });
                  }
                }}
                onPointerUp={(e) => {
                  const press = biasDownRef.current;
                  biasDownRef.current = null;
                  if (dragState && dragState.kind === 'bias') {
                    try { (e.currentTarget as Element & { releasePointerCapture: (id: number) => void }).releasePointerCapture(e.pointerId); } catch {}
                    setDragState(null);
                  }
                  if (!press) return;
                  const dx = e.clientX - press.startX;
                  const dy = e.clientY - press.startY;
                  const moved = Math.hypot(dx, dy) > 2; // small threshold to distinguish click vs drag
                  if (moved) return; // treat as drag; state already cleared above/root
                  // Treat as a click: toggle focus like clicking the node circle
                  if (isLocked && active && active.layerIndex === i && active.nodeIndex === j) {
                    setIsLocked(false);
                    clearFocus();
                    return;
                  }
                  if (active && (active.layerIndex !== i || active.nodeIndex !== j)) {
                    emitNodeFocusChange(active.layerIndex, active.nodeIndex, false);
                  }
                  setIsLocked(true);
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
                onMouseEnter={() => {
                  if (dragState) return;
                  if (isLocked) return;
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
                onMouseLeave={(e) => {
                  if (dragState) return;
                  if (isLocked) return;
                  const rt = (e as unknown as React.MouseEvent<SVGGElement>).relatedTarget as Element | null;
                  if (rt && (rt.closest(`[data-bias-for='${i}-${j}']`) || rt.closest('circle'))) {
                    return;
                  }
                  emitNodeFocusChange(i, j, false);
                  setActive(null);
                }}
              >
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_WEIGHTS}>{textStr}</text>
              </g>
            );
          })
        )}
      </g>

      {/* Activation labels for inputs to the focused layer (show all nodes in previous layer) */}
      <g style={{ pointerEvents: "none" }}>
        {layers.flatMap((layer, i) => {
          const isHiddenLayer = i > 0 && i < resolvedLayerCount - 1;
          if (!isHiddenLayer) return [] as ReactElement[];
          const showLayer = !!active && active.layerIndex === i + 1; // previous layer of the active node's layer
          const targetPoint = showLayer ? layers[i + 1]?.[active!.nodeIndex] : undefined;
          return layer.map((p, j) => {
            const show = showLayer;
            const value = getActivation(i, j);
            if (typeof value !== 'number') return null as unknown as ReactElement;
            const textStr = String(Number.isInteger(value) ? value : value.toFixed(2));
            const fontSize = weightFontSize;
            const rectPadding = weightLabelPadding ?? Math.max(2, Math.round(fontSize * 0.3));
            const charWidth = fontSize * 0.6;
            const rectWidth = Math.max(fontSize + 4, textStr.length * charWidth + rectPadding * 2);
            const rectHeight = fontSize + rectPadding * 2;
            const r = getNodeRadius(i);
            // Align left edges at a fixed x for this layer; intersect the edge with the vertical line x = xLeft
            const leftEdgeGap = 0; // gap from node circle to label left edge
            const xLeft = p.x + r + leftEdgeGap; // same for all nodes in this layer
            const centerX = xLeft + rectWidth / 2;
            let centerY = p.y;
            if (targetPoint) {
              const dx = targetPoint.x - p.x;
              const dy = targetPoint.y - p.y;
              // Avoid division by zero; for layered layout dx should be > 0
              if (Math.abs(dx) > 1e-6) {
                const t = (xLeft - p.x) / dx; // param where the edge hits the vertical line
                centerY = p.y + dy * t;
              }
            }
            return (
              <g key={`act-${i}-${j}`} transform={`translate(${centerX}, ${centerY})`} style={{ opacity: show ? 1 : 0, transition: "opacity 120ms ease" }}>
                <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke={COLOR_DATA} strokeWidth={1} />
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_DATA}>{textStr}</text>
              </g>
            );
          });
        })}
      </g>

      {/* Activation label for the focused hidden-layer node itself */}
      <g style={{ pointerEvents: "none" }}>
        {layers.flatMap((layer, i) =>
          layer.map((p, j) => {
            const isHiddenLayer = i > 0 && i < resolvedLayerCount - 1;
            const show = isHiddenLayer && !!active && active.layerIndex === i && active.nodeIndex === j;
            if (!show) return null as unknown as ReactElement;
            const value = getActivation(i, j);
            if (typeof value !== 'number') return null as unknown as ReactElement;
            const textStr = String(Number.isInteger(value) ? value : value.toFixed(2));
            const fontSize = weightFontSize;
            const rectPadding = weightLabelPadding ?? Math.max(2, Math.round(fontSize * 0.3));
            const charWidth = fontSize * 0.6;
            const rectWidth = Math.max(fontSize + 4, textStr.length * charWidth + rectPadding * 2);
            const rectHeight = fontSize + rectPadding * 2;
            const r = getNodeRadius(i);
            const gap = 1;
            const x = p.x + (r + gap) + rectWidth / 2; // to the right of the node
            const y = p.y; // vertically centered with the node
            return (
              <g key={`act-self-${i}-${j}`} transform={`translate(${x}, ${y})`} style={{ opacity: 1, transition: "opacity 120ms ease" }}>
                <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke={COLOR_DATA} strokeWidth={1} />
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_DATA}>{textStr}</text>
              </g>
            );
          })
        )}
      </g>

      {/* Weight labels at edge midpoints (visible only when hovering receiving node) */}
      <g>
        {layers.flatMap((layer, i) => {
          const next = layers[i + 1];
          if (!next) return [] as ReactElement[];
          const labels: ReactElement[] = [];
          for (let a = 0; a < layer.length; a += 1) {
            for (let b = 0; b < next.length; b += 1) {
              const value = getWeight(i, a, b);
              if (typeof value !== 'number') continue;
              const p1 = layer[a];
              const p2 = next[b];
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const show = !!active && active.layerIndex === i + 1 && active.nodeIndex === b;
              const textStr = String(value.toFixed(1));
              const fontSize = weightFontSize;
              const rectPadding = weightLabelPadding ?? Math.max(2, Math.round(fontSize * 0.3));
              const charWidth = fontSize * 0.6; // rough average width factor
              const rectWidth = Math.max(fontSize + 4, textStr.length * charWidth + rectPadding * 2);
              const rectHeight = fontSize + rectPadding * 2;
              labels.push(
                <g
                  key={`w-${i}-${a}-${b}`}
                  transform={`translate(${midX}, ${midY})`}
                  style={{
                    opacity: show ? 1 : 0,
                    transition: "opacity 120ms ease",
                    pointerEvents: show ? 'auto' : 'none',
                    cursor: onWeightLabelDrag ? 'ns-resize' : undefined,
                    touchAction: show && onWeightLabelDrag ? 'none' : undefined,
                  }}
                  onPointerDown={(e) => {
                    if (!onWeightLabelDrag) return;
                    e.stopPropagation();
                    e.preventDefault();
                    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
                    setDragState({ kind: 'weight', fromLayer: i, fromIndex: a, toIndex: b, lastX: e.clientX, lastY: e.clientY });
                  }}
                >
                  <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={3} ry={3} fill="#ffffff" stroke={COLOR_WEIGHTS} strokeWidth={1} />
                  <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_WEIGHTS}>{textStr}</text>
                </g>
              );
            }
          }
          return labels;
        })}
      </g>

      {/* Output arrows to the right of the final layer */}
      {(() => {
        const lastLayer = layers[resolvedLayerCount - 1] ?? [];
        return lastLayer.map((p, idx) => {
          const y = p.y;
          const startAtCircle = p.x + neuronRadius;
          const shaftStartX = startAtCircle + outputArrowGap;
          const shaftEndX = shaftStartX + outputArrowLength;
          const headTipX = shaftEndX + outputArrowHead;
          const headBaseYTop = y - Math.min(arrowHalfHeight, neuronRadius - 1);
          const headBaseYBottom =
            y + Math.min(arrowHalfHeight, neuronRadius - 1);
          const highlighted = isOutputArrowHighlighted(idx);
          const actValue = getActivation(resolvedLayerCount - 1, idx);
          const activationText = typeof actValue === 'number' ? String(Number.isInteger(actValue) ? actValue : actValue.toFixed(2)) : null;
          const fontSize = weightFontSize;
          const rectPadding = weightLabelPadding ?? Math.max(2, Math.round(fontSize * 0.3));
          const charWidth = fontSize * 0.6;
          const rectWidth = activationText
            ? Math.max(inputLabelMaxWidth, Math.max(fontSize + 4, activationText.length * charWidth + rectPadding * 2))
            : inputLabelMaxWidth;
          const rectHeight = fontSize + rectPadding * 2;
          const actX = shaftEndX + outputArrowHead + rectWidth / 2; // flush with arrow tip
          const actY = y;
          const prob = Array.isArray(outputProbs) ? outputProbs[idx] : undefined;
          const barWidth = typeof prob === 'number' ? prob * rectWidth : 0;
          const barLeftX = actX - rectWidth / 2;
          return (
            <React.Fragment key={`out-${idx}`}>
              <g style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
                <line
                  x1={shaftStartX}
                  y1={y}
                  x2={shaftEndX}
                  y2={y}
                  stroke={COLOR_EDGE}
                  strokeWidth={2}
                />
                <polygon
                  points={`${headTipX},${y} ${shaftEndX},${headBaseYTop} ${shaftEndX},${headBaseYBottom}`}
                  fill={COLOR_EDGE}
                />
              </g>
              {activationText && (
                <g style={{ cursor: 'pointer' }} onPointerDown={(e) => { e.stopPropagation(); setShowOutputBars(prev => !prev); }}>
                  {showOutputBars && typeof prob === 'number' ? (
                    <g style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
                      <rect
                        x={barLeftX}
                        y={actY - rectHeight / 2}
                        width={barWidth}
                        height={rectHeight}
                        rx={4}
                        ry={4}
                        fill={COLOR_DATA}
                      />
                    </g>
                  ) : (
                    <g transform={`translate(${actX}, ${actY})`} style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
                      <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke={COLOR_DATA} strokeWidth={1} />
                      <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_DATA}>{activationText}</text>
                    </g>
                  )}
                </g>
              )}
            </React.Fragment>
          );
        });
      })()}

      {/* Input arrows to the left of the first layer */}
      {(() => {
        const firstLayer = layers[0] ?? [];
        return firstLayer.map((p, idx) => {
          const y = p.y;
          const r = getNodeRadius(0);
          const tipAtCircle = p.x - r;
          const baseX = tipAtCircle - inputArrowHead;
          const shaftEndX = baseX;
          const shaftStartX = shaftEndX - inputArrowLength;
          const headTipX = tipAtCircle;
          const headBaseYTop = y - Math.min(arrowHalfHeight, neuronRadius - 1);
          const headBaseYBottom =
            y + Math.min(arrowHalfHeight, neuronRadius - 1);
          const highlighted = isInputArrowHighlighted(idx);
          return (
            <g key={`in-${idx}`} style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
              {typeof inputValues?.[idx] === 'number' && (() => {
                const value = inputValues[idx] as number;
                const textStr = Number.isFinite(value)
                  ? (Number.isInteger(value) ? String(value) : String(value.toFixed(2)))
                  : String(value);
                const fontSize = inputFontSize;
                const rectPadding = Math.max(2, Math.round(fontSize * 0.3));
                const rectWidth = Math.max(fontSize + 4, inputLabelMaxWidth);
                const rectHeight = fontSize + rectPadding * 2;
                const rightEdgeX = shaftStartX; // flush with arrow shaft start
                const centerX = rightEdgeX - rectWidth / 2;
                return (
                  <g
                    transform={`translate(${centerX}, ${y})`}
                    style={onInputBoxDrag ? { cursor: 'ns-resize', touchAction: 'none' } : undefined}
                    onPointerDown={(e) => {
                      if (!onInputBoxDrag) return;
                      e.stopPropagation();
                      e.preventDefault();
                      // Capture pointer so move/up events keep firing even if we leave the box
                      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
                      setDragState({ kind: 'input', inputIndex: idx, lastX: e.clientX, lastY: e.clientY });
                    }}
                  >
                    <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke={COLOR_DATA} strokeWidth={1} />
                    <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill={COLOR_DATA}>{textStr}</text>
                  </g>
                );
              })()}
              <line
                x1={shaftStartX}
                y1={y}
                x2={shaftEndX}
                y2={y}
                stroke={COLOR_EDGE}
                strokeWidth={2}
              />
              <polygon
                points={`${headTipX},${y} ${baseX},${headBaseYTop} ${baseX},${headBaseYBottom}`}
                fill={COLOR_EDGE}
              />
            </g>
          );
        });
      })()}
    </svg>
  );
}
