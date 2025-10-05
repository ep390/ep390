"use client";

import React, { useEffect, useState, useCallback, type ReactElement } from "react";

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
  weightFontSize?: number;
  weightLabelPadding?: number;
  inputNeuronRadius?: number;
  inputFontSize?: number;
  activations?: number[][];
  onNodeFocusChange?: (change: NodeFocusChange, focused: boolean) => void;
};

type ActiveNode = { layerIndex: number; nodeIndex: number } | null;

export function MultilayerPerceptronSvg(options: MlpOptions = {}): ReactElement {
  const imageWidth = options.svgWidth ?? 800;
  const imageHeight = options.svgHeight ?? 380;
  const {
    layerCount = 3,
    neuronsPerLayer = 5,
    neuronCounts,
    margin = 40,
    neuronRadius = 15,
    weights,
    weightFontSize = 16,
    weightLabelPadding,
    inputNeuronRadius = 4,
    inputFontSize = 16,
    activations,
    onNodeFocusChange,
  } = options;

  const outputArrowGap = 0;
  const outputArrowLength = 12;
  const outputArrowHead = 10;
  const inputArrowGap = 0;
  const inputArrowLength = 12;
  const inputArrowHead = 10;
  const arrowHalfHeight = 6;
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
  const inputLabelMaxWidth = Array.isArray(inputValues)
    ? inputValues.reduce((max, v) => {
        if (typeof v !== "number") return max;
        const w = measureLabelWidth(String(v), inputFontSize ?? 16, inputRectPadding);
        return Math.max(max, w);
      }, 0)
    : 0;

  // Output activation labels (purple boxes on the right)
  const outputFontSize = weightFontSize ?? 16;
  const outputRectPadding = weightLabelPadding ?? Math.max(2, Math.round(outputFontSize * 0.3));
  const lastActivations = Array.isArray(activations) && activations.length > 0
    ? activations[activations.length - 1]
    : undefined;
  const formatOutputValue = (v: number) => (Number.isInteger(v) ? String(v) : String(v.toFixed(2)));
  const outputLabelMaxWidth = Array.isArray(lastActivations)
    ? lastActivations.reduce((max, v) => {
        if (typeof v !== "number") return max;
        const w = measureLabelWidth(formatOutputValue(v), outputFontSize, outputRectPadding);
        return Math.max(max, w);
      }, 0)
    : 0;

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
  const [isPointerDown, setIsPointerDown] = useState(false);

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

  useEffect(() => {
    if (!isPointerDown) return;
    const handleUp = () => {
      setIsPointerDown(false);
      if (active) {
        emitNodeFocusChange(active.layerIndex, active.nodeIndex, false);
      }
      setActive(null);
    };
    window.addEventListener("pointerup", handleUp, { once: true });
    return () => {
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isPointerDown, active, emitNodeFocusChange]);

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

  return (
    <svg
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      width={imageWidth}
      height={imageHeight}
      role="img"
      aria-label={`${resolvedLayerCount}-layer dense neural network with layer sizes ${counts.join(
        ","
      )}`}
    >
      {/* Edges between layers */}
      <g>
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
                  stroke="#7b8290"
                  strokeWidth={2}
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
                fill={isFirstLayer ? "#7b8290" : "#bfdbfe"}
                stroke={"#1e40af"}
                strokeWidth={2}
                style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}
                onMouseEnter={() => {
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
                onMouseLeave={() => {
                  if (!isPointerDown) {
                    emitNodeFocusChange(i, j, false);
                    setActive(null);
                  }
                }}
                onPointerDown={() => {
                  setIsPointerDown(true);
                  setActive({ layerIndex: i, nodeIndex: j });
                  emitNodeFocusChange(i, j, true);
                }}
              />
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
                <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke="#9333ea" strokeWidth={1} />
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill="#9333ea">{textStr}</text>
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
                <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke="#9333ea" strokeWidth={1} />
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill="#9333ea">{textStr}</text>
              </g>
            );
          })
        )}
      </g>

      {/* (Removed) Extra input value labels; we only show the existing input boxes */}

      {/* Weight labels at edge midpoints (visible only when hovering receiving node) */}
      <g style={{ pointerEvents: "none" }}>
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
                <g key={`w-${i}-${a}-${b}`} transform={`translate(${midX}, ${midY})`} style={{ opacity: show ? 1 : 0, transition: "opacity 120ms ease" }}>
                  <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={3} ry={3} fill="#ffffff" stroke="#1e293b" strokeWidth={1} />
                  <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill="#0f172a">{textStr}</text>
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
          const rectWidth = activationText ? Math.max(fontSize + 4, activationText.length * charWidth + rectPadding * 2) : 0;
          const rectHeight = fontSize + rectPadding * 2;
          const actX = shaftEndX + outputArrowHead + rectWidth / 2; // flush with arrow tip
          const actY = y;
          return (
            <React.Fragment key={`out-${idx}`}>
              <g style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
                <line
                  x1={shaftStartX}
                  y1={y}
                  x2={shaftEndX}
                  y2={y}
                  stroke="#7b8290"
                  strokeWidth={2}
                />
                <polygon
                  points={`${headTipX},${y} ${shaftEndX},${headBaseYTop} ${shaftEndX},${headBaseYBottom}`}
                  fill="#7b8290"
                />
              </g>
              {activationText && (
                <g>
                  <g transform={`translate(${actX}, ${actY})`} style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
                    <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke="#9333ea" strokeWidth={1} />
                    <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill="#9333ea">{activationText}</text>
                  </g>
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
                const textStr = String(value);
                const fontSize = inputFontSize;
                const rectPadding = Math.max(2, Math.round(fontSize * 0.3));
                const charWidth = fontSize * 0.6; // rough width factor
                const rectWidth = Math.max(fontSize + 4, textStr.length * charWidth + rectPadding * 2);
                const rectHeight = fontSize + rectPadding * 2;
                const rightEdgeX = shaftStartX; // flush with arrow shaft start
                const centerX = rightEdgeX - rectWidth / 2;
                return (
                  <g transform={`translate(${centerX}, ${y})`}>
                    <rect x={-rectWidth / 2} y={-rectHeight / 2} width={rectWidth} height={rectHeight} rx={4} ry={4} fill="#ffffff" stroke="#9333ea" strokeWidth={1} />
                    <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={fontSize} fill="#9333ea">{textStr}</text>
                  </g>
                );
              })()}
              <line
                x1={shaftStartX}
                y1={y}
                x2={shaftEndX}
                y2={y}
                stroke="#7b8290"
                strokeWidth={2}
              />
              <polygon
                points={`${headTipX},${y} ${baseX},${headBaseYTop} ${baseX},${headBaseYBottom}`}
                fill="#7b8290"
              />
            </g>
          );
        });
      })()}
    </svg>
  );
}
