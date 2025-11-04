import styles from "@/app/[...markdown]/markdown.module.css";

export default function HW6Page() {
  // Replace these with your real values and sources.
  const N = 10; // Estimate the number of requests for the chosen past assignment

  // TODO: Update modelData with values from Sections 5/5.1/5.2 for the large prompts (10k in → 1.5k out).
  // NOTE: If the model you used is not in the paper, you may assume GPT-4o values.
  const modelData = {
    modelName: "GPT-4o", // Name of the model used for calculations. Update if needed.
    perQueryEnergyWh: 17.88,// Wh/query (replace with paper’s large 10k→1.5k value)
    perQueryWaterMl: 5.9, // ml/query (replace with paper’s large 10k→1.5k value)
    perQueryCarbonG: 0.6, // gCO2e/query (replace with paper’s large 10k→1.5k value)
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
        <p>
    Because the Gemini model’s data is not available on the document, I used GPT-4o’s numbers for the calculation.
    </p>
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
        <p>
         Since only the last 20 Gemini chat histories are available, I can’t determine how many requests I made in all the previous 7 assignments.
         Therefore, I estimated that each assignment involved about 10 requests.
       </p>

       <h5>
         energy_Wh = 17.88 × 7 = 125.16 Wh
       </h5>

       <h5>
         water_ml = 59 × 7 = 433 ml
       </h5>

       <h5>
         carbon_gCO2e = 6 × 7 = 42 gCO
       </h5>

        <h2>Assumptions and Limitations</h2>
        <h3>Limitations of this approach</h3>
        <ul>
          <li>Using GPT-4o data instead of Gemini data</li>
          <p>The footprint of GPT-4o may different significantly from Gemini's actual usage.</p>
          <li>Assuming a fixed number of requests</li>
          <p>The actual number of requests likely varied across assignments.</p>
          <li>Ignoring differences in request complexity</li>
          <p>Some requests use more computational resources than short, simple ones.</p>
          <li>Not accounting for infrastructure and model version changes</li>
          <p>Different servers, data centers, or model updates can change efficiency and resource use over time.</p>
        </ul>

        <h2>Sources</h2>
        <p>
          Sources: cite the paper’s per‑query values you used for the large (10k → 1.5k) prompts — <a href="https://arxiv.org/abs/2505.09598" target="_blank">How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference (arXiv)</a> — plus any other sources for assumptions.
        </p>
      </div>
    </div>
  );
}