"use client";

import React, { useEffect, useState, type ReactElement } from "react";

type Point = {
  x: number;
  y: number;
};

type GenerateOptions = {
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
  inputData?: number[];
  inputFontSize?: number;
};

type ActiveNode = { layerIndex: number; nodeIndex: number } | null;

export function DenseNetworkSvg(options: GenerateOptions = {}): ReactElement {
  const imageWidth = options.svgWidth ?? 600;
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
    inputData,
    inputFontSize = 16,
  } = options;

  const outputArrowGap = 0;
  const outputArrowLength = 32;
  const outputArrowHead = 10;
  const inputArrowGap = 0;
  const inputArrowLength = 12;
  const inputArrowHead = 10;
  const arrowHalfHeight = 6;
  const rightPaddingForArrows =
    outputArrowGap + outputArrowLength + outputArrowHead;
  const leftPaddingForArrows =
    inputArrowGap + inputArrowLength + inputArrowHead;

  const getWeight = (fromLayer: number, fromIndex: number, toIndex: number) => {
    return weights?.[fromLayer]?.[toIndex]?.[fromIndex];
  };

  const getNodeRadius = (layerIndex: number): number =>
    layerIndex === 0 ? inputNeuronRadius : neuronRadius;

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

  useEffect(() => {
    if (!isPointerDown) return;
    const handleUp = () => {
      setIsPointerDown(false);
      setActive(null);
    };
    window.addEventListener("pointerup", handleUp, { once: true });
    return () => {
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isPointerDown]);

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
                onMouseEnter={() => setActive({ layerIndex: i, nodeIndex: j })}
                onMouseLeave={() => {
                  if (!isPointerDown) setActive(null);
                }}
                onPointerDown={() => {
                  setIsPointerDown(true);
                  setActive({ layerIndex: i, nodeIndex: j });
                }}
              />
            );
          })
        )}
      </g>

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
          // Outputs are never inputs to the active node; dim when any node is active
          const highlighted = !active; 
          return (
            <g key={`out-${idx}`} style={{ opacity: highlighted ? 1 : dimOpacity, transition: "opacity 120ms ease" }}>
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
              {typeof inputData?.[idx] === 'number' && (() => {
                const value = inputData[idx] as number;
                const textStr = String(value);
                const fontSize = inputFontSize;
                const rectPadding = Math.max(2, Math.round(fontSize * 0.3));
                const charWidth = fontSize * 0.6; // rough width factor
                const rectWidth = Math.max(fontSize + 4, textStr.length * charWidth + rectPadding * 2);
                const rectHeight = fontSize + rectPadding * 2;
                const rightEdgeX = shaftStartX - 6; // small gap from arrow
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
