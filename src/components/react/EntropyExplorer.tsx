"use client";
import React, { useState } from "react";

interface Prediction {
  token: string;
  prob: number;
}

interface Token {
  token: string;
  entropy: number;
  display?: string;
  predictions: Prediction[];
}

// Simulated token sequence with realistic entropy values
// Based on calibration data from Qwen2.5-Coder-7B-Instruct on LiveCodeBench
const CODE_TOKENS: Token[] = [
  { token: "def", entropy: 0.41, predictions: [
    { token: "def", prob: 0.72 }, { token: "class", prob: 0.11 }, { token: "from", prob: 0.06 }, { token: "import", prob: 0.05 }, { token: "#", prob: 0.02 },
  ]},
  { token: " solve", entropy: 1.82, predictions: [
    { token: "solve", prob: 0.18 }, { token: "find", prob: 0.14 }, { token: "check", prob: 0.11 }, { token: "get", prob: 0.09 }, { token: "max", prob: 0.07 },
  ]},
  { token: "(", entropy: 0.003, predictions: [
    { token: "(", prob: 0.998 }, { token: "_", prob: 0.001 }, { token: " ", prob: 0.0004 }, { token: "r", prob: 0.0002 }, { token: "d", prob: 0.0001 },
  ]},
  { token: "self", entropy: 0.15, predictions: [
    { token: "self", prob: 0.88 }, { token: "n", prob: 0.04 }, { token: "nums", prob: 0.03 }, { token: "arr", prob: 0.02 }, { token: "s", prob: 0.01 },
  ]},
  { token: ",", entropy: 0.01, predictions: [
    { token: ",", prob: 0.99 }, { token: ")", prob: 0.005 }, { token: ":", prob: 0.002 }, { token: " ", prob: 0.001 }, { token: ";", prob: 0.0005 },
  ]},
  { token: " nums", entropy: 1.43, predictions: [
    { token: "nums", prob: 0.22 }, { token: "n", prob: 0.16 }, { token: "arr", prob: 0.12 }, { token: "grid", prob: 0.08 }, { token: "s", prob: 0.06 },
  ]},
  { token: ":", entropy: 0.008, predictions: [
    { token: ":", prob: 0.995 }, { token: ")", prob: 0.002 }, { token: ",", prob: 0.001 }, { token: " ", prob: 0.0005 }, { token: "=", prob: 0.0003 },
  ]},
  { token: " List", entropy: 0.52, predictions: [
    { token: "List", prob: 0.61 }, { token: "list", prob: 0.15 }, { token: "int", prob: 0.08 }, { token: "str", prob: 0.05 }, { token: "Any", prob: 0.03 },
  ]},
  { token: "[", entropy: 0.002, predictions: [
    { token: "[", prob: 0.998 }, { token: "(", prob: 0.0008 }, { token: " ", prob: 0.0003 }, { token: ",", prob: 0.0002 }, { token: ".", prob: 0.0001 },
  ]},
  { token: "int", entropy: 0.04, predictions: [
    { token: "int", prob: 0.96 }, { token: "str", prob: 0.02 }, { token: "float", prob: 0.008 }, { token: "List", prob: 0.004 }, { token: "Any", prob: 0.002 },
  ]},
  { token: "]", entropy: 0.001, predictions: [
    { token: "]", prob: 0.999 }, { token: ",", prob: 0.0003 }, { token: " ", prob: 0.0002 }, { token: ")", prob: 0.0001 }, { token: "[", prob: 0.00005 },
  ]},
  { token: ")", entropy: 0.002, predictions: [
    { token: ")", prob: 0.998 }, { token: ",", prob: 0.0008 }, { token: "]", prob: 0.0003 }, { token: " ", prob: 0.0002 }, { token: ":", prob: 0.0001 },
  ]},
  { token: " ->", entropy: 0.18, predictions: [
    { token: "->", prob: 0.85 }, { token: ":", prob: 0.10 }, { token: "\n", prob: 0.02 }, { token: " ", prob: 0.01 }, { token: "#", prob: 0.005 },
  ]},
  { token: " int", entropy: 0.31, predictions: [
    { token: "int", prob: 0.74 }, { token: "List", prob: 0.08 }, { token: "bool", prob: 0.06 }, { token: "str", prob: 0.04 }, { token: "None", prob: 0.03 },
  ]},
  { token: ":", entropy: 0.001, predictions: [
    { token: ":", prob: 0.999 }, { token: "\n", prob: 0.0004 }, { token: " ", prob: 0.0002 }, { token: ";", prob: 0.0001 }, { token: ")", prob: 0.00005 },
  ]},
  { token: "\n", entropy: 0.003, display: "\\n", predictions: [
    { token: "\\n", prob: 0.997 }, { token: " ", prob: 0.001 }, { token: "#", prob: 0.0005 }, { token: "\\t", prob: 0.0003 }, { token: ")", prob: 0.0001 },
  ]},
  { token: "    ", entropy: 0.01, display: "····", predictions: [
    { token: "    ", prob: 0.99 }, { token: "  ", prob: 0.004 }, { token: "\\t", prob: 0.002 }, { token: "return", prob: 0.001 }, { token: "#", prob: 0.0008 },
  ]},
  { token: "seen", entropy: 1.95, predictions: [
    { token: "seen", prob: 0.15 }, { token: "result", prob: 0.12 }, { token: "ans", prob: 0.10 }, { token: "dp", prob: 0.09 }, { token: "n", prob: 0.08 },
  ]},
  { token: " =", entropy: 0.02, predictions: [
    { token: "=", prob: 0.98 }, { token: ",", prob: 0.006 }, { token: ".", prob: 0.004 }, { token: " ", prob: 0.003 }, { token: "[", prob: 0.002 },
  ]},
  { token: " set", entropy: 1.21, predictions: [
    { token: "set", prob: 0.28 }, { token: "dict", prob: 0.14 }, { token: "{}", prob: 0.11 }, { token: "[]", prob: 0.09 }, { token: "0", prob: 0.07 },
  ]},
  { token: "(", entropy: 0.05, predictions: [
    { token: "(", prob: 0.95 }, { token: " ", prob: 0.02 }, { token: "[", prob: 0.01 }, { token: "{", prob: 0.005 }, { token: ".", prob: 0.003 },
  ]},
  { token: ")", entropy: 0.003, predictions: [
    { token: ")", prob: 0.997 }, { token: "nums", prob: 0.001 }, { token: "[", prob: 0.0005 }, { token: " ", prob: 0.0003 }, { token: "{", prob: 0.0002 },
  ]},
];

