"use client";
import React, { useState, useEffect, useRef } from "react";

interface TokenCandidate {
  token: string;
  logit: number;
  prob: number;
}

interface Example {
  label: string;
  context: string[];
  cursor: string;
  candidates: TokenCandidate[];
  restCount: number;
  restProbSum: number;
}

const EXAMPLES: Example[] = [
  {
    label: "Uncertain",
    context: ["def"],
    cursor: " ???",
    candidates: [
      { token: "solve", logit: 3.2, prob: 0.18 },
      { token: "find", logit: 2.9, prob: 0.14 },
      { token: "check", logit: 2.6, prob: 0.11 },
      { token: "get", logit: 2.4, prob: 0.09 },
      { token: "max", logit: 2.1, prob: 0.07 },
      { token: "count", logit: 1.9, prob: 0.05 },
      { token: "is", logit: 1.7, prob: 0.04 },
      { token: "min", logit: 1.5, prob: 0.03 },
    ],
    restCount: 149992,
    restProbSum: 0.29,
  },
  {
    label: "Confident",
    context: ["def", " solve"],
    cursor: "(",
    candidates: [
      { token: "(", logit: 8.7, prob: 0.998 },
      { token: "_", logit: 2.1, prob: 0.0013 },
      { token: " ", logit: 1.5, prob: 0.0007 },
      { token: "r", logit: 0.4, prob: 0.0002 },
      { token: "d", logit: -0.3, prob: 0.0001 },
      { token: ":", logit: -1.2, prob: 0.00005 },
      { token: "s", logit: -1.8, prob: 0.00003 },
      { token: "[", logit: -2.1, prob: 0.00002 },
    ],
    restCount: 149992,
    restProbSum: 0.00003,
  },
];

function useTypewriter(text: string, speed: number = 80): string {
  const [displayed, setDisplayed] = useState("");
  const prevText = useRef(text);

  useEffect(() => {
    if (text !== prevText.current) {
      setDisplayed("");
      prevText.current = text;
    }

    if (displayed.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, displayed, speed]);

  return displayed;
}

const LogitsDemo: React.FC = () => {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [showProbs, setShowProbs] = useState(false);
  const example = EXAMPLES[exampleIdx];

  const cursorText = useTypewriter(example.cursor, 100);

  const maxLogit = Math.max(...example.candidates.map(c => c.logit));
  const minLogit = Math.min(...example.candidates.map(c => c.logit));
  const logitRange = maxLogit - minLogit;
  const maxProb = Math.max(...example.candidates.map(c => c.prob));

  return (
    <div className="not-prose my-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Terminal header */}
      <div className="bg-gray-950 px-5 py-4 sm:px-6 sm:py-5">
        <div className="font-mono text-base sm:text-lg leading-relaxed overflow-x-auto">
          <span className="text-gray-500 select-none">{">>> "}</span>
          {example.context.map((t, i) => (
            <span key={i} className="text-gray-300">{t}</span>
          ))}
          <span className="text-emerald-400">{cursorText}</span>
          <span
            className="inline-block w-[2px] h-[1.2em] bg-emerald-400 align-text-bottom ml-px"
            style={{ animation: "logits-blink 1s step-end infinite" }}
          />
        </div>
        <style>{`@keyframes logits-blink { 50% { opacity: 0; } }`}</style>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setExampleIdx(i); setShowProbs(false); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  exampleIdx === i
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowProbs(!showProbs)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              showProbs
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {showProbs ? "Show logits" : "Apply softmax"}
          </button>
        </div>

        {/* Column header */}
        <div className="flex items-center gap-3 mb-2 pl-9">
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-16 shrink-0">token</span>
          <div className="flex-1" />
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-20 text-right shrink-0">
            {showProbs ? "probability" : "logit"}
          </span>
        </div>

        {/* Candidate list */}
        <div className="space-y-1.5 mb-4">
          {example.candidates.map((c, i) => {
            const barWidth = showProbs
              ? Math.max((c.prob / maxProb) * 100, 0.5)
              : Math.max(((c.logit - minLogit) / logitRange) * 100, 2);

            return (
              <div key={`${exampleIdx}-${i}`} className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-6 text-right shrink-0">
                  {i + 1}
                </span>
                <span className={`font-mono text-sm sm:text-base w-16 shrink-0 truncate ${
                  i === 0
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {c.token}
                </span>
                <div className="flex-1 h-7 sm:h-8 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-md transition-all duration-500 ease-out ${
                      i === 0
                        ? "bg-emerald-500 dark:bg-emerald-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className={`font-mono text-sm w-20 text-right shrink-0 tabular-nums ${
                  i === 0
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-gray-400 dark:text-gray-500"
                }`}>
                  {showProbs
                    ? c.prob >= 0.01
                      ? `${(c.prob * 100).toFixed(1)}%`
                      : c.prob >= 0.001
                        ? `${(c.prob * 100).toFixed(2)}%`
                        : `${(c.prob * 100).toFixed(3)}%`
                    : c.logit.toFixed(1)
                  }
                </span>
              </div>
            );
          })}
        </div>

        {/* The long tail */}
        <div className="flex items-center gap-3 pl-9 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
          <span className="w-16 shrink-0 font-mono text-gray-300 dark:text-gray-600">
            + {example.restCount.toLocaleString()}
          </span>
          <span>
            more tokens
            {showProbs && (
              <span>
                , sharing {(example.restProbSum * 100).toFixed(
                  example.restProbSum < 0.01 ? 3 : 1
                )}% of probability
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogitsDemo;
