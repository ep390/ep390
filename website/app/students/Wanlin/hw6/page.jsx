import styles from "@/app/[...markdown]/markdown.module.css";

export default function HW6Page() {
  // Request counts
  const N = 3;        // HW2: 2×Cursor + 1×ChatGPT
  const N_total = 34; // All assignments combined (18×ChatGPT + 16×Cursor)

  // Model data from "How Hungry is AI?" (10k → 1.5k prompts)
  const modelData = {
    modelName: "GPT-4o",
    perQueryEnergyWh: 1.788, // Wh/query (Table 4)
    perQueryWaterMl: 2.8,    // ml/query (derived via Eq.3)
    perQueryCarbonG: 0.66,   // gCO₂e/query (derived via Eq.4 + US grid avg)
  };

  // Calculations
  const energyWh = N * modelData.perQueryEnergyWh;
  const waterMl = N * modelData.perQueryWaterMl;
  const carbonG = N * modelData.perQueryCarbonG;

  const totalEnergyWh = N_total * modelData.perQueryEnergyWh;
  const totalWaterMl = N_total * modelData.perQueryWaterMl;
  const totalCarbonG = N_total * modelData.perQueryCarbonG;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-3xl font-bold mb-4">LLM Resource Usage Footprint</h1>
        <p className="mb-4">
          This page estimates the environmental footprint of my AI usage in EP-390.
          I analyzed one past assignment (HW2) and then estimated totals across all my coursework.
        </p>

        <h2>Inputs</h2>
        <ul>
          <li>Model: {modelData.modelName}</li>
          <li>Per-query energy: {modelData.perQueryEnergyWh} Wh/query</li>
          <li>Per-query water: {modelData.perQueryWaterMl} ml/query</li>
          <li>Per-query carbon: {modelData.perQueryCarbonG} g CO₂e/query</li>
        </ul>

        <h2>HW2 Footprint</h2>
        <p>I used 3 AI requests (2 in Cursor and 1 in ChatGPT) for HW2.</p>
        <table className="table-auto border-collapse">
          <thead>
            <tr><th>Metric</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr><td>Energy</td><td>{energyWh.toFixed(2)} Wh</td></tr>
            <tr><td>Water</td><td>{waterMl.toFixed(1)} ml</td></tr>
            <tr><td>Carbon</td><td>{carbonG.toFixed(2)} g CO₂e</td></tr>
          </tbody>
        </table>

        <h2>Total for All Assignments</h2>
        <p>
          Across all class work, I estimate 34 AI requests in total 
          (18 ChatGPT + 16 Cursor).
        </p>
        <table className="table-auto border-collapse">
          <thead>
            <tr><th>Metric</th><th>Total</th></tr>
          </thead>
          <tbody>
            <tr><td>Energy</td><td>{totalEnergyWh.toFixed(1)} Wh</td></tr>
            <tr><td>Water</td><td>{totalWaterMl.toFixed(1)} ml</td></tr>
            <tr><td>Carbon</td><td>{totalCarbonG.toFixed(2)} g CO₂e</td></tr>
          </tbody>
        </table>

        <h2>Reflection</h2>
        <p>
          I rely on ChatGPT quite a lot, especially when I work in Cursor. 
          Sometimes I notice that when I ask ChatGPT to rewrite or clarify my prompts, 
          Cursor understands my instructions much better. 
          That kind of AI assistance really helps me learn and work faster.
        </p>
        <p>
          I don’t think my personal usage—just a few dozen prompts—creates much environmental cost, 
          but when I imagine millions of people doing the same thing every day, 
          the total energy use adds up quickly. 
          Still, as students and developers, we’re not even the heaviest AI users compared to large companies or online services. 
          It makes me realize that while individual impact is small, responsible and efficient AI use at scale really matters.
        </p>
        <p>
          After reading this paper, I think its main purpose is not just to show numbers, 
          but to discuss policy and industry implications. 
          The authors suggest that we need clear sustainability standards for AI inference, 
          since most environmental costs now come from the daily use of large models rather than training. 
          They call for transparency, urging companies to publish their real energy and water usage data. 
          They also encourage using more efficient hardware, renewable energy, 
          and advanced cooling systems such as dry or liquid cooling. 
          Finally, the paper points out the <em>Jevons Paradox</em> — 
          as AI models become faster and more efficient, total usage still increases, 
          which can raise overall energy consumption instead of reducing it. 
          In my view, this message is mainly directed at companies and AI providers, 
          who have the most responsibility and capability to make large-scale environmental improvements.
        </p>

        <h2>Limitations & Uncertainties</h2>
<ul className="list-disc ml-6 space-y-2">
  <li>
    <strong>1️⃣ Prompt size mismatch:</strong>  
    I used the “large prompt” value from GPT-4o (10k → 1.5k), but my real prompts were much shorter.  
    This likely <em>overestimates</em> the true energy, water, and carbon usage.
  </li>
  <li>
    <strong>2️⃣ Data center differences:</strong>  
    The paper’s measurements come from specific Microsoft Azure data centers using certain cooling and power systems.  
    If the real servers used different hardware or renewable energy, the footprint could be <em>higher or lower</em>.
  </li>
  <li>
    <strong>3️⃣ Missing indirect emissions:</strong>  
    My estimate does not include hardware manufacturing, transportation, or networking impacts.  
    That means the total carbon footprint is likely <em>underestimated</em>.
  </li>
  <li>
    <strong>4️⃣ Infrastructure variability:</strong>  
    The paper itself notes that regional differences in <em>Power Usage Effectiveness (PUE)</em> and 
    <em>Water Usage Effectiveness (WUE)</em> can strongly affect results.
  </li>
</ul>

        <h2>Sources</h2>
        <p>
          Data from Table 4 and Sections 5.1 – 5.2 of&nbsp;
          <a href="https://arxiv.org/abs/2505.09598" target="_blank">
            <em>How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference</em> (arXiv 2025)
          </a>. 
          Water and carbon derived from Eqs (3) and (4) using:
          WUE<sub>source</sub> ≈ 1.25 L/kWh (Mytton 2021, npj Clean Water), 
          WUE<sub>site</sub> ≈ 0.25 L/kWh, 
          and U.S. grid ≈ 0.367 kg CO₂/kWh (EIA/EPA 2023).
        </p>
      </div>
    </div>
  );
}
