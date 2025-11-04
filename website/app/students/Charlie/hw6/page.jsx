import styles from "@/app/[...markdown]/markdown.module.css";

export default function HW6Page() {
  // Chosen Assignment: Homework 3 (Agentic Chord Instrument)
  // This was a complex React component with MIDI functionality, chord generation, voicings, and arpeggiator features.
  // I primarily used Cursor (GPT-4o) for this assignment.
  
  // Estimate: Based on reviewing my development process, I made approximately 180 LLM requests for hw3.
  // This includes: initial setup questions, debugging React hooks, MIDI API implementation, 
  // chord voicing logic, arpeggiator implementation, UI refinement, and code documentation.
  const N = 180; // Number of requests for hw3

  // Per-query metrics from the paper "How Hungry is AI?" (arXiv:2505.09598)
  // Sections 5, 5.1, and 5.2 for large prompts (10k input tokens → 1.5k output tokens)
  // Model: GPT-4o
  // Note: These values are for the large prompt category. My actual prompts varied in length,
  // but I'm using the large prompt metrics as a reasonable approximation.
  const modelData = {
    modelName: "GPT-4o",
    perQueryEnergyWh: 0.43, // Wh/query (from paper Section 5.1 for large prompts)
    perQueryWaterMl: 0.26,   // ml/query (from paper Section 5.2 for large prompts)
    perQueryCarbonG: 4.3,    // gCO2e/query (from paper Section 5 for large prompts)
  };

  // Calculations for chosen assignment (hw3)
  const energyWh = N * modelData.perQueryEnergyWh;
  const waterMl = N * modelData.perQueryWaterMl;
  const carbonG = N * modelData.perQueryCarbonG;

  // Total estimates for all class work
  // Assignments completed: hw1, hw2, hw3, hw4, hw5, Classwork3, midterm-proposal, midterm
  // Methodology: I estimated requests per assignment based on complexity:
  // - hw1: ~50 requests (initial setup, basic React)
  // - hw2: ~80 requests (more complex React components)
  // - hw3: 180 requests (complex MIDI instrument - detailed above)
  // - hw4: ~120 requests (intermediate complexity)
  // - hw5: ~150 requests (music composition with AI integration)
  // - Classwork3: ~40 requests
  // - midterm-proposal: ~60 requests
  // - midterm: ~250 requests (complex ML model integration, Flask API, deployment)
  // Total: ~930 requests
  const N_total = 930;
  const totalEnergyWh = N_total * modelData.perQueryEnergyWh;
  const totalWaterMl = N_total * modelData.perQueryWaterMl;
  const totalCarbonG = N_total * modelData.perQueryCarbonG;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-3xl font-bold mb-4">LLM Resource Usage Footprint</h1>
        <p className="mb-4">
          What was the environmental cost of using LLMs for this class? Below are my calculations.
        </p>

        <h2>Methodology</h2>
        <p>
          I chose <strong>Homework 3: Agentic Chord Instrument</strong> as my analyzed assignment. 
          This was a substantial React-based MIDI instrument with complex features including chord generation, 
          voicing algorithms, arpeggiator, and real-time MIDI output. I primarily used <strong>Cursor (GPT-4o)</strong> 
          throughout the development process.
        </p>
        <p>
          To estimate request counts, I reviewed my development workflow:
        </p>
        <ul>
          <li>Initial project setup and understanding requirements: ~20 requests</li>
          <li>React hooks and state management debugging: ~40 requests</li>
          <li>MIDI API implementation and troubleshooting: ~35 requests</li>
          <li>Chord voicing and arpeggiator logic: ~45 requests</li>
          <li>UI refinement and styling: ~25 requests</li>
          <li>Code documentation and refactoring: ~15 requests</li>
        </ul>
        <p>
          <strong>Total estimated requests for hw3: {N}</strong>
        </p>

        <h2>Inputs</h2>
        <ul>
          <li>Number of LLM requests to {modelData.modelName}: {N} (hw3)</li>
          <li>Per‑query energy: {modelData.perQueryEnergyWh} Wh/query</li>
          <li>Per‑query water: {modelData.perQueryWaterMl} ml/query</li>
          <li>Per‑query carbon: {modelData.perQueryCarbonG} gCO₂e/query</li>
        </ul>
        <p className="text-sm text-gray-600">
          <em>Source: Sections 5, 5.1, and 5.2 of "How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference" 
          (arXiv:2505.09598) for large prompts (10k input tokens → 1.5k output tokens).</em>
        </p>

        <h2>Estimated Energy, Water, and Carbon for Homework 3</h2>
        <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Energy</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{energyWh.toFixed(2)} Wh</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Water</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{waterMl.toFixed(2)} ml</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Carbon</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{carbonG.toFixed(2)} gCO₂e</td>
            </tr>
          </tbody>
        </table>

        <h2>Estimated Totals for All Assignments</h2>
        <p>
          I estimated the total LLM requests across all my class work by analyzing each assignment's complexity:
        </p>
        <ul>
          <li>hw1: ~50 requests (basic React setup)</li>
          <li>hw2: ~80 requests (React components)</li>
          <li>hw3: 180 requests (detailed above)</li>
          <li>hw4: ~120 requests (intermediate complexity)</li>
          <li>hw5: ~150 requests (AI music composition)</li>
          <li>Classwork3: ~40 requests</li>
          <li>midterm-proposal: ~60 requests</li>
          <li>midterm: ~250 requests (ML model, Flask API, deployment)</li>
        </ul>
        <p>
          <strong>Total estimated requests: {N_total}</strong>
        </p>

        <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Energy</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{totalEnergyWh.toFixed(2)} Wh ({totalEnergyWh.toFixed(2)} Wh = {(totalEnergyWh / 1000).toFixed(3)} kWh)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Water</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{totalWaterMl.toFixed(2)} ml ({(totalWaterMl / 1000).toFixed(3)} L)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Carbon</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{totalCarbonG.toFixed(2)} gCO₂e ({(totalCarbonG / 1000).toFixed(3)} kgCO₂e)</td>
            </tr>
          </tbody>
        </table>

        <h2>Reflection</h2>
        <p>
          The environmental footprint of my LLM usage for this class is relatively modest when viewed in isolation—
          approximately {totalEnergyWh.toFixed(2)} Wh of energy, {totalWaterMl.toFixed(2)} ml of water, 
          and {totalCarbonG.toFixed(2)} gCO₂e of carbon emissions. However, these numbers represent only my individual 
          usage for one class. When scaled across millions of students, developers, and users worldwide, the cumulative 
          impact becomes significant.
        </p>
        <p>
          This exercise has made me more aware of the hidden costs of AI assistance. While LLMs are incredibly helpful 
          for learning and productivity, their environmental impact is real and should be considered alongside their 
          benefits. The fact that a single assignment (hw3) consumed approximately {energyWh.toFixed(2)} Wh of energy 
          and {carbonG.toFixed(2)} gCO₂e puts into perspective the resource intensity of these models.
        </p>
        <p>
          Moving forward, I'll be more mindful of when I truly need LLM assistance versus when I can solve problems 
          independently or through documentation. The trade-off between convenience and environmental responsibility 
          is worth considering carefully.
        </p>

        <h2>Limitations and Uncertainties</h2>
        <p>
          This analysis has several significant limitations that could bias the results either upward or downward:
        </p>
        <ul>
          <li>
            <strong>Token-length sensitivity:</strong> The paper's metrics are for "large" prompts (10k input → 1.5k output tokens). 
            Many of my actual requests were shorter (perhaps 1-3k input tokens), which would consume less energy, water, and carbon. 
            <em>This likely causes an <strong>overestimate</strong> of my actual footprint.</em>
          </li>
          <li>
            <strong>Provider/model/version differences:</strong> I used Cursor, which may use different GPT-4o configurations or 
            versions than those measured in the paper. Different inference optimizations, quantization, or batching strategies 
            could significantly alter per-query costs. <em>This introduces uncertainty that could bias results either direction.</em>
          </li>
          <li>
            <strong>Data center location and cooling/water variability:</strong> The paper's measurements likely reflect specific 
            data center locations with particular cooling systems and water sources. My actual requests may have been processed 
            in different regions with different grid mixes (cleaner or dirtier), different cooling systems (air-cooled vs. 
            water-cooled), and varying water efficiency. Regions with renewable energy would reduce carbon, while water-scarce 
            regions might use more efficient cooling. <em>This could cause either <strong>overestimate</strong> or <strong>underestimate</strong>.</em>
          </li>
          <li>
            <strong>Grid mix variability over time:</strong> The carbon intensity of electricity varies by time of day, season, 
            and year as renewable energy sources fluctuate. My requests were made over several months, during which the grid 
            mix may have changed. <em>This introduces temporal uncertainty that could bias carbon estimates either direction.</em>
          </li>
          <li>
            <strong>Omission of embodied/supply-chain impacts:</strong> This analysis only considers inference costs, not the 
            enormous energy and resources required to train GPT-4o, manufacture the hardware, build data centers, or maintain 
            the infrastructure. These "embodied" costs are amortized across all users but are not included here. 
            <em>This causes a significant <strong>underestimate</strong> of the true lifecycle impact.</em>
          </li>
          <li>
            <strong>Hidden background/tool calls from agents:</strong> Cursor and other AI coding assistants may make additional 
            tool calls, function calls, or background requests that aren't visible to me. For example, code analysis, file reading, 
            or multi-step reasoning might involve multiple API calls per visible interaction. <em>This likely causes an <strong>underestimate</strong> of actual requests.</em>
          </li>
          <li>
            <strong>Caching/batching effects:</strong> Providers may cache responses or batch multiple requests together, which 
            could reduce per-request costs. However, I have no visibility into these optimizations. <em>This could cause either direction bias, but likely leads to a slight <strong>overestimate</strong> if caching is significant.</em>
          </li>
          <li>
            <strong>Request counting methodology:</strong> My estimates are based on memory and rough counts of visible interactions. 
            I may have forgotten some requests or miscounted complex multi-turn conversations. Without access to actual API logs, 
            these estimates have inherent uncertainty. <em>This introduces uncertainty that could bias results either direction.</em>
          </li>
        </ul>
        <p>
          <strong>Overall assessment:</strong> The combination of these limitations suggests that while my footprint estimates 
          may be reasonably accurate for inference costs alone, they likely <strong>underestimate</strong> the true environmental 
          impact when considering embodied costs and hidden requests. Conversely, they may <strong>overestimate</strong> per-request 
          costs due to using large-prompt metrics for potentially smaller requests.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            <a href="https://arxiv.org/abs/2505.09598" target="_blank" rel="noopener noreferrer">
              How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference
            </a> (arXiv:2505.09598). Per-query metrics extracted from Sections 5, 5.1, and 5.2 for large prompts 
            (10k input tokens → 1.5k output tokens) using GPT-4o.
          </li>
          <li>
            Course module: <a href="/modules/ethics" target="_blank" rel="noopener noreferrer">Ethical Impacts of Generative AI</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

