import styles from "@/app/[...markdown]/markdown.module.css";
import { AbcPlayer, Abc, AbcMidiLink } from "@/components/abc";
import Toggle from "@/components/Toggle";

export default function JSPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>EP390 Final Project</h1>
        <p>
            In my midterm project, I experimented with an AI-based music tool
            to create a fully AI-generated track. The outcome leaned more toward experimental music
            rather than something suited for a major label release. For this project, 
            I plan to focus on using AI to help create a more traditional track that 
            I could release on streaming platforms. Instead of generating a piece from scratch, 
            I’ve decided to take a track I previously composed and refine it using AI tools.
        </p>

        <h2>Tools</h2>
        <p>
          I featured four AI tools in this project:
        </p>

         <h3>
          1.{" "}
          <a href="https://moises.ai/features/ai-studio-music-creation/?utm_source=google&utm_medium=cpc&utm_term=ai%20mixing&gad_source=1&gad_campaignid=22918358846&gbraid=0AAAAAo-sY66R_a7C1TE8Vs95XoaVENXAF&gclid=Cj0KCQiAi9rJBhCYARIsALyPDtvbnlolPFaYhVEoQSsIo3EjDZwtITRXhwnS38VAHF8oJLEAbrTGcT0aArNuEALw_wcB" target="_blank" rel="noopener noreferrer">
            Moises
          </a>
        </h3>
         <p>
          Moises is an AI-powered music platform that provides users with powerful tools for stem separation, AI-generated stems, and mixing and mastering.
        </p>
        
        <h2>Step 1: Import a track into Moises AI Studio and develop new ideas by generating additional stems.</h2>

        <h3>Original Track:</h3>

        <audio src="/students/fumiya/First Demo.mp3" controls />

        <img src="/students/fumiya/final-project1.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <h3>AI Stem Generation</h3>

        <h4>1. AI Match Drums</h4>
 
        <img src="/students/fumiya/final-project2.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - AI Match Drums - 1.mp3" controls />

        <h4>2. AI Match Bass</h4>

        <img src="/students/fumiya/final-project3.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - AI Match Bass - 1.mp3" controls />

        <h4>3. Custom Basss</h4>

         <p>A modern UK house bass with a clean, bouncy groove and tight, punchy low-end movement.</p>

        <img src="/students/fumiya/final-project4.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - Custom Bass - 1.mp3" controls />

        <h4>4. Custom Bass 2</h4>

        <p>A modern UK house bass with a clean, bouncy groove and tight, punchy low-end movement and melodic line.</p>

        <img src="/students/fumiya/final-project5.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - Custom Bass - 2.mp3" controls />

        <h4>5. AI Match Guitar</h4>
 
        <img src="/students/fumiya/final-project6.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - AI Match Guitar - 1.mp3" controls />

        <h4>6. Electric Piano</h4>

        <img src="/students/fumiya/final-project7.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - Electric Piano Generic - 1.mp3" controls />

        <h4>7. Strings</h4>

        <img src="/students/fumiya/final-project8.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - Strings Generic - 2.mp3" controls />

        <h4>8. Violin</h4>

        <img src="/students/fumiya/final-project9.png" alt="Moies AI Studio screenshot" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/EP390 Final - Violin Generic - 1.mp3" controls />

        <h3>Final Mix</h3>

        <audio src="/students/fumiya/EP390 Final - Mix.mp3" controls />

        <h2>Step 2: Create a track using the audio stems generated in step 1</h2>

        <h3>My Original Composition</h3>

           <audio src="/students/fumiya/EP390 Final.mp3" controls />

        <h2>My Observation</h2>

        <p>
          I found it very interesting to explore a different approach to composition by using AI-generated audio.
          It definitely helped me develop new ideas for my previous composition, and it allowed me to reach new creative directions.
          However, I discovered not only advantages but also some limitations when working with AI-generated material.
        </p>

        <h3>Pros</h3>

        <h4>1. Fresh ideas</h4>

        <p>
          AI can offer new musical ideas that I wouldn’t have come up with on my own. 
          For example, I had never imagined adding string sounds to my track, but the AI-generated audio introduced strings that matched well and 
          brought the track into a new cinematic dimension.
        </p>

        <h4>2.	Unique “weirdness”</h4>

         <p>
          AI often introduces unusual characteristics in the audio, which can be an advantage for unique sound design.
          In my case, the AI-generated bass had a high-frequency synth layer that I found very cool, and I ended up using it in my track.
        </p>

        <h3>Cons</h3>

        <h4>1. Common AI "Signature"</h4>

        <p>
          I noticed that many AI-generated stems share similar audio characteristics. 
          This makes it harder to differentiate my work from someone else’s if we use the same tools, reducing the sense of originality.
        </p>

        <h4>2. Workflow interruptions</h4>

        <p>
          Waiting for the AI to generate audio slowed down my workflow. 
          Even when I had immediate ideas for my composition, I had to pause and wait for the generation process, which disrupted the creative flow.
        </p>

        <h3>Reflection</h3>

        <p>
          Overall, I enjoyed experimenting with AI tools for composition and I can clearly see their potential. 
          I believe that as they continue to develop, they will become stronger and more common tools for music producers. 
          However, at this stage, I don’t think I would use them in my current projects. I like the concept of integrating AI into the creative process, 
          but for daily composition I don’t yet find it necessary or consistently useful.
        </p>

      </div>
    </div>
  );
}

function GenerationObservations({
  title,
  period,
  composer,
  instrumentation,
  abcScore,
  observations,
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div>Model Prompt:</div>
      <ul>
        <li>Period: {period}</li>
        <li>Composer: {composer}</li>
        <li>Instrumentation: {instrumentation}</li>
      </ul>
      <AbcPlayer abc={abcScore} hideScore={true} />
      <AbcMidiLink abc={abcScore} />
      <Toggle title="View Score">
        <Abc abc={abcScore} />
      </Toggle>
    </div>
  );
}

function TODO() {
  return <span className="text-red-500 font-bold">TODO</span>
}
