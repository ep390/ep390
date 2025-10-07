import styles from "@/app/[...markdown]/markdown.module.css";
import { AbcPlayer, Abc, AbcMidiLink } from "@/components/abc";
import Toggle from "@/components/Toggle";

const abcScore1 = `X:1
L:1/8
Q:1/4=92
M:6/8
K:Bb
%%MIDI program 1 73
%%MIDI program 2 1
V:1 treble nm="Flute"
V:2 treble nm="Piano"
V:4 treble 
V:3 bass 
V:5 bass 
[V:1]"^Andante con moto" z6|[V:2]!p!"^Andante con moto" z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1]z2 z z2!p! D|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1]B2 A G A B|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1](c3 G2) G|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][G,,E,]6|[V:4]x6|[V:5]x6|
[V:1]B2 A (GA) B|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1]d3- d z!p! D|[V:2]z!<(! ([^F,A,D][A,D^F]!<)!!>(! [DFA][A,DF][F,A,D])!>)!|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]!<(! D G A B c d!<)!|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1]!>(! (f2 e)!>)! c z!p! G|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][C,,C,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=86]"^poco rall." G A B c B c|[V:2]!pp! z"_colla voce" ([G,B,^C][B,CG]) z ([G,B,C][B,CG])|[V:3][E,,E,]3 [E,,E,]3|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" d3- d z!p! D|[V:2]z"_a tempo" ([^F,A,D][A,D^F] [DFA][A,DF][F,A,D])|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]E2 E B A G|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]A3- A z D|[V:2]z!<(! ([^F,A,D][A,D^F]!<)!!>(! [DFA][A,DF][F,A,D])!>)!|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]!<(! E E E!<)!!>(! (BA) G!>)!|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]!<(! A2 A (BA) B!<)!|[V:2]z!<(! ([^F,A,D][A,D^F]) z ([B,EG][EGB])!<)!|[V:3][D,,D,]3 [C,,C,]3|[V:4]x6|[V:5]x6|
[V:1]!>(! (d6!>)!|[V:2]z!<(! ([B,DF][DFB]!<)!!>(! [FBd][DFB][B,DF])!>)!|[V:3][F,,,F,,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=86]"^rall. e dim." c3-) c2 B|[V:2]!p! z"_rall. -" ([A,EF][EFA] [FAe][EFA][A,EF])|[V:3][F,,,F,,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" B2 z z2 z|[V:2]z"_a tempo" ([B,DF][DFB] [FBd][DFB][B,DF])|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=86]"^rall. e dim." z2 z z2!p! F|[V:2]"_rall. al fine." z ([B,DF][DFB] [FBd][DFB][B,DF])|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" B2 B _A _G F|[V:2]!p! z"_a tempo" ([_G,B,_D][B,D_G] [DGB][B,DG][G,B,D])|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1]E3- E z E|[V:2]z ([_G,_CE][CE_G] [EG_c][CEG][G,CE])|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1]!<(! _G2 G (G_A) B!<)!|[V:2]z!<(! ([_G,_D_F][DF_G] [FG_d][DFG][G,DF])!<)!|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1]!>(! _c3-!>)! c z!p! c|[V:2]z!>(! ([_G,_CE][CE_G] [EG_c][CEG][G,CE])!>)!|[V:3][_C,,_C,]6|[V:4]x6|[V:5]x6|
[V:1]"^cresc." c2 c c =B A|[V:2]z"_cresc." ([A,C=E][CEA] [EAc][CEA][A,CE])|[V:3][A,,,A,,]6|[V:4]x6|[V:5]x6|
[V:1]d3 =B z G|[V:2]z ([G,=B,D][B,DG] [DG=B][B,DG][G,B,D])|[V:3][=B,,,=B,,]6|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=86]"^poco rall." A =B c c B A|[V:2]"_colla parte" z ([A,C=E][CEA]) z ([CD^F][DFc])|[V:3][C,,C,]3 [D,,D,]3|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" d6-|[V:2]"^a tempo" z ([=B,DG][DG=B] [GBd][DGB][B,DG])|[V:3][G,,,G,,]6|[V:4]x6|[V:5]x6|
[V:1]!>(! d2!>)! z z2 z|[V:2]z ([=B,DG][DG=B] [GBd][DGB][B,DG])|[V:3][G,,,G,,]6|[V:4]x6|[V:5]x6|
[V:1]z6|[V:2]!mf! ([Ee]3 [Dd]3|[V:3]z ([^F,A,][A,C]) z ([F,A,][A,C])|[V:4]z ([Ac]^F) z ([Ac]F)|[V:5][G,,,G,,]6|
[V:1]z6|[V:2][Cc]3 [Dd]3)|[V:3]z ([^F,A,][A,C]) z ([F,A,][A,C])|[V:4]z ([^FA]E) z ([FA]D)|[V:5][G,,,G,,]6|
[V:1][Q:1/4=86]"^rall. e dim." z6|[V:2]"_rall. e dim." ([Ee]3 [Dd]3|[V:3]z ([^F,A,][A,C]) z ([F,A,][A,C])|[V:4]z ([Ac]^F) z ([Ac]F)|[V:5][G,,,G,,]6|
[V:1]z2 z z2!p! D|[V:2][Cc]3 [Dd]3)|[V:3]z ([^F,A,][A,C]) z ([F,A,][A,C])|[V:4]z ([^FA]E) z ([FA]D)|[V:5][G,,,G,,]6|
[V:1][Q:1/4=92]"^a tempo" B2 A G A B|[V:2]"^a tempo" z!p!!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1](c3 G2) G|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][G,,E,]6|[V:4]x6|[V:5]x6|
[V:1]B2 A (GA) B|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][G,,D,]6|[V:4]x6|[V:5]x6|
[V:1]d3- d z!p! D|[V:2]z!<(! ([^F,A,D][A,D^F]!<)!!>(! [DFA][A,DF][F,A,D])!>)!|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]!<(! D G A B c d!<)!|[V:2]z!<(! ([G,B,D][B,DG]!<)!!>(! [DGB][B,DG][G,B,D])!>)!|[V:3][B,,,B,,]6|[V:4]x6|[V:5]x6|
[V:1]!>(! (f2 e)!>)! c z!p! G|[V:2]z!<(! ([G,CE][CEG]!<)!!>(! [EGc][CEG][G,CE])!>)!|[V:3][C,,C,]6|[V:4]x6|[V:5]x6|
[V:1]"^poco rall."[Q:1/4=86]"^poco rall." G A B c B c|[V:2]!pp! z"_colla voce" ([G,B,^C][B,CG]) z ([G,B,C][B,CG])|[V:3][E,,E,]3 [E,,E,]3|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" d3- d z z|[V:2]z"_a tempo" ([^F,A,D][A,D^F] [DFA][A,DF][F,A,D])|[V:3][D,,D,]6|[V:4]x6|[V:5]x6|
[V:1]!mf! e3/2 e/ e d2 d|[V:2]!mf! ([GAce]3 [GBd]3|[V:3]z ([G,A,CE][A,CEG]) z ([G,B,D][B,DG])|[V:4]x6|[V:5][D,,D,]6|
[V:1]c3 d2 z|[V:2][GAc]3 [GBd]3)|[V:3]z ([G,A,CE][A,CEG]) z ([G,B,D][B,DG])|[V:4]x6|[V:5][D,,D,]6|
[V:1]!p![Q:1/4=86]"^rall." G3/2 G/ G G ^F G|[V:2]!pp!"_colla parte" ([B,^CG]3 [A,CG]3)|[V:3]([E,,E,]3 [E,,E,]3)|[V:4]x6|[V:5]x6|
[V:1][Q:1/4=92]"^a tempo" d6-|[V:2]z ([B,DG][DGB] [GBd][DGB][B,DG])|[V:3][G,,,G,,]6|[V:4]x6|[V:5]x6|
[V:1]d2 z z2 z|[V:2][gbd'g']6-|[V:3][K:treble] [GBd]6-|[V:4]x6|[V:5][K:treble] x6|
[V:1]!fermata!z6|][V:2][gbd'g']2 z !fermata!z2 z|][V:3][GBd]2 z !fermata!z2 z|][V:4]x6|][V:5]x6|]
`;

