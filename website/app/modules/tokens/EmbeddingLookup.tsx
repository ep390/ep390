"use client";

import { BlockMath } from "react-katex";

interface EmbeddingLookupProps {
  vocabulary: string;
}

function formatNumberForAlignment(num: number | string): string {
  if (typeof num === 'string') return num;
  
  const str = num.toFixed(1);
  const isNegative = str.startsWith('-');
  
  // Use LaTeX \phantom{-} to add invisible negative sign for positive numbers
  // This aligns decimal points by making positive numbers take same width as negative
  if (!isNegative) {
    return `\\phantom{-}${str}`;
  }
  return str;
}

function columnVectorLatex(x: (number | string)[], arrayStretch: number = 1) {
  if (x.length === 0) {
    return `{\\def\\arraystretch{${arrayStretch}}\\begin{bmatrix}\\end{bmatrix}}`;
  }
  // Show all values, but add vertical ellipsis before the last value
  const rows: string[] = [];
  for (let i = 0; i < x.length - 1; i++) {
    rows.push(formatNumberForAlignment(x[i]));
  }
  // Add ellipsis before the last value to indicate there could be more dimensions
  rows.push("\\vdots");
  rows.push(formatNumberForAlignment(x[x.length - 1]));
  
  return `{\\def\\arraystretch{${arrayStretch}}\\begin{bmatrix}
${rows.join(" \\\\ ")}
\\end{bmatrix}}`;
}

// Simple seeded random number generator using Linear Congruential Generator (LCG)
function createSeededRNG(seed: number) {
  let state = seed;
  return () => {
    // LCG parameters (same as used in many implementations)
    state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
    // Convert to range [-1, 1]
    return (state / Math.pow(2, 31)) - 1;
  };
}

export default function EmbeddingLookup({ vocabulary }: EmbeddingLookupProps) {
  // Create simple embedding vectors (small dimension for clarity)
  const embeddingDim = 8;
  
  // Indices to show: 0 (space), 1 (a), 2 (b), 3 (c), and 67 (9)
  const indicesToShow = [0, 1, 2, 3, 67];
  const charsToShow = indicesToShow.map(idx => vocabulary[idx]);
  
  // Generate embeddings for the indices we want to show
  // Using seeded RNG for deterministic but random-looking values
  const embeddings: number[][] = [];
  const seed = 5; // Constant seed for reproducibility
  
  indicesToShow.forEach((idx) => {
    // Create a unique RNG for each embedding based on token index
    const rng = createSeededRNG(seed + idx);
    const embedding = Array.from({ length: embeddingDim }, () => {
      // Generate values in range [-2, 2] for visibility
      const value = rng() * 2;
      return parseFloat(value.toFixed(1));
    });
    embeddings.push(embedding);
  });

  return (
    <div className="my-6 space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-lg overflow-x-auto">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {/* First 4 column vectors (0, 1, 2, 3) */}
            {indicesToShow.slice(0, 4).map((idx, pos) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-lg font-medium mb-1">
                  {charsToShow[pos] === ' ' ? '(space)' : charsToShow[pos]}
                </div>
                <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>↓</div>
                <div className="text-base text-gray-600 mb-1 font-medium">{idx}</div>
                <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>↓</div>
                <BlockMath>
                  {columnVectorLatex(embeddings[pos])}
                </BlockMath>
              </div>
            ))}
            {/* Ellipsis */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium mb-1">&nbsp;</div>
              <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>&nbsp;</div>
              <div className="text-base text-gray-600 mb-1 font-medium">&nbsp;</div>
              <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>&nbsp;</div>
              <div className="text-2xl">⋯</div>
            </div>
            {/* Last column vector (67) */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-medium mb-1">{charsToShow[4]}</div>
              <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>↓</div>
              <div className="text-base text-gray-600 mb-1 font-medium">{indicesToShow[4]}</div>
              <div className="text-gray-600 mb-1" style={{ fontSize: '16px' }}>↓</div>
              <BlockMath>
                {columnVectorLatex(embeddings[4])}
              </BlockMath>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

