import styles from "@/app/[...markdown]/markdown.module.css";
import { AbcPlayer, Abc, AbcMidiLink } from "@/components/abc";
import Toggle from "@/components/Toggle";

//import abcScore1 from './score1'
const abcScore1 = `X:1
%%score { ( 1 3 ) | 2 }
L:1/8
Q:1/4=130
M:3/4
K:F
V:1 treble nm="Harpsichord" snm="Hch."
V:3 treble 
V:2 bass 
[V:1]"^Allegro" A/G/A fd A^c|[V:2]D,, D,2 F,/E,/ G,/F,/E,/F,/|[V:3]x6|
[V:1]d/A/G/A/ B/A/G/A/ f/B/A/B/|[V:2]D,F, B,,D, G,,B,,|[V:3]x6|
[V:1]G/F/G ec GB|[V:2]C,, C,2 E,/D,/ F,/E,/D,/E,/|[V:3]x6|
[V:1]c/G/F/G/ A/G/F/G/ e/A/G/A/|[V:2]C,E, A,,C, F,,A,,|[V:3]x6|
[V:1]F/_E/F dB GB|[V:2]D,,D,/^C,/ E,/D,/C,/D,/ F,/E,/D,/E,/|[V:3]x6|
[V:1]E/G/A/B/ Ad Fd-|[V:2]^C,/=B,,/A,,/B,,/ C,/B,,/D,/C,/ E,/D,/C,/D,/|[V:3]x6|
[V:1]d/f/e/d/ c/=B/A/d/ c/B/A/^G/|[V:2]^G,,E,, A,,D,, E,,E,,|[V:3]x6|
[V:1]A=B/c/ d/c/B/c/ A2|[V:2]A,,,2 z2 z/ A,,/=B,,/^C,/|[V:3]x6|
[V:1]A/G/A fd A^c|[V:2]D,, D,2 F,/E,/ G,/F,/E,/F,/|[V:3]x6|
[V:1]d/A/G/A/ B/A/G/A/ f/B/A/B/|[V:2]D,F, B,,D, G,,B,,|[V:3]x6|
[V:1]G/F/G ec GB|[V:2]C,, C,2 E,/D,/ F,/E,/D,/E,/|[V:3]x6|
[V:1]c/G/F/G/ A/G/F/G/ e/A/G/A/|[V:2]C,E, A,,C, F,,A,,|[V:3]x6|
[V:1]F/_E/F dB GB|[V:2]D,,D,/^C,/ E,/D,/C,/D,/ F,/E,/D,/E,/|[V:3]x6|
[V:1]E/G/A/B/ Ad Fd-|[V:2]^C,/=B,,/A,,/B,,/ C,/B,,/D,/C,/ E,/D,/C,/D,/|[V:3]x6|
[V:1]d/f/e/d/ c/=B/A/d/ c/B/A/^G/|[V:2]^G,,E,, A,,D,, E,,E,,|[V:3]x6|
[V:1]A=B/c/ d/c/B/c/ A2|:[V:2]A,,,2 E,,2 A,,2|:[V:3]x6|:
[V:1]c/B/c af c_e|[V:2]F,, F,2 A,/G,/ B,/A,/G,/A,/|[V:3]x6|
[V:1]^f/c/B/c/ d/c/B/A/ c/B/A/G/|[V:2]D,^F, A,F, G,G,,|[V:3]x6|
[V:1]B/A/B ge Bd|[V:2]C,, C,2 E,/D,/ F,/E,/D,/E,/|[V:3]x6|
[V:1]e/B/A/B/ c/B/A/G/ B/A/G/F/|[V:2]C,E, G,E, F,F,,|[V:3]x6|
[V:1]B/A/B/e/ g/f/e/f/ b/e/d/e/|[V:2]G,,B,/A,/ G,B, E,G,|[V:3]x6|
[V:1]A/G/A/c/ g/f/e/f/ a/f/e/f/|[V:2]F,,A,/G,/ F,A, D,F,|[V:3]x6|
[V:1]b/a/g/a/ g/f/e/f/ e/d/^c/d/|[V:2]G,,B,/A,/ G,A, G,B,|[V:3]x6|
[V:1]^c/=B/A/B/ c/B/A/B/ d/c/B/c/|[V:2]A,A,, G,,G, F,E,|[V:3]x6|
[V:1]dA ^FD D/_E/=F/D/|[V:2]D,/^F,/E,/F,/ G,/F,/E,/F,/ A,C,|[V:3]x6|
[V:1]GD =B,D G,/F/_E/D/|[V:2]=B,,/D,/C,/D,/ _E,/D,/C,/D,/ F,B,,|[V:3]x6|
[V:1]_E/C/=B,/C/ A,/C/B,/C/ ^F/C/B,/C/|[V:2]C,_E, ^F,,E, D,,D,|[V:3]x6|
[V:1]G/D/C/D/ =B,/D/C/D/ G/D/C/D/|[V:2]G,,,G,, =B,,D, F,F,,|[V:3]x6|
[V:1]_A/G/F/_E/ D/C/=B,/C/ D/E/F/D/|[V:2]F,,F, G,_A, =B,,G,|[V:3]x6|
[V:1]_E/F/G/E/ C/D/E/C/ A,/B,/C/A,/|[V:2]C,C,, z _E,/D,/ C,/B,,/A,,/C,/|[V:3]x6|
[V:1]B,G A,F G,E|[V:2]E,,/F,,/G,,/E,,/ C,,/D,,/E,,/F,,/ G,,/A,,/B,,/G,,/|[V:3]x6|
[V:1]F,B,/A,/ G,/F,/E,/F,/ F2|[V:2]A,,B,, C,C,, F,,,2|[V:3]x6|
[V:1]A/G/A fd A=B|[V:2]F,/4E,/4F,3/2- F,A, G,F,|[V:3]x6|
[V:1]c/G/F/G/ A/G/F/G/ e/A/G/A/|[V:2]E,G, CB, A,C|[V:3]x6|
[V:1]Fd c=B ^GA|[V:2]D,/A,/B,/A,/ C/A,/B,/A,/ D/A,/B,/A,/|[V:3]x6|
[V:1]D/^G/^F/G/ A/G/F/G/ c/A/G/A/|[V:2]=B,E, D,E, A,,E,|[V:3]x6|
[V:1]d/E/D/E/ ^F/E/D/E/ =B/=F/E/F/|[V:2]^F,,=B,, A,,B,, ^G,,B,,|[V:3]x6|
[V:1]c/E/D/E/ F/E/D/E/ e/E/D/E/|[V:2]A,,,A,, =B,,,=B,, C,,C,|[V:3]x6|
[V:1]f/e/d/c/ =B/A/^G/A/ B/c/d/B/|[V:2]D,,D, E,F, D,=B,,|[V:3]x6|
[V:1]^GE ed c=B|[V:2]E,/E,,/^F,,/^G,,/ A,,/G,,/F,,/E,,/ F,,/G,,/A,,/G,,/|[V:3]x6|
[V:1]A/G/A fd A^c|[V:2]F,,/E,,/F,,/G,,/ A,,/G,,/F,,/G,,/ A,,2|[V:3]x6|
[V:1]d/A/G/A/ B/A/G/A/ c/B/A/B/|[V:2]B,,D, G,,B,, E,,G,,|[V:3]x6|
[V:1]G/F/G ec GB|[V:2]C,,C,/D,/ E,/D,/C,/D,/ E,2|[V:3]x6|
[V:1]c/G/F/G/ A/G/F/G/ d/A/G/A/|[V:2]A,,C, F,,A,, D,,F,,|[V:3]x6|
[V:1]F/_E/F BG EG|[V:2]B,,,B,,/A,,/ C,/B,,/A,,/B,,/ D,/^C,/=B,,/C,/|[V:3]x6|
[V:1]^C/E/F/G/ F/A/d/A/ f/d/e/d/|[V:2]A,,G,, F,,E,, D,,F,,|[V:3]x6|
[V:1]^c/d/e/c/ A/c/d/e/ f/e/d/c/|[V:2]G,,B,, A,,G,, A,,A,,,|[V:3]x6|
[V:1]de/f/ e/d/^c/e/ d2:|[V:2]D,,2 A,,2 D,2:|[V:3]z2 G2 F2:|`;

