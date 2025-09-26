"use client";

import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";

export function Abc({
  abc,
  abcOptions,
}: {
  abc: string;
  abcOptions?: abcjs.AbcVisualParams;
}) {
  const inputEl = useRef<HTMLDivElement>(null);

  if (abc.length > 250 && !abcOptions) {
    abcOptions = {
      staffwidth: 900,
      wrap: {
        preferredMeasuresPerLine: 4,
        minSpacing: 1.1,
        maxSpacing: 2.7,
        lastLineLimit: 1,
      },
    };
  }

  useEffect(() => {
    if (!inputEl.current) return;

    abcjs.renderAbc(inputEl.current, abc, {
      add_classes: true,
      responsive: "resize",
      ...abcOptions,
    });
  }, [abc, abcOptions]);

  return <div ref={inputEl}></div>;
}

export function AbcPlayer({
  abc,
  abcOptions,
  hideScore = false,
}: {
  abc: string;
  abcOptions?: abcjs.AbcVisualParams;
  hideScore?: boolean;
}) {
  const paperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (abc.length > 250 && !abcOptions) {
    abcOptions = {
      staffwidth: 900,
      wrap: {
        preferredMeasuresPerLine: 4, // try 3–4
        minSpacing: 1.1,
        maxSpacing: 2.7,
        lastLineLimit: 1,
      },
    };
  }

  useEffect(() => {
    let controller: abcjs.SynthObjectController | null = null;
    setError(null);

    try {
      if (!paperRef.current || !controlsRef.current) return;

      const visualObjs = abcjs.renderAbc(paperRef.current, abc, {
        add_classes: true,
        responsive: "resize",
        ...abcOptions,
      });
      const visualObj = visualObjs[0];

      controller = new abcjs.synth.SynthController();
      controller.load(controlsRef.current, null, {
        displayPlay: true,
        displayRestart: true,
        displayProgress: true,
        displayWarp: true,
      });

      // Let the controller create/manage the synth & AudioContext.
      controller
        .setTune(visualObj, true)
        .catch((e: Error) => setError(e?.message || "Failed to set tune"));
    } catch (e: unknown) {
      setError((e as Error)?.message || "Failed to initialize MIDI player");
    }

    return () => {
      try {
        controller?.pause();
      } catch {}
    };
  }, [abc, abcOptions]);

  return (
    <div>
      <div className="my-2" ref={controlsRef}></div>
      <div style={{ display: hideScore ? "none" : "block" }}>
        <div ref={paperRef}></div>
      </div>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
    </div>
  );
}

export function AbcMidiLink({
  abc,
  filename = "score.mid",
  label,
}: {
  abc: string;
  filename?: string;
  label?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    setError(null);
    // Clear previous content so the link reflects current props
    containerRef.current.innerHTML = "";
    try {
      // Per docs: may return an HTML string or a DOM element depending on environment.
      let result = abcjs.synth.getMidiFile(abc, {
        midiOutputType: "link",
        fileName: filename,
        downloadLabel: label || "Download MIDI",
      });
      if (Array.isArray(result)) result = result[0];
      if (typeof result === "string") {
        containerRef.current.innerHTML = result;
      } else if (result && result.nodeType === 1) {
        const node = result as unknown as HTMLElement;
        // Ensure label if caller provided one
        if (label && node.tagName === "A") node.textContent = label;
        containerRef.current.appendChild(node);
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || "Failed to create MIDI link");
    }
  }, [abc, filename, label]);

  return (
    <div>
      <div ref={containerRef}></div>
      {error ? <p className="text-red-600 text-sm mt-2">{error}</p> : null}
    </div>
  );
}
