import styles from "@/app/[...markdown]/markdown.module.css";

export default function HW7Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-3xl font-bold mb-4">Homework 7: DiffRhythm Study</h1>

        <p>
          For this assignment I explored <strong>DiffRhythm</strong> on Hugging Face. I chose it because
          it ships an open diffusion-style audio model that can run locally (my checkout lives in{" "}
          <code>~/Documents/DiffRhythm</code>), supports both <em>text → audio</em> and{" "}
          <em>audio → audio</em> workflows, and promises fast generation with good production values.
        </p>

        <h2>How I Generated Audio</h2>
        <ul>
          <li>Interface: local DiffRhythm repo mirrored from the Hugging Face Space.</li>
          <li>Prompts: descriptive text prompts; one experiment also fed a reference vocal melody.</li>
          <li>Outputs: saved WAVs were converted to MP3 for the static folder.</li>
        </ul>

        <h2>Audio Examples</h2>

        <h3>Example 1 — Text → Audio (ballad with vocals)</h3>
        <p>
          Prompt: <em>“sad love song, ethereal, female, for TV play”</em> with the provided lyrics below.
          Vocals are AI-generated; no post-processing beyond the built-in model EQ.
        </p>
        <audio src="/students/Charlie/hw7-output1.mp3" controls />
        <p>
          Notes: the instrumental bed feels polished with balanced EQ; the vocal timbre is airy
          but sounds synthetic and struggles with clean word breaks.
        </p>
        <details>
          <summary>Lyrics used</summary>
          <pre className="whitespace-pre-wrap">
Film the movie sell for free
Now turn the light Someone kiss
All the lier I had seen
But you’re the one that treat me cheap

God save me save me Stop me
Sinking into dream
Fragile crystal
Love becoming luxury
save me save me
Let me keep it away
Let me keep it away

Woo

Fairy telling about the love
So pretty I wondering
If love is wasting all the time
Why do I stay
Where can I place
What can I trade

God save me save me Stop me
Sinking into dream
Fragile crystal
Love becoming luxury
save me save me
Let me keep it away
Let me keep it away

Woo
          </pre>
        </details>

        <h3>Example 2 — Text → Audio (instrumental)</h3>
        <p>
          Prompt: Jazz, Bigband style; no lyrics. Shows the model’s strength in pure musical
          texturesJazz, Bigband no vocals.
        </p>
        <audio src="/students/Charlie/hw7-output2.mp3" controls />
        <p>
          Notes: clean reverb tail and stereo field; occasionally drifts harmonically but keeps a
          cohesive mood.
        </p>

        <h3>Example 3 — Longer Instrumental</h3>
        <p>
          Same settings as Example 2, longer duration. The section around <strong>0:55</strong> is the
          most stable musically; earlier sections meander.
        </p>
        <audio src="/students/Charlie/hw7-output3.mp3" controls />

        <h3>Human Reference for Blind Test</h3>
        <p>
          My own produced track to compare against the AI generations during a blind listening test.
        </p>
        <audio src="/students/Charlie/hw7-human-reference.mp3" controls />

        <h2>Findings</h2>
        <ul>
          <li>👍 High production quality with default settings; fast generation times.</li>
          <li>👍 Diffusion backbone yields smooth dynamics and balanced EQ without extra mixing.</li>
          <li>👍 Supports both audio-conditioning and text-only prompts, which kept iteration flexible.</li>
          <li>👎 Vocal synthesis sounds artificial; syllables smear and you can hear the “AI” quality.</li>
          <li>👎 In longer clips the form is unstable (motifs wander, occasional abrupt transitions).</li>
          <li>👎 Cannot yet do crisp word-level alignment, so lyric intelligibility is low.</li>
        </ul>

        <h2>Creative Potential</h2>
        <p>
          DiffRhythm shines as an <em>idea starter</em>: fast, good-sounding beds and textures that could
          be resampled or layered under human vocals. The weaknesses in intelligible singing limit it
          for release-ready vocal tracks, but instrumental or hybrid workflows feel promising. I plan to
          run blind tests (AI vs. my human reference) to gauge listener perception and decide how far I
          can push the model in a production pipeline.
        </p>

        <p className="text-sm text-gray-600">
          Source: <a href="https://huggingface.co/spaces" target="_blank" rel="noreferrer">DiffRhythm on Hugging Face</a>
        </p>
      </div>
    </div>
  );
}