const abcScore2 = `X:2
T:Baroque Minuet
M:3/4
L:1/8
Q:1/4=120
K:G
%%MIDI program 1 1
V:1 treble nm="Harpsichord"
V:2 bass nm="Bass"
[V:1]G2 B2 d2|e2 d2 B2|A2 c2 e2|f2 e2 c2|
[V:1]B2 d2 g2|a2 g2 d2|e2 g2 c2|B2 A2 G2|
[V:1]G2 B2 d2|e2 d2 B2|A2 c2 e2|f2 e2 c2|
[V:1]B2 d2 g2|a2 g2 d2|e2 g2 c2|B2 A2 G2|
[V:2]G,2 G,2 G,2|C2 C2 C2|F,2 F,2 F,2|B,2 B,2 B,2|
[V:2]E,2 E,2 E,2|A,2 A,2 A,2|D2 D2 D2|G,2 G,2 G,2|`;

const abcScore3 = `X:3
T:Romantic Nocturne
M:4/4
L:1/8
Q:1/4=66
K:Eb
%%MIDI program 1 1
V:1 treble nm="Piano"
V:2 bass nm="Left Hand"
[V:1]"^Andante espressivo" z2 B,2|"^p" (E2 G2) B2|"^cresc." (c2 B2) A2|"^dim." (G2 F2) E2|
[V:1]"^p" z2 B,2|(E2 G2) B2|"^cresc." (c2 B2) A2|"^dim." (G2 F2) E2|
[V:1]"^p" z2 B,2|(E2 G2) B2|"^cresc." (c2 B2) A2|"^dim." (G2 F2) E2|
[V:1]"^p" z2 B,2|(E2 G2) B2|"^cresc." (c2 B2) A2|"^dim." (G2 F2) E2|
[V:2]E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|
[V:2]E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|E,,2 E,,2 E,,2|`;

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

        <GenerationObservations
          title="Generation Experiment 1"
          period="Romantic"
          composer="Chopin"
          instrumentation="Flute and Piano"
          abcScore={abcScore1}
          observations="The model generated a complex romantic piece in Bb major with sophisticated harmonic progressions and dynamic markings. The piece features typical romantic characteristics like tempo changes (rallentando, a tempo), dynamic contrasts (p, pp, mf, crescendo, diminuendo), and expressive markings. The flute melody is lyrical and flowing, while the piano provides rich harmonic support. The model successfully captured the romantic style with its use of chromaticism, extended phrases, and emotional expression markings."
        />

        <GenerationObservations
          title="Generation Experiment 2"
          period="Baroque"
          composer="Bach"
          instrumentation="Harpsichord"
          abcScore={abcScore2}
          observations="This generation produced a traditional baroque minuet in G major with a clear 3/4 time signature. The piece follows typical baroque conventions with balanced phrases, clear harmonic progressions, and a structured bass line. The model captured the characteristic baroque style with its use of stepwise motion, clear cadences, and the typical minuet form. The harpsichord instrumentation is appropriate for the period, and the piece maintains the elegant, dance-like quality expected of a minuet."
        />

        <GenerationObservations
          title="Generation Experiment 3"
          period="Romantic"
          composer="Chopin"
          instrumentation="Piano Solo"
          abcScore={abcScore3}
          observations="The third experiment generated a romantic nocturne in Eb major with a slow, expressive tempo. The piece features typical nocturne characteristics including a lyrical melody with expressive markings (Andante espressivo), dynamic contrasts (p, crescendo, diminuendo), and a simple but effective harmonic structure. The model successfully created the intimate, dreamy quality associated with nocturnes, with the melody floating over a steady bass line. The use of expressive markings and the overall structure demonstrates the model's understanding of romantic piano music conventions."
        />

        <h2>My Original Composition</h2>

        <p>
          For my original composition, I selected the opening section of the romantic nocturne (Experiment 3) as my source material. The gentle, flowing melody in Eb major provided an excellent foundation for creating an atmospheric piece. I exported the MIDI from the ABC notation and imported it into my DAW, where I expanded upon the original material by adding additional harmonic layers, subtle percussion elements, and ambient textures.
        </p>

        <p>
          I've added my audio file to the public directory. The composition builds upon the AI-generated nocturne theme, transforming it into a more contemporary ambient piece while preserving the romantic character of the original melody.
        </p>
        
        <audio src="/students/Charlie/hw5/MyMusic.mp3" controls />

        <p>
          The AI model served as an excellent starting point for my composition process. Rather than starting from a blank slate, I had a musically coherent foundation that I could build upon. The generated nocturne provided both melodic and harmonic material that felt authentic to the romantic period, which gave me confidence to experiment with modern production techniques while maintaining the piece's emotional core.

          The model's ability to generate stylistically appropriate music was impressive - it understood the conventions of romantic nocturnes and created something that felt genuine rather than artificial. This suggests that AI models can indeed be valuable creative collaborators, especially for generating initial ideas or exploring different musical styles. However, the human element remains crucial for adding personal expression, making creative decisions about arrangement and production, and imbuing the music with deeper emotional meaning.

          I believe these models can be particularly helpful for composers who want to explore unfamiliar styles or need inspiration when facing creative blocks. The key is to use the AI as a collaborator rather than a replacement, allowing it to provide raw material that can be refined and personalized through human creativity and musical intuition.
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
