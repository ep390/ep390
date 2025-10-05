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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
