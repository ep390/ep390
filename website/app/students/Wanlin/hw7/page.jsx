import styles from "@/app/[...markdown]/markdown.module.css";
import Image from "next/image";

export default function HW7Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <h1 className="text-3xl font-bold mb-4">YuE Model Analysis</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-lg text-gray-800 mb-0">
            YuE is an open-source, transformer-based long-form music generation model designed to produce full songs containing both vocals and accompaniment. It represents one of the first large-scale attempts to build a publicly available lyrics-to-song system comparable to commercial models such as Suno and Udio. The architecture is optimized for long-range musical coherence and high-resolution vocal synthesis.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-6">Model Architecture and Core Mechanisms</h2>

        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Architecture Overview</h3>
          <p className="mb-4 text-gray-700 text-sm">
            The following diagram illustrates YuE's multi-stage generation pipeline, showing how the model processes inputs through Stage-1 and Stage-2 language models to produce vocal and accompaniment tracks with hierarchical tokenization.
          </p>
          <div className="w-full overflow-x-auto">
            <Image 
              src="/students/Wanlin/Yue-main.png" 
              alt="YuE Model Architecture Diagram showing multi-stage generation pipeline with track-decoupled vocal and instrumental tokens, hierarchical tokenization, and residual codebooks" 
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg shadow-md"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">1. Track-Decoupled Next-Token Prediction</h3>
            <p className="mb-3">
              YuE introduces a dual-track prediction mechanism in which vocal and accompaniment tokens are generated through two synchronized but independent token streams.
            </p>
            <div className="mb-3">
              <p className="font-semibold text-gray-800 mb-2">Scientific motivation:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Vocal energy is typically lower than instrumental energy in mixed audio.</li>
                <li>Standard single-stream tokenization results in vocal masking, leading to degraded clarity and limited expressive range.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">Improvements enabled:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>phoneme articulation</li>
                <li>timbral transitions</li>
                <li>vibrato and melisma</li>
                <li>dynamic and pitch agility</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">2. Hierarchical Audio Tokenization</h3>
            <p className="mb-3">
              YuE employs a two-level tokenization framework:
            </p>
            <ul className="list-disc ml-6 mb-3 space-y-1">
              <li><strong>Semantic tokens</strong> capture style, timbre, and phrasing</li>
              <li><strong>Acoustic tokens</strong> encode fine spectral details and micro-intonation</li>
            </ul>
            <p>
              This design increases information density while preserving critical features needed for expressive singing synthesis. It is more detailed than single-layer codecs (e.g., EnCodec), enabling better modeling of high-frequency vocal characteristics.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">3. Structural Progressive Conditioning</h3>
            <p className="mb-3">
              To generate music lasting multiple minutes, YuE incorporates long-range conditioning across structural sections (e.g., verse, chorus).
            </p>
            <p className="font-semibold text-gray-800 mb-2">This improves:</p>
            <ul className="list-disc ml-6 mb-3 space-y-1">
              <li>global form consistency</li>
              <li>phrase-to-phrase coherence</li>
              <li>section-level transitions</li>
            </ul>
            <p>
              allowing YuE to produce extended pieces rather than loop-based or locally coherent fragments.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">4. Large-Scale Multimodal Training</h3>
            <p className="mb-3">
              YuE is trained on a mixture of speech, music, and lyric-aligned datasets:
            </p>
            <ul className="list-disc ml-6 mb-3 space-y-1">
              <li>≈70,000 hours of speech</li>
              <li>≈650,000 hours of music</li>
              <li>multilingual lyric-to-audio pairs</li>
            </ul>
            <p>
              Training is performed in multiple stages, including language modeling, music/audio modeling, and a refinement model. This multi-phase design improves stability and enables tighter lyric–melody alignment.
            </p>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Strengths</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>High vocal expressiveness due to track-decoupled modeling</li>
              <li>Strong lyric-to-vocal alignment compared to typical open-source models</li>
              <li>Ability to maintain long-form musical structure</li>
              <li>Open-source transparency allows detailed scientific analysis</li>
            </ul>
          </div>

          <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Weaknesses</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>No stable online inference environment; high GPU cost limits accessibility</li>
              <li>Generation quality can be inconsistent, particularly in accompaniment mixing</li>
              <li>Requires large-scale hardware for full-length inference</li>
              <li>Not as polished as commercial closed-source systems in timbral smoothness and production quality</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Exploring Suno Through Bilibili Trends</h2>
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <p className="text-gray-800 mb-0">
              While studying YuE from a scientific perspective, I also examined a more accessible commercial system — Suno — to generate actual audio examples for this assignment. Recently, Suno-generated songs have become extremely popular on the Chinese video platform Bilibili, where many creators upload AI covers using custom prompts. Inspired by this trend, I selected a Bilibili creator and tested his prompt on three very different Chinese songs to observe how Suno handles musical diversity.
            </p>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="font-semibold text-gray-800 mb-2">Shared Suno Prompt:</p>
            <p className="text-sm text-gray-700 italic font-mono bg-white p-3 rounded border border-gray-300">
              energetic electric fusion jam with Rhodes lead, tight groove, funky bass, driving drums, and bright brass stabs, features powerful gospel choir vocals with rich harmonies, soulful shouts, and call-and-response phrases, modern, virtuosic, and rhythmically intricate, blending live band energy with uplifting gospel spirit
            </p>
            <p className="text-sm text-gray-600 mt-2">
              All three examples below used this same prompt to test how Suno adapts the same musical style to different source materials.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Example 1: A Simple Children's Song</h3>
              <p className="mb-4 text-gray-700">
                My first test was a very simple melody from a children's song. I wanted to see whether a basic musical structure would allow Suno to produce a more accurate and faithful cover.
              </p>
              <p className="mb-4 text-gray-700">
                <strong>Song:</strong> 春天在哪里 (Where is Spring)
              </p>
              <p className="mb-4 text-gray-700">
                The result was consistent with my expectation: Suno's arrangement remained relatively simple and straightforward. The harmony and rhythm followed the original closely, but the creative variation was minimal.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Original Version:</p>
                  <audio 
                    src="/students/Wanlin/经典儿歌《春天在哪里》，来和贝乐虎一起唱吧~.mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Suno Cover Version:</p>
                  <audio 
                    src="/students/Wanlin/经典儿歌《春天在哪里》，来和贝乐虎一起唱吧~ (Cover).mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Example 2: A Fast, Jazz-Influenced Anime Theme</h3>
              <p className="mb-4 text-gray-700">
                To evaluate how Suno performs on more rhythmically complex music, I next used a high-energy anime theme with jazz elements.
              </p>
              <p className="mb-4 text-gray-700">
                <strong>Song:</strong> 甜心格格 (Sweet Heart Princess)
              </p>
              <p className="mb-4 text-gray-700">
                This time, Suno's arrangement was noticeably more engaging — richer instrumentation, clearer groove, and more stylistic interpretation. Compared with the children's song, the AI seemed to respond better to the complexity and produced a more dynamic cover.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Original Version:</p>
                  <audio 
                    src="/students/Wanlin/（《甜心格格》（快乐女孩）演唱_刘惜君）MV蓝光）.mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Suno Cover Version:</p>
                  <audio 
                    src="/students/Wanlin/（《甜心格格》（快乐女孩）演唱_刘惜君）MV蓝光） (Cover).mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Example 3: A Chinese Traditional Opera Excerpt</h3>
              <p className="mb-4 text-gray-700">
                Finally, I tested a short excerpt of traditional Chinese opera. Suno struggled to interpret the Chinese lyrics accurately — the model often misread or ignored characters — but its arrangement was unexpectedly creative.
              </p>
              <p className="mb-4 text-gray-700">
                <strong>Song:</strong> 梨花颂 (Pear Blossom Ode) by 梅葆玖
              </p>
              <p className="mb-4 text-gray-700">
                Although it did not reproduce the vocal style of opera, it generated an interesting fusion track that combined modern harmonies with elements reminiscent of traditional drama.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Original Version:</p>
                  <audio 
                    src="/students/Wanlin/梅葆玖 梨花颂.mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Suno Cover Version:</p>
                  <audio 
                    src="/students/Wanlin/梅葆玖 梨花颂 (Cover).mp3" 
                    controls 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

