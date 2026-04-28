"use client";
import React, { useState } from "react";

type ConfigKey = "baseline" | "adaptive" | "ssd" | "ssd_adaptive";

interface ConfigInfo {
  key: ConfigKey;
  label: string;
  shortLabel: string;
  pass1: number;
  pass5: number;
  color: string;
  description: string;
}

const CONFIGS: ConfigInfo[] = [
  {
    key: "baseline",
    label: "Baseline",
    shortLabel: "Base",
    pass1: 26.7,
    pass5: 40.0,
    color: "bg-gray-400 dark:bg-gray-500",
    description: "Fixed decoding: T=0.7, top_k=20, top_p=0.8",
  },
  {
    key: "ssd",
    label: "SSD",
    shortLabel: "SSD",
    pass1: 31.3,
    pass5: 40.0,
    color: "bg-emerald-500 dark:bg-emerald-400",
    description: "Self-distilled: LoRA fine-tune on 267 correct completions, 4 min training",
  },
];

// Generalisation data
const GENERALISATION = {
  train: { baseline: 10.8, ssd: 13.6 },
  test: { baseline: 33.1, ssd: 38.4 },
};

type View = "overview" | "generalisation";

const SSDResultsDemo: React.FC = () => {
  const [view, setView] = useState<View>("overview");

  const maxPass1 = Math.max(...CONFIGS.map(c => c.pass1));

  return (
    <div className="not-prose my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            SSD vs Decode-Time Tricks
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">
            Qwen2.5-Coder-1.5B on LiveCodeBench v6. 175 problems, 5 samples each.
          </p>
        </div>
        <div className="flex gap-1.5">
          {([
            { key: "overview" as View, label: "Results" },
            { key: "generalisation" as View, label: "Generalisation" },
          ]).map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                view === v.key
                  ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "overview" && (
        <>
          {/* Bar chart */}
          <div className="space-y-3 mb-6">
            {CONFIGS.map(config => {
              const delta = config.pass1 - CONFIGS[0].pass1;
              return (
                <div
                  key={config.key}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-28 text-right shrink-0">
                      {config.label}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg transition-all duration-500 ${config.color}`}
                          style={{ width: `${(config.pass1 / (maxPass1 + 5)) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 w-28 shrink-0">
                        <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
                          {config.pass1}%
                        </span>
                        {delta !== 0 && (
                          <span className={`text-xs font-mono font-medium ${
                            delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                          }`}>
                            {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
            pass@5 stays at ~40% for both. The model can solve the same problems.
            SSD makes it more reliable on the first try.
          </div>
        </>
      )}

      {view === "generalisation" && (
        <>
          {/* Train vs Test comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {([
              { label: "Train (50 problems)", data: GENERALISATION.train },
              { label: "Test (125 unseen)", data: GENERALISATION.test },
            ]).map(split => {
              const delta = split.data.ssd - split.data.baseline;
              return (
                <div key={split.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{split.label}</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Baseline</span>
                        <span className="font-mono">{split.data.baseline}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full" style={{ width: `${(split.data.baseline / 45) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>SSD</span>
                        <span className="font-mono">{split.data.ssd}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" style={{ width: `${(split.data.ssd / 45) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className={`mt-2 text-center text-lg font-bold ${delta > 3 ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-500"}`}>
                    +{delta.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insight */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
            SSD was trained on 50 problems. The gains are larger on the 125 it never saw (+5.3% vs +2.8%).
            The model learns better coding distributions, not memorised solutions.
          </div>
        </>
      )}
    </div>
  );
};

export default SSDResultsDemo;
