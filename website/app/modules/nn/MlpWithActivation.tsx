"use client";

import { useState } from "react";
import MlpEditable, { MlpEditableOptions } from "./MlpEditable";
import { ex5 } from "./examples";

export default function MlpWithActivation() {
  const options: MlpEditableOptions["activation"][] = ["relu", "sigmoid"];
  const [activation, setActivation] =
    useState<MlpEditableOptions["activation"]>("relu");

  return (
    <div className="mt-2">
      <div className="mb-4 flex items-center gap-3 justify-end">
        <span className="text-sm font-medium text-slate-700">Activation:</span>
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          {options.map((opt) => {
            const isActive = activation === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setActivation(opt)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  isActive
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={isActive}
              >
                {opt === "relu" ? "ReLU" : "Sigmoid"}
              </button>
            );
          })}
        </div>
      </div>
      <MlpEditable
        {...ex5}
        showEquation
        inputNumberType="int"
        activation={activation}
      />
    </div>
  );
}
