---
title: Tokenization For Transformers
---

Transformers read and write sequences of tokens. But what is a token sequence?

How can transformer models input and output **text**, **images**, **video**, **MIDI** and **audio**?

## Text Example

```javascript
encode("abc");         // [1,  2, 3]
encode("Hello world"); // [34, 5, 12, 12, 15, 0, 23, 15, 18, 12, 4]
```

## Tokenizer Example

To train or use a transformer, we need to

- Encode input data to a sequence of tokens
- Decode output tokens back to the input data format

Here's the simplest possible text tokenizer

```javascript
const vocabulary = ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.!?"'`;
const vocabArray = vocabulary.split("");
const vocabMap = {};
for (let i = 0; i < vocabArray.length; i++) {
  vocabMap[vocabArray[i]] = i;
}

function encode(string) {
  // Converts string into array of token indices
  const tokens = [];
  for (const char of string) {
    const idx = vocabMap[char];
    if (idx === undefined) {
      throw new Error(`Unsupported character: ${char}`);
    }
    tokens.push(idx);
  }
  return tokens;
}

function decode(tokenSequence) {
  // Converts array of token indices back to a string
  return tokenSequence
    .map((idx) => {
      if (idx < 0 || idx >= vocabArray.length) {
        throw new Error(`Invalid token index: ${idx}`);
      }
      return vocabArray[idx];
    })
    .join("");
}
```

A token is just an integer value

- `0` or greater
- less than `x`, where `x` is the vocabulary size

So a token sequence is just a sequence of integers

```javascript
encode("abc");
// [1, 2, 3]
encode("My name is alice!");
// [39, 25, 0, 14, 1, 13, 5, 0, 9, 19, 0, 1, 12, 9, 3, 5, 54]

const toks = encode("Hi there");
decode(toks);
// 'Hi there'
```

Remember [NotaGen](https://huggingface.co/spaces/ElectricAlexis/NotaGen) from the Symbolic Music Generation assignment? NotaGen generates abc notation, which is just text: Now we know one way that models can produce text

## Byte Pair Encoding

Text-based LLMs typically use Byte Pair Encoding (BPE), which tokenizes groups of characters.

- [tiktoken](https://github.com/openai/tiktoken) (created at OpenAI)
- [SentencePiece](https://github.com/google/sentencepiece) (created at Google)

A robust BPE text tokenizer will **help the model see common subword character sequnces**. In English "izer" is a common subword, so a BPE tokenizer might split "tokenizer" into tokens like **`token`**, and **`izer`** (instead of e.g. **`toke`** and **`nizer`**). This helps models generalise and "understand" grammar.

### Interactive Tokenizers

- [gpt-tokenizer.dev](https://gpt-tokenizer.dev/)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)

## Music Tokenization

MIDI Tokenization

- https://github.com/Natooz/MidiTok

Audio Tokenization

- https://github.com/facebookresearch/encodec (Meta/Facebook)
- https://github.com/descriptinc/descript-audio-codec
- https://www.youtube.com/watch?v=mV7bhf6b2Hs (YouTube video explains how these work)

## Resources

- 3Blue1Brown: But what is a GPT? Visual intro to transformers
  - Chapter 5: [Transformers, the tech behind LLMs (YouTube)](https://www.youtube.com/watch?v=wjZofJX0v4M)
  - Chapter 6: [Attention in transformers, step-by-step (YouTube)](https://www.youtube.com/watch?v=eMlx5fFNoYc)
- Andrej Karpathy (ML Researcher from Tesla, OpenAI)
  - [Let's build GPT: from scratch, in code, spelled out. (YouTube)](https://www.youtube.com/watch?v=kCc8FmEb1nY)
