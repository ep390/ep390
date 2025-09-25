import { useEffect, useRef, useState } from "react";
import abcjs from "abcjs";
import "abcjs/abcjs-audio.css";

export function Abc({ abc }: { abc: string }) {
  const inputEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputEl.current) return;

    abcjs.renderAbc(inputEl.current, abc, {
      add_classes: true,
      responsive: "resize",
    });
  }, [abc]);

  return <div ref={inputEl}></div>;
}

export function AbcMidiPlayer({ abc }: { abc: string }) {
  const paperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let controller: abcjs.SynthObjectController | null = null;
    setError(null);

    try {
      if (!paperRef.current || !controlsRef.current) return;

      const visualObjs = abcjs.renderAbc(paperRef.current, abc, {
        add_classes: true,
        responsive: "resize",
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
  }, [abc]);

  return (
    <div>
      <div ref={paperRef}></div>
      <div className="my-2 w-[400px]" ref={controlsRef}></div>
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
    </div>
  );
}