const FORK_THRESHOLD = 0.23;

function isFork(entropy: number): boolean {
  return entropy >= FORK_THRESHOLD;
}

const ForksLocksDemo: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const selected = selectedIdx !== null ? CODE_TOKENS[selectedIdx] : null;
  const selectedIsFork = selected ? isFork(selected.entropy) : false;

  return (
    <div className="not-prose my-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Token sequence in terminal style */}
      <div className="bg-gray-950 px-5 py-4 sm:px-6 sm:py-5">
        <div className="text-sm text-gray-500 mb-3 font-medium">Click any token</div>
        <div className="flex flex-wrap gap-1.5 font-mono text-base sm:text-lg leading-relaxed">
          {CODE_TOKENS.map((t, i) => {
            const fork = isFork(t.entropy);
            const isSelected = i === selectedIdx;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i === selectedIdx ? null : i)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer border ${
                  isSelected
                    ? fork
                      ? "bg-emerald-500 text-white border-emerald-400"
                      : "bg-gray-500 text-white border-gray-400"
                    : fork
                      ? "bg-emerald-900/40 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/60"
                      : "bg-gray-800/60 text-gray-400 border-gray-700/50 hover:bg-gray-700/60"
                }`}
              >
                {t.display || t.token}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Selected token detail */}
        {selected ? (
          <div className={`rounded-lg p-4 text-sm ${
            selectedIsFork
              ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          }`}>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                selectedIsFork
                  ? "bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
                {selectedIsFork ? "Fork" : "Lock"}
              </span>
              <span className="font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
                "{selected.display || selected.token}"
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Entropy: <span className="font-mono font-medium">{selected.entropy.toFixed(3)}</span> nats.
              {selectedIsFork
                ? " Multiple plausible continuations compete."
                : selected.entropy < 0.01
                  ? " Near-zero entropy. One answer, no real competition."
                  : " Low entropy. The model has a clear preference."
              }
            </p>
            {/* Top 5 predictions */}
            <div className="mt-3 space-y-1">
              {selected.predictions.map((p, i) => {
                const maxProb = selected.predictions[0].prob;
                const barWidth = Math.max((p.prob / maxProb) * 100, 0.5);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`font-mono text-xs w-14 shrink-0 truncate ${
                      i === 0
                        ? selectedIsFork ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-gray-700 dark:text-gray-200 font-semibold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {p.token}
                    </span>
                    <div className="flex-1 h-5 bg-gray-200/60 dark:bg-gray-700/40 rounded overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          i === 0
                            ? selectedIsFork ? "bg-emerald-500 dark:bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"
                            : selectedIsFork ? "bg-emerald-300 dark:bg-emerald-700" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className={`font-mono text-xs w-14 text-right shrink-0 tabular-nums ${
                      i === 0
                        ? selectedIsFork ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-gray-700 dark:text-gray-200 font-semibold"
                        : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {p.prob >= 0.01
                        ? `${(p.prob * 100).toFixed(1)}%`
                        : p.prob >= 0.001
                          ? `${(p.prob * 100).toFixed(2)}%`
                          : `${(p.prob * 100).toFixed(3)}%`
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            Click a token above to see its entropy. The green tokens are forks (uncertain), the gray tokens are locks (certain).
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-600 dark:bg-gray-500"></div>
            <span className="text-gray-500 dark:text-gray-400">Lock — entropy &lt; 0.23 nats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-gray-500 dark:text-gray-400">Fork — entropy &ge; 0.23 nats</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForksLocksDemo;
