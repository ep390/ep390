"use client";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export function Matrix({ A, x, b, result }: { A: number[][], x?: number[][], b?: number[][], result?: number[][] }) {
  let aText = `\\begin{bmatrix}
                ${A
                  .map((row) => row.map((cell) => cell).join(" & "))
                  .join(" \\\\ ")}
            \\end{bmatrix}`

  if (x) {
    aText += ` \\times \\begin{bmatrix}
                ${x.map((row) => row.map((cell) => cell).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`
  }

  if (b) {
    aText += ` + \\begin{bmatrix}
                ${b.map((row) => row.map((cell) => cell).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`
  }

  if (result) {
    aText += ` = \\begin{bmatrix}
                ${result.map((row) => row.map((cell) => cell).join(" & ")).join(" \\\\ ")}
            \\end{bmatrix}`
  }
  
  return (
    <BlockMath>
      {aText}
    </BlockMath>
  );
}
