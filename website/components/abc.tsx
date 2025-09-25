import { useEffect, useRef } from "react";
import abcjs from "abcjs";

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
