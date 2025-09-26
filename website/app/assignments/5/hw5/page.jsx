import styles from "@/app/[...markdown]/markdown.module.css";
import { AbcPlayer, Abc, AbcMidiLink } from "@/components/abc";
import Toggle from "@/components/Toggle";

const abcScore1 = `X:1
T:TODO: Replace this with a generated score
M:4/4
L:1/4
K:Cmaj
|: CDEF | cdef | C4 | D4 :| _A2 ^B,2 |`;

const abcScore2 = `TODO: Fill this in`;
const abcScore3 = `TODO: Fill this in`;

export default function JSPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>Collaborating on a Composition with AI</h1>
        <p>
          Generative Models can be helpful for writing code. Can they also be
          part of a creative composition process? In this post I will document
          my experience using NotaGen as a compositional collaborator.
        </p>

        <h2>Generative Experiments</h2>
        <p>
          The NotaGen Model is a transformer-based model that generates scores
          in ABC notation. It accepts three parameters to condition score
          generation: Title, Period, and Composer. First I experimented with the
          model inputs to generate the scores below.
        </p>

        <TODO />: Update the element below, per your initial experiment.
        <GenerationObservations
          title="Generation Experiment 1"
          period="Fill this in"
          composer="Fill this in"
          instrumentation="Fill this in"
          abcScore={abcScore1}
          observations="Fill this in. Did the model do what you expected? Document your observations about its performance."
        />

        <h2><TODO />: Generate two (or more) additional scores. Copy/Paste your observations above to document your second and third generative experiments.</h2>

        <h2>My Original Composition</h2>

        <p>
          <TODO />: Find at least one section or part of the generated
          music that you like. Export the MIDI and use it as source
          material for an original composition. The exceprt can be as long
          or short as you want.
        </p>

        <p>
          <TODO />: Add your audio file here. <strong>Be VERY careful about how you
          add your audio file to git!</strong> You will need to put your audio
          file in the <code>/website/public/students/your-name/</code> directory
          and then update the <code>src</code> attribute of the <code>audio</code>
          element to below point to your file. Note that this is NOT in the
          <code>app/</code> directory with the rest of your code.
        </p>
        
        <audio src="/students/alice/hw5.mp3" controls />

        <p>
          <TODO />: Describe your process of creating the original composition.
          How did using the model help, hinder, or affect your process? Do you
          think these kinds of models can be helpful for creative endevors?
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
      <h4>My Observations</h4>
      <p>{observations}</p>
    </div>
  );
}

function TODO() {
  return <span className="text-red-500 font-bold">TODO</span>
}
