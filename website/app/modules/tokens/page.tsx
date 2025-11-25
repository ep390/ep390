import styles from "@/app/[...markdown]/markdown.module.css";
import ModuleFooter from "@/components/ModuleFooter";
import TokenizerDemo from "./tokenizer";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import EmbeddingLookup from "./EmbeddingLookup";

export default function Page() {
  const vocabulary = ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.!?"'0123456789`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={styles.markdownContent}>
        <div>
          <h1>Transformer Tokens & Embeddings</h1>
          <p>
            Transformers read and write sequences of tokens. But what is a token
            sequence?
          </p>
          <p>
            How can transformer models input and output <strong>text</strong>,{" "}
            <strong>images</strong>, <strong>video</strong>,{" "}
            <strong>MIDI</strong> and <strong>audio</strong>?
          </p>
          <h2>Tokenizer Example</h2>
          <p>To train or use a transformer, we need to</p>
          <ul>
            <li>Encode input data to a sequence of tokens</li>
            <li>Decode output tokens back to the input data format</li>
          </ul>
          <p>Here&apos;s an extremely simple text tokenizer:</p>
          <TokenizerDemo vocabulary={vocabulary} />
          <p>
            This simple tokenizer has limited value. It can only encode and
            decode the <strong>{vocabulary.length}</strong> characters in its
            vocabulary:{" "}
          </p>
          <pre>{vocabulary}</pre>
          <h2>What is a token?</h2>
          <p>
            Assuming a <strong>vocabulary size</strong> of{" "}
            <InlineMath>x</InlineMath>, a token is just an integer value that
            satisfies:
          </p>
          <p>
            <InlineMath>{`0 \\leq token < x`}</InlineMath>
          </p>
          <p>
            Remember{" "}
            <a
              href="https://huggingface.co/spaces/ElectricAlexis/NotaGen"
              target="_blank"
            >
              NotaGen
            </a>{" "}
            from the Symbolic Music Generation assignment? NotaGen generates abc
            notation, which is just text: Now we know one way that models can
            produce text
          </p>
          <h2>Byte Pair Encoding</h2>
          <p>
            Text-based LLMs typically use Byte Pair Encoding (BPE), which
            tokenizes groups of characters.
          </p>
          <ul>
            <li>
              <a href="https://github.com/openai/tiktoken" target="_blank">
                tiktoken
              </a>{" "}
              (created at OpenAI)
            </li>
            <li>
              <a href="https://github.com/google/sentencepiece" target="_blank">
                SentencePiece
              </a>{" "}
              (created at Google)
            </li>
          </ul>
          <p>
            A robust BPE text tokenizer will{" "}
            <strong>
              help the model see common subword character sequences
            </strong>
            . In English &quot;izer&quot; is a common subword, so a BPE
            tokenizer might split &quot;tokenizer&quot; into tokens like{" "}
            <strong>token</strong>, and <strong>izer</strong> (instead of e.g.{" "}
            <strong>toke</strong> and <strong>nizer</strong>). This helps models
            generalize and &quot;understand&quot; grammar.
          </p>
          <h2>Interactive Tokenizers</h2>
          <ul>
            <li>
              <a href="https://gpt-tokenizer.dev/" target="_blank">
                gpt-tokenizer.dev
              </a>
            </li>
            <li>
              <a href="https://platform.openai.com/tokenizer" target="_blank">
                OpenAI Tokenizer
              </a>
            </li>
          </ul>
          <h2>Music Tokenization</h2>
          <p>MIDI Tokenization</p>
          <ul>
            <li>
              <a href="https://github.com/Natooz/MidiTok" target="_blank">
                https://github.com/Natooz/MidiTok
              </a>
            </li>
          </ul>
          <p>Audio Tokenization</p>
          <ul>
            <li>
              <a
                href="https://github.com/facebookresearch/encodec"
                target="_blank"
              >
                https://github.com/facebookresearch/encodec
              </a>{" "}
              (Meta/Facebook)
            </li>
            <li>
              <a
                href="https://github.com/descriptinc/descript-audio-codec"
                target="_blank"
              >
                https://github.com/descriptinc/descript-audio-codec
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=mV7bhf6b2Hs"
                target="_blank"
              >
                https://www.youtube.com/watch?v=mV7bhf6b2Hs
              </a>{" "}
              (YouTube video explains how these work)
            </li>
          </ul>
          <h2>Embeddings</h2>
          <p>
            Once we have tokens, the transformer will use them to look up column
            vectors from an <strong>embedding table</strong>. Each token index
            corresponds to a column vector that represents that token
            numerically.
          </p>
          <EmbeddingLookup vocabulary={vocabulary} />
          <p>
            During the training process, the values in the embedding table are
            gradually adjusted. If we train successfully, these values will
            encode the semantic significance of the tokens in a high-dimensional
            space.
          </p>
          <h2>Resources</h2>
          <ul>
            <li>
              3Blue1Brown: But what is a GPT? Visual intro to transformers
              <ul>
                <li>
                  Chapter 5:{" "}
                  <a
                    href="https://www.youtube.com/watch?v=wjZofJX0v4M"
                    target="_blank"
                  >
                    Transformers, the tech behind LLMs (YouTube)
                  </a>
                </li>
                <li>
                  Chapter 6:{" "}
                  <a
                    href="https://www.youtube.com/watch?v=eMlx5fFNoYc"
                    target="_blank"
                  >
                    Attention in transformers, step-by-step (YouTube)
                  </a>
                </li>
              </ul>
            </li>
            <li>
              Andrej Karpathy (ML Researcher from Tesla, OpenAI)
              <ul>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=kCc8FmEb1nY"
                    target="_blank"
                  >
                    Let&apos;s build GPT: from scratch, in code, spelled out.
                    (YouTube)
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <ModuleFooter />
      </div>
    </div>
  );
}
