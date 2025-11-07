---
title: "Assignment 6: LLM Usage Footprint"
excerpt: "Estimate the electricity, water, and carbon impacts of your LLM usage and document the results as hw6."
---

## Overview

This assignment connects to the most recent module on ethical implications and resource usage. You will:

- Pick one of your past assignments and determine how many LLM requests you made while working on it
- Use published benchmarks to estimate electricity, water, and carbon for that usage (you may assume GPT‑4o)
- Estimate the total footprint for your entire class webpage (everything under `app/students/your-name/`)
- Document your findings on a new page titled `hw6`
- Submit via new branch and Pull Request

Primary reference: [How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference (arXiv)](https://arxiv.org/abs/2505.09598). See also the course module: [/modules/ethics](/modules/ethics).

## 1 Prepare

1. Ensure the dev server runs locally (see [Getting Started](/modules/getting-started)).
1. Create a new branch for this homework, e.g., `yourname-hw6`.

## 2 Choose a past assignment and count requests

Pick one of your earlier assignments (e.g., hw2/hw3/hw4/hw5). Estimate how many LLM requests you made while building it. Options:

- ChatGPT/Gemini/Cursor history: skim the relevant session(s) and count prompts, or export history if available.
- If you used multiple tools, add their counts together. If exact counts aren’t available, make a reasonable estimate (sample a portion and extrapolate). Note any uncertainty.

Record: assignment name, tool(s) used, request count `N`, and evidence (brief note or screenshot if practical).

## 3 Estimate electricity, water, and carbon

From the paper above:

- Use Sections 5, 5.1, and 5.2 to extract per‑query metrics for the "large (10k in → 1.5k out)" prompts. Use GPT‑4o numbers if available in those sections.
- Prefer the paper’s per‑query values for all three: energy (Wh/query), water (ml/query), and carbon (gCO2e/query). If you cannot extract a value, state your assumption and source clearly.

Compute totals for your chosen homework (with `N` requests):

```
energy_Wh = N × perQueryEnergy_Wh
water_ml = N × perQueryWater_ml
carbon_gCO2e = N × perQueryCarbon_gCO2e
```

Notes:

- Prefer values from the paper for the same model/region. If you must assume, state your source and numbers explicitly, and keep units per‑query (Wh/query, ml/query, gCO2e/query).
- If you used a different model than GPT‑4o, use that model’s per‑query results from the paper if available. Document your choice.
- gCO2e means grams of CO₂ equivalent. The trailing "e" indicates non‑CO₂ greenhouse gases are converted into the amount of CO₂ that would have the same warming impact, typically using 100‑year global warming potentials.

## 4 Estimate your entire class webpage footprint

Estimate total LLM requests across all your work for this class (everything under `app/students/your-name/`). Repeat the calculations above using your estimated total request count `N_total`.

- Summarize both results: one past assignment (Section 2) and your entire class webpage (this section).

## 5 Create your `hw6` page

Create a page at `website/app/students/your-name/hw6/page.jsx` that summarizes your methodology, assumptions, and results. Include:

- The past assignment you analyzed, tools used, and request count
- The per‑query metrics you used from the paper’s large prompts (10k → 1.5k) — energy (Wh/query), water (ml/query), carbon (gCO2e/query) — and sources
- Calculations and final totals for your homework: energy (Wh), water (ml), carbon (gCO2e)
- A short paragraph reflecting on the results
- A "Limitations and Uncertainties" section: list at least 3–5 limitations of this approach (e.g., token-length sensitivity; provider/model/version differences; data center location and cooling/water variability; grid mix variability over time; omission of embodied/supply-chain impacts; hidden background/tool calls from agents; caching/batching effects). Tie each limitation to how it could bias your numbers up or down.

You may render a small results table. Here’s a minimal JSX starter you can copy into your page and then replace the placeholder values with your own:

```tsx
import styles from "@/app/[...markdown]/markdown.module.css";

export default function HW6Page() {
  // Replace these with your real values and sources.
  const N = 100; // Estimate the number of requests for the chosen past assignment

  // TODO: Update modelData with values from Sections 5/5.1/5.2 for the large prompts (10k in → 1.5k out).
  // NOTE: If the model you used is not in the paper, you may assume GPT-4o values.
  const modelData = {
    modelName: "GPT-4o", // Name of the model used for calculations. Update if needed.
    perQueryEnergyWh: 1.0,// Wh/query (replace with paper’s large 10k→1.5k value)
    perQueryWaterMl: 10.0, // ml/query (replace with paper’s large 10k→1.5k value)
    perQueryCarbonG: 1.0, // gCO2e/query (replace with paper’s large 10k→1.5k value)
  }

  const energyWh = N * modelData.perQueryEnergyWh;
  const waterMl = N * modelData.perQueryWaterMl;
  const carbonG = N * modelData.perQueryCarbonG;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-3xl font-bold mb-4">LLM Resource Usage Footprint</h1>
        <p className="mb-4">What was the environmental cost of using LLMs for this class? Below are my calculations.</p>

        <h2>Inputs</h2>
        <ul>
          <li>Number of LLM requests to {modelData.modelName}: {N}</li>
          <li>Per‑query energy: {modelData.perQueryEnergyWh} Wh/query</li>
          <li>Per‑query water: {modelData.perQueryWaterMl} ml/query</li>
          <li>Per‑query carbon: {modelData.perQueryCarbonG} gCO2e/query</li>
        </ul>

        <h2>Estimated Energy, Water, and Carbon for the Chosen Assignment</h2> {/* TODO: Replace the description to match your chosen assignment */}
        <table className="table-auto border-collapse">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Energy</td>
              <td>{energyWh.toFixed(1)} Wh</td>
            </tr>
            <tr>
              <td>Water</td>
              <td>{waterMl.toFixed(0)} ml</td>
            </tr>
            <tr>
              <td>Carbon</td>
              <td>{carbonG.toFixed(1)} gCO2e</td>
            </tr>
          </tbody>
        </table>

        <h2>Estimated Totals for All Assignments</h2>
        <p>TODO: The previous table shows the chosen assignment. Now estimate totals across all class work (your entire student webpage). Explain your methodology and assumptions.</p>

        <h2>Assumptions and Limitations</h2>
        <ul>
          <li>TODO: List at least 3–5 limitations of this approach. Tie each limitation to how it could bias your numbers up or down.</li>
          <li>TODO: This is a rough estimate is likely inaccurate. Describe any other factors that should be considered for a more comprehensive estimate.</li>
        </ul>

        <h2>Sources</h2>
        <p>
          Sources: cite the paper’s per‑query values you used for the large (10k → 1.5k) prompts — <a href="https://arxiv.org/abs/2505.09598" target="_blank">How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference (arXiv)</a> — plus any other sources for assumptions.
        </p>
      </div>
    </div>
  );
}
```

Add the second section that estimates your entire class webpage total (repeat with your `N_total`). If you can, update the calculations in the template to improve your estimates.

## 6 Submit your assignment

1. Commit your new page and any supporting assets (e.g., screenshots) to your branch.
1. Push to GitHub and open a Pull Request into `main`.
1. Do not merge your own PR.

## Grading Rubric

- **20** Page renders correctly
- **10** PR changes only files in the correct directory
- **10** Correct file/directory structure
- **10** Single dedicated branch
- **15** Methodology clearly documented; assumptions and sources cited; Request counting or estimation method is reasonable and explained
- **15** Total cumulative estimate for all your assignements
- **15** Thoughtful "Limitations and Uncertainties" section. Includes reflection, at least 3–5 confounding factors and if those factors undershoot or overshoot
- **10** No leftover template text
