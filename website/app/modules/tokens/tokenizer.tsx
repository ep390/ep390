"use client";

import { useState, useRef } from "react";

function buildVocabMap(vocabulary: string): Record<string, number> {
  const vocabMap: Record<string, number> = {};
  for (let i = 0; i < vocabulary.length; i++) {
    vocabMap[vocabulary[i]] = i;
  }
  return vocabMap;
}

export function encode(string: string, vocabulary: string): number[] {
  // Converts string into array of token indices
  const vocabMap = buildVocabMap(vocabulary);
  const tokens: number[] = [];
  for (const char of string) {
    const idx = vocabMap[char];
    if (idx === undefined) {
      throw new Error(`Unsupported character: ${char}`);
    }
    tokens.push(idx);
  }
  return tokens;
}

export function findUnsupportedCharacters(text: string, vocabulary: string): string[] {
  const vocabMap = buildVocabMap(vocabulary);
  const unsupported = new Set<string>();
  for (const char of text) {
    if (vocabMap[char] === undefined) {
      unsupported.add(char);
    }
  }
  return Array.from(unsupported).sort();
}

export function decode(tokenSequence: number[], vocabulary: string): string {
  // Converts array of token indices back to a string
  return tokenSequence
    .map((idx) => {
      if (idx < 0 || idx >= vocabulary.length) {
        throw new Error(`Invalid token index: ${idx}`);
      }
      return vocabulary[idx];
    })
    .join("");
}

function parseTokenArray(input: string): number[] | null {
  const trimmed = input.trim();
  
  // Must start with [ and end with ]
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }
  
  // Extract content between brackets
  const content = trimmed.slice(1, -1).trim();
  
  // Handle empty array
  if (content === "") {
    return [];
  }
  
  // Split by commas (allowing trailing comma)
  const parts = content.split(",");
  const tokens: number[] = [];
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    // Skip empty parts (handles trailing comma)
    if (trimmedPart === "") {
      continue;
    }
    
    // Try to parse as integer
    const num = Number(trimmedPart);
    
    // Check if it's a valid integer
    if (!Number.isInteger(num) || isNaN(num)) {
      return null;
    }
    
    tokens.push(num);
  }
  
  return tokens;
}

interface TokenizerDemoProps {
  vocabulary: string;
}

export default function TokenizerDemo({ vocabulary }: TokenizerDemoProps) {
  const [textInput, setTextInput] = useState("abc");
  const [tokenInput, setTokenInput] = useState("[1, 2, 3]");
  
  // Track if we're in the middle of a programmatic update to prevent circular updates
  const isUpdatingRef = useRef(false);

  // Parse token input and validate
  const parsedTokens = parseTokenArray(tokenInput);
  const unsupportedChars = findUnsupportedCharacters(textInput, vocabulary);

  // Calculate errors
  let textError: string | null = null;
  let tokenError: string | null = null;

  if (unsupportedChars.length > 0) {
    textError = "Contains unsupported characters";
  } else {
    try {
      encode(textInput, vocabulary);
    } catch {
      textError = "Encoding failed";
    }
  }

  if (parsedTokens === null) {
    tokenError = "Invalid token array format. Expected: [1, 2, 3]";
  } else {
    try {
      decode(parsedTokens, vocabulary);
    } catch (e) {
      tokenError = e instanceof Error ? e.message : "Decoding failed";
    }
  }

  const handleTextChange = (newText: string) => {
    // Prevent updates if we're in the middle of a programmatic update
    if (isUpdatingRef.current) return;
    
    setTextInput(newText);
    
    // Update token input if text is valid
    const unsupported = findUnsupportedCharacters(newText, vocabulary);
    if (unsupported.length === 0) {
      try {
        const tokens = encode(newText, vocabulary);
        isUpdatingRef.current = true;
        setTokenInput(`[${tokens.join(", ")}]`);
        // Reset flag after React has processed the update
        requestAnimationFrame(() => {
          isUpdatingRef.current = false;
        });
      } catch {
        // If encoding fails, don't update tokens
      }
    }
  };

  const handleTokenChange = (newTokenInput: string) => {
    // Prevent updates if we're in the middle of a programmatic update
    if (isUpdatingRef.current) return;
    
    setTokenInput(newTokenInput);
    
    // Update text input if tokens are valid
    const parsed = parseTokenArray(newTokenInput);
    if (parsed !== null) {
      try {
        const decoded = decode(parsed, vocabulary);
        isUpdatingRef.current = true;
        setTextInput(decoded);
        // Reset flag after React has processed the update
        requestAnimationFrame(() => {
          isUpdatingRef.current = false;
        });
      } catch {
        // If decoding fails, don't update text
      }
    }
  };

  return (
    <div className="my-6 space-y-4">
      <div>
        <label htmlFor="tokenizer-text-input" className="block text-sm font-medium mb-2">
          Encode this text:
        </label>
        <textarea
          id="tokenizer-text-input"
          className={`w-full p-3 border rounded-md font-mono text-sm ${
            textError ? "border-red-300" : ""
          }`}
          rows={3}
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter text here..."
        />
        {textError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-md">
            <div className="text-red-800 font-medium mb-2">Error:</div>
            {unsupportedChars.length > 0 ? (
              <>
                <div className="text-red-700 text-sm space-y-1 mb-2">
                  {unsupportedChars.map((char, idx) => {
                    const charCode = char.charCodeAt(0);
                    const displayChar =
                      char === " "
                        ? "(space)"
                        : char === "\n"
                        ? "(newline)"
                        : char === "\t"
                        ? "(tab)"
                        : char;
                    return (
                      <div key={idx} className="font-mono">
                        • &quot;{displayChar}&quot; (Unicode: U+
                        {charCode.toString(16).toUpperCase().padStart(4, "0")})
                      </div>
                    );
                  })}
                </div>
                <div className="text-red-600 text-xs">
                  This tokenizer only supports: letters, numbers, spaces, and basic
                  punctuation (.!?&quot;&apos;)
                </div>
              </>
            ) : (
              <div className="text-red-700 text-sm">{textError}</div>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="tokenizer-token-input" className="block text-sm font-medium mb-2">
          Decode this token sequence:
        </label>
        <textarea
          id="tokenizer-token-input"
          className={`w-full p-3 border rounded-md font-mono text-sm ${
            tokenError ? "border-red-300" : ""
          }`}
          rows={3}
          value={tokenInput}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="[1, 2, 3]"
        />
        {tokenError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-md">
            <div className="text-red-800 font-medium mb-1">Error:</div>
            <div className="text-red-700 text-sm">{tokenError}</div>
          </div>
        )}
      </div>
    </div>
  );
}