export default function JSPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1>EP390 Midterm Project</h1>
        <p>
          AI has become one of the most discussed topics in the music field.
          Many people wonder whether AI poses a threat to musicians or could even replace their jobs.
          There are various opinions on this issue, but one thing is certain: AI has already had a huge impact on music and will continue to do so in the future.
          I also believe that the new creative opportunities offered by AI have not yet received enough attention. In this project, I will experiment with music composition using AI and machine learning tools, and document my observations.
        </p>

        <h2>Tools</h2>
        <p>
          I featured four AI tools in this project:
        </p>

         <h3>
          1.{" "}
          <a href="https://huggingface.co/spaces/ElectricAlexis/NotaGen" target="_blank" rel="noopener noreferrer">
            NotaGen
          </a>
        </h3>
         <p>
          The NotaGen model is a transformer-based system that creates musical scores in ABC notation.
          It generates compositions based on three input parameters: the title, the musical period, and the composer.
        </p>

        <h3>
          2.{" "}
          <a href="https://neutone.ai/morpho" target="_blank" rel="noopener noreferrer">
            Neutone Morph
          </a>
        </h3>
         <p>
          Neutone Morpho is a realtime tone morphing plugin powered by advanced machine learning technology.
          Input sounds are resynthesized into a totally different style whilst keeping the overall shape of the sound intact.
        </p>

        <h3>
          3.{" "}
          <a href="https://neutone.ai/fx" target="_blank" rel="noopener noreferrer">
            Neutone FX
          </a>
        </h3>
         <p>
          Neutone FX is an AI-powered audio plugin designed to bring real-time machine learning models into DAWs.
          Users can load and experiment with a variety of AI models created by Neutone or the community.
        </p>

        <h3>
          4.{" "}
          <a href="https://soniccharge.com/synplant" target="_blank" rel="noopener noreferrer">
            Synplant 2
          </a>
        </h3>
         <p>
          Synplant 2 is a software synthesizer plug-in by Sonic Charge.
          Its standout feature, Genopatch, uses machine learning to analyze short audio samples and automatically create synth patches inspired by them.
        </p>
        
        <h2>Step 1: Generate Composition by NotaGen</h2>

        <GenerationObservations
          title="NotaGen Generation Score"
          period="Baroque"
          composer="Bach, Johann Sebastian"
          instrumentation="Keyboard"
          abcScore={abcScore1}
        />

        <h2>Step 2: Generate audio stems using Neutone’s plugins and Synplant 2</h2>

        <p>
          Here is a screenshot of my Digital Audio Workstation (DAW) where I used the AI plugins to process the MIDI from NotaGen and generate new audio material.
        </p>

        <h3>1. Neutone Morpho</h3>

        <h4>1. Modern Drum Machine</h4>

        <img src="/students/fumiya/midterm-project1.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Modern Drum Machine.wav" controls />

        <h4>2. Miss Speaker</h4>

        <img src="/students/fumiya/midterm-project2.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Miss Speaker.wav" controls />

        <h4>3. Festive Latin Percussions</h4>

        <img src="/students/fumiya/midterm-project3.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Festive Latin Percussions.wav" controls />

        <h4>4. Classy Bach Violin</h4>

        <img src="/students/fumiya/midterm-project4.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Classy Bach Violin.wav" controls />

        <h4>5. Oriental Mouth Organ</h4>

        <img src="/students/fumiya/midterm-project5.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Oriental Mouth Organ.wav" controls />

        <h4>6. Oriental Pipa String</h4>

        <img src="/students/fumiya/midterm-project6.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Oriental Pipa String.wav" controls />

        <h4>7. Unintelligible 911 Calls</h4>

        <img src="/students/fumiya/midterm-project7.png" alt="DAW screenshot showing Neutone Morpho's setting" className="rounded-lg shadow-lg w-220 mx-auto" />

        <audio src="/students/fumiya/Unintelligible 911 Calls.wav" controls />

        <h3>1. Neutone FX</h3>

        <h4>1. Rave.evoice</h4>

        <img src="/students/fumiya/midterm-project8.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.evoice.wav" controls />

        <h4>2. Rave.kara</h4>

        <img src="/students/fumiya/midterm-project9.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.kara.wav" controls />

        <h4>3. Rave.MaxSalterio</h4>

        <img src="/students/fumiya/midterm-project10.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.MaxSalterio.wav" controls />

        <h4>4. Rave.llLSopranoSax</h4>

        <img src="/students/fumiya/midterm-project11.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.llLSopranoSax.wav" controls />

        <h4>5. Rave.llLOrganBach</h4>

        <img src="/students/fumiya/midterm-project12.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.llLOrganBach.wav" controls />

        <h4>6. Rave.llLVoiceHiFiTTS</h4>

        <img src="/students/fumiya/midterm-project13.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.llLVoiceHiFiTTS.wav" controls />

        <h4>7. Rave.BulgarianFemaleChoir</h4>

        <img src="/students/fumiya/midterm-project14.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.BulgarianFemaleChoir.wav" controls />

        <h4>8. Rave.violin</h4>

        <img src="/students/fumiya/midterm-project15.png" alt="DAW screenshot showing Neutone FX's setting" className="rounded-lg shadow-lg w-150 mx-auto" />

        <audio src="/students/fumiya/Rave.violin.wav" controls />

        <h3>3. Synplant</h3>

        <h4>1. Kick</h4>

        <p>
          Original - TomLoKick-606_E_04 (
          <a href="https://samplesfrommars.com/products/all-products-from-mars?srsltid=AfmBOopeAvbWLbkDtpn9Iem0lHQNY7SU80RUSOswSCTDDdsdX3r20f-Z" target="_blank" rel="noopener noreferrer">
            All The Samples From Mars
        </a>
          )
        </p>

        <audio src="/students/fumiya/TomLoKick-606_E_04.wav" controls />

        <p>Processed</p>

        <audio src="/students/fumiya/kick.wav" controls />

        <h4>2. Snare</h4>

        <p>
          Original - SnareWTailShort19 (
          <a href="https://samplesfrommars.com/products/all-products-from-mars?srsltid=AfmBOopeAvbWLbkDtpn9Iem0lHQNY7SU80RUSOswSCTDDdsdX3r20f-Z" target="_blank" rel="noopener noreferrer">
            All The Samples From Mars
        </a>
          )
        </p>

        <audio src="/students/fumiya/SnareWTailShort19.wav" controls />

        <p>Processed</p>

        <audio src="/students/fumiya/snare.wav" controls />

        <h4>3. Rim</h4>

        <p>
          Original - SS Lindrum Orig 23 (
          <a href="https://samplesfrommars.com/products/all-products-from-mars?srsltid=AfmBOopeAvbWLbkDtpn9Iem0lHQNY7SU80RUSOswSCTDDdsdX3r20f-Z" target="_blank" rel="noopener noreferrer">
            All The Samples From Mars
        </a>
          )
        </p>

        <audio src="/students/fumiya/SS Lindrum Orig 23.wav" controls />

        <p>Processed</p>

        <audio src="/students/fumiya/rim.wav" controls />

        <h4>4. Hi-hat</h4>

        <p>
          Original - OH909Color16 (
          <a href="https://samplesfrommars.com/products/all-products-from-mars?srsltid=AfmBOopeAvbWLbkDtpn9Iem0lHQNY7SU80RUSOswSCTDDdsdX3r20f-Z" target="_blank" rel="noopener noreferrer">
            All The Samples From Mars
        </a>
          )
        </p>

        <audio src="/students/fumiya/OH909Color16.wav" controls />

        <p>Processed</p>

        <audio src="/students/fumiya/hi-hat.wav" controls />

        <h2>Step 3: Create a track using the audio stems generated in step 2</h2>

        <h3>My Original Composition</h3>

           <audio src="/students/fumiya/midterm-project.wav" controls />

        <h2>My Observation</h2>

        <p>
          I discovered a huge advantage in sound design.
          Even though it was originally meant to imitate the sound of real instruments,
          it naturally evolved into something more - an unhuman, chaotic sound that 
          still feels close enough to the pleasant tones we enjoy. 
          This unexpected quality actually adds a unique character to the music.
        </p>
        <p>
          I’ve never intentionally used AI tools in my compositions before,
          but I realized that all the tools I used for this piece were incredibly useful.
          I’ll definitely keep using them in my future work.
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
