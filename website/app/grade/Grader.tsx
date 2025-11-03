"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseRubricText, type RubricItem } from "./utils";

type ScoredItem = RubricItem & { score: number | null; excluded: boolean };

export function Grader({
  rubricTextInitial,
  showPasteArea
}: {
  rubricTextInitial: string;
  showPasteArea: boolean;
}) {
  const [rubricText, setRubricText] = useState<string>(rubricTextInitial);
  const [rubricItems, setRubricItems] = useState<RubricItem[]>(() => parseRubricText(rubricTextInitial));
  const [scoresById, setScoresById] = useState<Record<string, number | null>>({});
  const [comments, setComments] = useState<string>("");
  const [excludedById, setExcludedById] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load persisted scores keyed by a hash of rubricText
  const rubricKey = useMemo(() => `grader:${hashString(rubricTextInitial)}`, [rubricTextInitial]);

  useEffect(() => {
    try {
      const savedScores = window.localStorage.getItem(`${rubricKey}:scoresById`);
      if (savedScores) setScoresById(JSON.parse(savedScores));
      const savedComments = window.localStorage.getItem(`${rubricKey}:comments`);
      if (savedComments != null) setComments(savedComments);
      const savedExcluded = window.localStorage.getItem(`${rubricKey}:excludedById`);
      if (savedExcluded) setExcludedById(JSON.parse(savedExcluded));
    } catch {}
  }, [rubricKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${rubricKey}:scoresById`, JSON.stringify(scoresById));
    } catch {}
  }, [scoresById, rubricKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${rubricKey}:comments`, comments);
    } catch {}
  }, [comments, rubricKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${rubricKey}:excludedById`, JSON.stringify(excludedById));
    } catch {}
  }, [excludedById, rubricKey]);

  // Keep scores map aligned with current rubric items
  useEffect(() => {
    setScoresById(prev => {
      const next: Record<string, number | null> = { ...prev };
      for (const item of rubricItems) {
        if (!(item.id in next)) next[item.id] = null;
      }
      for (const key of Object.keys(next)) {
        if (!rubricItems.find(r => r.id === key)) delete next[key];
      }
      return next;
    });
    setExcludedById(prev => {
      const next: Record<string, boolean> = { ...prev };
      for (const item of rubricItems) {
        if (!(item.id in next)) next[item.id] = false;
      }
      for (const key of Object.keys(next)) {
        if (!rubricItems.find(r => r.id === key)) delete next[key];
      }
      return next;
    });
  }, [rubricItems]);

  const scoredItems: ScoredItem[] = useMemo(() => {
    return rubricItems.map(item => ({
      ...item,
      score: scoresById[item.id] ?? null,
      excluded: !!excludedById[item.id]
    }));
  }, [rubricItems, scoresById, excludedById]);

  const totalMax = useMemo(
    () => scoredItems.reduce((sum, it) => (it.excluded ? sum : sum + it.maxPoints), 0),
    [scoredItems]
  );
  const totalScore = useMemo(
    () =>
      scoredItems.reduce(
        (sum, it) => (it.excluded ? sum : sum + (typeof it.score === "number" ? it.score : 0)),
        0
      ),
    [scoredItems]
  );

  function onParse() {
    const parsed = parseRubricText(rubricText);
    setRubricItems(parsed);
  }

  function setScore(itemId: string, value: number | null) {
    setScoresById(prev => ({ ...prev, [itemId]: value }));
  }

  function toggleExcluded(itemId: string) {
    setExcludedById(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function setAllFull() {
    setScoresById(prev => {
      const next: Record<string, number | null> = { ...prev };
      for (const item of rubricItems) next[item.id] = item.maxPoints;
      return next;
    });
  }

  function clearForm() {
    setScoresById(prev => {
      const next: Record<string, number | null> = { ...prev };
      for (const item of rubricItems) next[item.id] = null;
      return next;
    });
    setComments("");
  }

  async function copySummaryToClipboard() {
    const lines: string[] = [];
    if (comments.trim().length > 0) {
      lines.push("Comments:");
      lines.push(comments.trim());
      lines.push("");
    }
    for (const it of scoredItems) {
      if (it.excluded) {
        lines.push(`- [NA] ${it.label}`);
      } else {
        const scoreStr = typeof it.score === "number" ? it.score.toString() : "-";
        lines.push(`- [${scoreStr}/${it.maxPoints}] ${it.label}`);
      }
    }
    lines.push("");
    const percent = totalMax > 0 ? `${(Math.round((totalScore / totalMax) * 1000) / 10).toFixed(1)}%` : "-";
    lines.push(`Total: ${totalScore} / ${totalMax} (${percent})`);
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {showPasteArea && (
        <div>
          <label className="block text-sm font-medium mb-2">Paste rubric markdown</label>
          <textarea
            className="w-full h-64 p-3 border rounded-md font-mono text-sm"
            placeholder="Paste lines like: \n- **20** Your page renders correctly\n- **10** Your JSX has valid syntax"
            value={rubricText}
            onChange={e => setRubricText(e.target.value)}
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={onParse}
            >
              Parse rubric
            </button>
            <span className="text-sm text-gray-600">
              Detected items: {rubricItems.length}
            </span>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Scores</h2>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
              onClick={setAllFull}
              disabled={rubricItems.length === 0}
            >
              Full credit
            </button>
            <button
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={clearForm}
              disabled={rubricItems.length === 0}
            >
              Clear
            </button>
            <button
              className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
              onClick={copySummaryToClipboard}
              disabled={rubricItems.length === 0}
            >
              Copy summary
            </button>
          </div>
        </div>

        <div className="border rounded-md divide-y">
          {scoredItems.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No rubric items yet.</div>
          ) : (
            scoredItems.map(item => (
              <div key={item.id} className="p-3 flex items-start gap-3">
                <div className="shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={item.maxPoints}
                    step={1}
                    className="w-20 p-1 border rounded text-right"
                    value={item.excluded ? "" : typeof item.score === "number" ? item.score : ""}
                    disabled={item.excluded}
                    onChange={e => {
                      const raw = e.target.value;
                      const num = raw === "" ? null : Math.max(0, Math.min(item.maxPoints, Number(raw)));
                      setScore(item.id, num as number | null);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const isEmpty = !(typeof item.score === "number") || e.currentTarget.value === "";
                        if (isEmpty) {
                          setScore(item.id, item.maxPoints);
                        }
                        const idx = scoredItems.findIndex(si => si.id === item.id);
                        const next = idx >= 0 ? scoredItems[idx + 1] : undefined;
                        if (next) {
                          const nextEl = inputRefs.current[next.id];
                          if (nextEl) {
                            nextEl.focus();
                            nextEl.select?.();
                          }
                        }
                      }
                    }}
                    ref={el => {
                      inputRefs.current[item.id] = el;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${item.excluded ? "text-gray-400" : ""}`}>{item.label}</div>
                  <div className="text-xs text-gray-500">Max: {item.maxPoints}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    className="px-2 py-1 text-xs bg-green-100 rounded hover:bg-green-200"
                    onClick={() => setScore(item.id, item.maxPoints)}
                  >
                    Full
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                    onClick={() => setScore(item.id, 0)}
                  >
                    Zero
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      item.excluded
                        ? "bg-yellow-200 text-yellow-900 ring-2 ring-yellow-700"
                        : "bg-yellow-100 hover:bg-yellow-200"
                    }`}
                    onClick={() => toggleExcluded(item.id)}
                    aria-pressed={item.excluded}
                  >
                    N/A
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Comments</label>
          <textarea
            className="w-full h-28 p-3 border rounded-md"
            placeholder="General feedback, notes, links, etc."
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-medium">
            Total: {totalScore} / {totalMax}
          </div>
          {totalMax > 0 && (
            <div className="text-sm text-gray-600">
              {(Math.round((totalScore / totalMax) * 1000) / 10).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function hashString(input: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}


