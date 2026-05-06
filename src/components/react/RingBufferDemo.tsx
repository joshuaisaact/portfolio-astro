"use client";
import React, { useState } from "react";

const SLOT_COUNT = 8;
const SLOT_W = 52;
const SLOT_H = 28;
const RADIUS = 88;
const CENTER = 128;

type SlotStatus = "empty" | "filled" | "evicting" | "new";

interface Step {
  slots: SlotStatus[];
  head: number;
  tail: number;
  isWrapPoint: boolean;
  label: string;
  description: string;
  externalStore?: string;
}

const STEPS: Step[] = [
  {
    slots: Array(8).fill("empty") as SlotStatus[],
    head: 0,
    tail: 0,
    isWrapPoint: false,
    label: "Empty buffer",
    description:
      "An empty ring buffer. The tail writes incoming content; the head marks the oldest region, which gets overwritten first when the buffer fills.",
  },
  {
    slots: ["filled", "filled", "filled", "filled", "empty", "empty", "empty", "empty"],
    head: 0,
    tail: 4,
    isWrapPoint: false,
    label: "Filling up",
    description:
      "Conversation turns arrive and fill slots. The tail advances with each new turn.",
  },
  {
    slots: ["filled", "filled", "filled", "filled", "filled", "filled", "filled", "empty"],
    head: 0,
    tail: 7,
    isWrapPoint: false,
    label: "Nearly full",
    description:
      "One slot left. The tail is one step from the head — that's the wrap point.",
  },
  {
    slots: Array(8).fill("filled") as SlotStatus[],
    head: 0,
    tail: 0,
    isWrapPoint: true,
    label: "Wrap point",
    description:
      "Full. The tail has caught the head. The next write would overwrite slot 0 — the oldest content. A naive implementation just overwrites. But knowing this is coming gives you a choice.",
  },
  {
    slots: ["evicting", "filled", "filled", "filled", "filled", "filled", "filled", "filled"],
    head: 0,
    tail: 0,
    isWrapPoint: true,
    label: "Flush before eviction",
    description:
      "Before overwriting, summarise slot 0 and store it externally. Cheaper to hold than the original, retrievable on demand. Nothing is permanently lost.",
  },
  {
    slots: ["new", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    head: 1,
    tail: 1,
    isWrapPoint: false,
    label: "Eviction complete",
    description:
      "Slot 0 holds a new turn. The head advances to slot 1. The old content isn't gone — it's in the external store, retrievable on demand.",
    externalStore: "Summary: turns 1–8",
  },
];

function slotClasses(status: SlotStatus, isWrapSlot: boolean): string {
  const base =
    "absolute flex items-center justify-center rounded text-xs font-mono font-semibold border-2 transition-all duration-300 select-none";
  if (status === "evicting")
    return `${base} bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-500`;
  if (status === "new")
    return `${base} bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-500 dark:border-emerald-600`;
  if (status === "filled")
    return isWrapSlot
      ? `${base} bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-500 ring-2 ring-rose-300 dark:ring-rose-700`
      : `${base} bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700`;
  return `${base} bg-gray-50 dark:bg-gray-800/60 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 border-dashed`;
}

const SLOT_DELAY = 100;
const FADE_DELAY = 120;

const RingBufferDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [displaySlots, setDisplaySlots] = useState<SlotStatus[]>([...STEPS[0].slots]);
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);
  const s = STEPS[step];

  const go = (next: number) => {
    if (animating || next === step) return;

    const targetSlots = STEPS[next].slots;
    const isForward = next > step;

    const changes = displaySlots.reduce<{ idx: number; to: SlotStatus }[]>((acc, cur, i) => {
      if (cur !== targetSlots[i]) acc.push({ idx: i, to: targetSlots[i] });
      return acc;
    }, []);

    if (!isForward) changes.reverse();

    setAnimating(true);
    setVisible(false);

    if (changes.length === 0) {
      setStep(next);
      setAnimating(false);
      setVisible(true);
      return;
    }

    let slots = [...displaySlots];
    changes.forEach(({ idx, to }, i) => {
      setTimeout(() => {
        slots = [...slots];
        slots[idx] = to;
        setDisplaySlots(slots);
      }, i * SLOT_DELAY);
    });

    setTimeout(() => {
      setStep(next);
      setAnimating(false);
      setVisible(true);
    }, changes.length * SLOT_DELAY + FADE_DELAY);
  };

  return (
    <div className="not-prose my-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-col items-center gap-5">

        {/* Ring + external store side by side */}
        <div className="flex items-center gap-4">
          {/* Ring */}
          <div className="relative shrink-0" style={{ width: CENTER * 2, height: CENTER * 2 }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256" style={{ pointerEvents: "none" }}>
              <circle cx="128" cy="128" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="text-gray-600 dark:text-gray-600" />
            </svg>
            {Array.from({ length: SLOT_COUNT }, (_, i) => {
              const angle = (i / SLOT_COUNT) * 2 * Math.PI - Math.PI / 2;
              const cx = CENTER + Math.cos(angle) * RADIUS;
              const cy = CENTER + Math.sin(angle) * RADIUS;
              const isHead = i === s.head;
              const isTail = i === s.tail;
              const isWrapSlot = s.isWrapPoint && i === s.head;

              const badgeOffset = RADIUS + 22;
              const badgeX = CENTER + Math.cos(angle) * badgeOffset;
              const badgeY = CENTER + Math.sin(angle) * badgeOffset;

              const showHead = isHead && !s.isWrapPoint;
              const showTail = isTail && !s.isWrapPoint && i !== s.head;
              const showWrap = s.isWrapPoint && i === s.head;

              return (
                <React.Fragment key={i}>
                  <div
                    className={slotClasses(displaySlots[i], isWrapSlot)}
                    style={{
                      left: cx - SLOT_W / 2,
                      top: cy - SLOT_H / 2,
                      width: SLOT_W,
                      height: SLOT_H,
                    }}
                  >
                    {i}
                  </div>
                  {(showHead || showTail || showWrap) && (
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        left: badgeX - 20,
                        top: badgeY - 8,
                        width: 40,
                        height: 16,
                      }}
                    >
                      <span
                        className={`text-[9px] font-bold leading-none whitespace-nowrap ${
                          showWrap
                            ? "text-rose-600 dark:text-rose-400"
                            : showHead
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-teal-600 dark:text-teal-400"
                        }`}
                      >
                        {showWrap ? "head+tail" : showHead ? "head" : "tail"}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* External store — right of ring, slides in on final step */}
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: s.externalStore ? "120px" : "0px", opacity: s.externalStore ? 1 : 0 }}
          >
            <div className="w-[120px] rounded-lg border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2">
              <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block">
                External store
              </span>
              <p className="mt-1 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] leading-snug">
                {s.externalStore}
              </p>
            </div>
          </div>
        </div>

        {/* Label + description with fade */}
        <div
          className="w-full max-w-sm text-center transition-opacity duration-150 min-h-[8rem]"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {s.label}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{s.description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => go(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={() => go(Math.min(STEPS.length - 1, step + 1))}
            disabled={step === STEPS.length - 1}
            className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs pt-3 border-t border-gray-100 dark:border-gray-800 w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/60" />
            <span className="text-gray-500 dark:text-gray-400">Empty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded border-2 border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/40" />
            <span className="text-gray-500 dark:text-gray-400">Filled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded border-2 border-rose-500 bg-rose-100 dark:bg-rose-900/40" />
            <span className="text-gray-500 dark:text-gray-400">Wrap point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded border-2 border-amber-400 dark:border-amber-500 bg-amber-100 dark:bg-amber-900/50" />
            <span className="text-gray-500 dark:text-gray-400">Flushing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded border-2 border-emerald-500 dark:border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40" />
            <span className="text-gray-500 dark:text-gray-400">New write</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingBufferDemo;
