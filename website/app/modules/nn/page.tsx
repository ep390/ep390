import type { ReactElement } from "react";
import { DenseNetworkSvg } from "./svg";
import styles from "@/app/[...markdown]/markdown.module.css";

export default function Page(): ReactElement {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            Neural Network
          </h1>

          <div className="flex justify-center">
            <DenseNetworkSvg
              neuronCounts={[4, 5, 2]}
              weights={weights}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const weights = [
    // W1: shape (5, 4) - Matrices are specified  as (height, width)
    [
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
      [17, 18, 19, 20]
    ],
    // W2: shape (2, 5)
    [
      [21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30]
    ]
  ];
  