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

- Use Sections 5, 5.1, and 5.2 to extract the full per‑query costs for the "medium length (1k in → 1k out)" prompts. Use GPT‑4o numbers if available in those sections.
- For quick estimation when you cannot extract directly, the module cites 0.42 Wh per short query; prefer the paper’s medium 1k/1k values when you can.

Use that per‑query energy and your count `N` to compute:

```
energy_Wh = N * 0.42
```

Then compute water and carbon using ONE of these methods:

Option A — direct per‑query values from Sections 5/5.1/5.2 (preferred):

- water_ml = N × perQueryWater_ml
- carbon_gCO2e = N × perQueryCarbon_gCO2e

Option B — intensity‑based (if the paper only gives energy and you have water/emissions intensities):

- water_ml = energy_Wh × water_intensity_ml_per_Wh
- carbon_gCO2e = energy_Wh × emissions_intensity_gCO2e_per_Wh

Notes:

- Prefer values from the paper for the same model/region. If you must assume, state your source and numbers explicitly (e.g., grid mix gCO2e/Wh and water ml/Wh). Ensure your intensity units match Wh.
- If you used a different model than GPT‑4o, either use the paper’s per‑query results for that model or normalize based on its reported energy use. Document your choice.
- gCO2e means grams of CO₂ equivalent. The trailing "e" indicates non‑CO₂ greenhouse gases are converted into the amount of CO₂ that would have the same warming impact, typically using 100‑year global warming potentials.

## 4 Estimate your entire class webpage footprint

Estimate total LLM requests across all your work for this class (everything under `app/students/your-name/`). Repeat the calculations above using your estimated total request count `N_total`.

- Summarize both results: one past assignment (Section 2) and your entire class webpage (this section).

## 5 Create your `hw6` page

Create a page at `website/app/students/your-name/hw6/page.jsx` that summarizes your methodology, assumptions, and results. Include:

- The past assignment you analyzed, tools used, and request count
- The per‑query energy factor you used (e.g., 0.42 Wh/query for GPT‑4o) and sources
- Any water/carbon intensity figures and sources
- Calculations and final numbers for: energy (Wh/kWh), water (L), and carbon (kg CO2e)
- A short paragraph reflecting on the results
- A "Limitations and Uncertainties" section: list at least 3–5 limitations of this approach (e.g., token-length sensitivity; provider/model/version differences; data center location and cooling/water variability; grid mix variability over time; omission of embodied/supply-chain impacts; hidden background/tool calls from agents; caching/batching effects). Tie each limitation to how it could bias your numbers up or down.

You may render a small results table. Here’s a minimal JSX starter you can copy into your page and then replace the placeholder values with your own:

```tsx
export default function HW6Page() {
  // Replace these with your real values and sources. You don't have to use this equation, but you can.
  const N = 120; // requests for the chosen past assignment
  const perQueryWh = 0.42; // GPT‑4o, from the paper/module
  const waterIntensityMlPerWh = 3.2; // example assumption — ml per Wh (replace and cite)
  const emissionsGPerWh = 0.35; // example assumption — gCO2e per Wh (replace and cite)

  const energyWh = N * perQueryWh; // Wh
  const waterMl = energyWh * waterIntensityMlPerWh; // ml
  const carbonG = energyWh * emissionsGPerWh; // gCO2e

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">hw6: LLM Usage Footprint</h1>
      <p className="mb-4">Methodology, assumptions, and results estimating electricity, water, and carbon for my LLM usage.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Inputs</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Requests (N): {N}</li>
        <li>Per‑query energy: {perQueryWh} Wh/query (Sections 5, 5.1, 5.2 — medium 1k→1k)</li>
        <li>Water intensity: {waterIntensityMlPerWh} ml/Wh (or per‑query water from Section 5.x)</li>
        <li>Emissions intensity: {emissionsGPerWh} gCO2e/Wh (or per‑query carbon from Section 5.x)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Results</h2>
      <table className="table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-1 text-left">Metric</th>
            <th className="border px-3 py-1 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-1">Energy</td>
            <td className="border px-3 py-1 text-right">{energyWh.toFixed(1)} Wh</td>
          </tr>
          <tr>
            <td className="border px-3 py-1">Water</td>
            <td className="border px-3 py-1 text-right">{waterMl.toFixed(0)} ml</td>
          </tr>
          <tr>
            <td className="border px-3 py-1">Carbon</td>
            <td className="border px-3 py-1 text-right">{carbonG.toFixed(1)} g CO2e</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-4 text-sm italic">
        Sources: <a href="https://arxiv.org/abs/2505.09598" target="_blank">How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference (arXiv)</a> Add any grid/water intensity data you used. Clearly state assumptions.
      </p>
    </div>
  );
}
```

Also add a second section that estimates your entire class webpage total (repeat with your `N_total`).

## 6 Submit your assignment

1. Commit your new page and any supporting assets (e.g., screenshots) to your branch.
1. Push to GitHub and open a Pull Request into `main`.
1. Do not merge your own PR.

## Grading Rubric

- **20** Page renders correctly
- **10** PR changes only files in the correct directory
- **10** Correct file/directory structure
- **10** Single dedicated branch
- **15** Methodology clearly documented; assumptions and sources cited
- **10** Request counting or estimation method is reasonable and explained
- **10** Correct calculations for the chosen past assignment
- **10** Total estimate for entire class webpage
- **10** Thoughtful "Limitations and Uncertainties" section (at least 3–5 items; Will each assumption cause you to overshoot or undershoot the total resources consumed)


