"use client";
import React, { useState, useMemo } from "react";

interface TokenCandidate {
  token: string;
  logit: number;
}

interface Example {
  label: string;
  context: string;
  candidates: TokenCandidate[];
  restCount: number;
}

const EXAMPLES: Example[] = [
  {
    label: "Uncertain",
    context: "def ",
    candidates: [
      { token: "solve", logit: 3.2 },
      { token: "find", logit: 2.9 },
      { token: "check", logit: 2.6 },
      { token: "get", logit: 2.4 },
      { token: "max", logit: 2.1 },
      { token: "count", logit: 1.9 },
      { token: "is", logit: 1.7 },
      { token: "min", logit: 1.5 },
    ],
    restCount: 149992,
  },
  {
    label: "Confident",
    context: "def solve",
    candidates: [
      { token: "(", logit: 8.7 },
      { token: "_", logit: 2.1 },
      { token: " ", logit: 1.5 },
      { token: "r", logit: 0.4 },
      { token: "d", logit: -0.3 },
      { token: ":", logit: -1.2 },
      { token: "s", logit: -1.8 },
      { token: "[", logit: -2.1 },
    ],
    restCount: 149992,
  },
];

function softmaxWithTemp(logits: number[], temp: number): number[] {
  const scaled = logits.map(l => l / temp);
  const maxScaled = Math.max(...scaled);
  const exps = scaled.map(s => Math.exp(s - maxScaled));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

const TEMP_PRESETS = [
  { value: 0.1, label: "0.1" },
  { value: 0.7, label: "0.7" },
  { value: 1.0, label: "1.0" },
  { value: 1.5, label: "1.5" },
  { value: 2.0, label: "2.0" },
];

const TemperatureDemo: React.FC = () => {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [temperature, setTemperature] = useState(1.0);
  const example = EXAMPLES[exampleIdx];

  const logits = example.candidates.map(c => c.logit);
  const probs = useMemo(() => softmaxWithTemp(logits, temperature), [logits, temperature]);
  const probsAtOne = useMemo(() => softmaxWithTemp(logits, 1.0), [logits]);
  const maxProb = Math.max(...probs);

  // Effective rest probability (approximate)
  const shownProbSum = probs.reduce((a, b) => a + b, 0);
  const restProb = Math.max(0, 1 - shownProbSum);

  const tempLabel = temperature <= 0.15
    ? "Near-greedy. Top token dominates."
    : temperature <= 0.5
      ? "Low. Sharpens the distribution. Fewer surprises."
      : temperature <= 0.85
        ? "Moderate. The default for most code generation."
        : temperature <= 1.05
          ? "Neutral. The model's raw distribution, unchanged."
          : temperature <= 1.5
            ? "High. Flattens the distribution. More diversity, more noise."
            : "Very high. Almost uniform. The model's rankings barely matter.";

  return (
    <div className="not-prose my-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Terminal header */}
      <div className="bg-gray-950 px-5 py-4 sm:px-6 sm:py-5">
        <div className="font-mono text-base sm:text-lg leading-relaxed">
          <span className="text-gray-500 select-none">{">>> "}</span>
          <span className="text-gray-300">{example.context}</span>
          <span className="text-emerald-400">{example.candidates[0].token}</span>
          <span className="text-gray-500 ml-2">
            {" "}← p={((probs[0]) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Controls row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setExampleIdx(i)}
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
        </div>

        {/* Temperature slider */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Temperature
            </label>
            <input
              type="range"
              min={0.05}
              max={2.5}
              step={0.05}
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-500 h-2"
            />
            <span className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100 w-12 text-right tabular-nums">
              {temperature.toFixed(2)}
            </span>
          </div>
          {/* Presets */}
          <div className="flex gap-1.5 mb-2">
            {TEMP_PRESETS.map(p => (
              <button
                key={p.value}
                onClick={() => setTemperature(p.value)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  Math.abs(temperature - p.value) < 0.01
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tempLabel}
          </p>
        </div>

        {/* Column header */}
        <div className="flex items-center gap-3 mb-2 pl-9">
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-16 shrink-0">token</span>
          <div className="flex-1" />
          <span className="font-mono text-xs text-gray-400 dark:text-gray-500 w-20 text-right shrink-0">
            probability
          </span>
        </div>

        {/* Candidate bars */}
        <div className="space-y-1.5 mb-4">
          {example.candidates.map((c, i) => {
            const prob = probs[i];
            const barWidth = Math.max((prob / maxProb) * 100, 0.3);
            const origProb = probsAtOne[i];
            const delta = prob - origProb;

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
                    className={`h-full rounded-md transition-all duration-150 ease-out ${
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
                  {prob >= 0.01
                    ? `${(prob * 100).toFixed(1)}%`
                    : prob >= 0.001
                      ? `${(prob * 100).toFixed(2)}%`
                      : `${(prob * 100).toFixed(3)}%`
                  }
                </span>
              </div>
            );
          })}
        </div>

        {/* Long tail */}
        <div className="flex items-center gap-3 pl-9 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
          <span className="w-16 shrink-0 font-mono text-gray-300 dark:text-gray-600">
            + {example.restCount.toLocaleString()}
          </span>
          <span>more tokens</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureDemo;
