"use client";
import React, { useState, useCallback } from "react";

type Place =
  | "codePending"
  | "humanApproval"
  | "approved"
  | "codeDone";

type Marking = Record<Place, number>;

interface Transition {
  name: string;
  inputs: Place[];
  outputs: Place[];
}

const TRANSITIONS: Transition[] = [
  { name: "requestApproval", inputs: ["codePending"], outputs: ["humanApproval"] },
  { name: "approve", inputs: ["humanApproval"], outputs: ["approved"] },
  { name: "reject", inputs: ["humanApproval"], outputs: ["codeDone"] },
  { name: "executeCode", inputs: ["approved"], outputs: ["codeDone"] },
];

const INITIAL_MARKING: Marking = {
  codePending: 1,
  humanApproval: 0,
  approved: 0,
  codeDone: 0,
};

function canFire(marking: Marking, t: Transition): boolean {
  return t.inputs.every((p) => marking[p] > 0);
}

function fire(marking: Marking, t: Transition): Marking {
  const m = { ...marking };
  t.inputs.forEach((p) => (m[p] -= 1));
  t.outputs.forEach((p) => (m[p] += 1));
  return m;
}

// --- SVG Layout ---

const R = 48;
const TW = 130;
const TH = 36;

const placePos: Record<Place, { x: number; y: number }> = {
  codePending:   { x: 75,  y: 200 },
  humanApproval: { x: 330, y: 200 },
  approved:      { x: 580, y: 120 },
  codeDone:      { x: 830, y: 200 },
};

const transPos: { x: number; y: number }[] = [
  { x: 200, y: 200 },  // requestApproval
  { x: 455, y: 120 },  // approve
  { x: 530, y: 300 },  // reject
  { x: 710, y: 120 },  // executeCode
];

function circleEdge(cx: number, cy: number, tx: number, ty: number) {
  const dx = tx - cx, dy = ty - cy;
  const d = Math.hypot(dx, dy);
  return { x: cx + R * dx / d, y: cy + R * dy / d };
}

function rectEdge(rx: number, ry: number, tx: number, ty: number) {
  const dx = tx - rx, dy = ty - ry;
  if (dx === 0 && dy === 0) return { x: rx, y: ry };
  const sx = Math.abs(dx) > 0.001 ? (TW / 2) / Math.abs(dx) : Infinity;
  const sy = Math.abs(dy) > 0.001 ? (TH / 2) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: rx + s * dx, y: ry + s * dy };
}

interface Edge { x1: number; y1: number; x2: number; y2: number }

const edges: Edge[] = [];
TRANSITIONS.forEach((t, i) => {
  const tp = transPos[i];
  for (const inp of t.inputs) {
    const pp = placePos[inp];
    const start = circleEdge(pp.x, pp.y, tp.x, tp.y);
    const end = rectEdge(tp.x, tp.y, pp.x, pp.y);
    edges.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
  }
  for (const out of t.outputs) {
    const pp = placePos[out];
    const start = rectEdge(tp.x, tp.y, pp.x, pp.y);
    const end = circleEdge(pp.x, pp.y, tp.x, tp.y);
    edges.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
  }
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const REJECT_TRANSITIONS = new Set(["reject"]);
const REJECTED_PLACES = new Set<Place>([]);

const HumanGateDemo: React.FC = () => {
  const [marking, setMarking] = useState<Marking>(INITIAL_MARKING);
  const [lastAction, setLastAction] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [fired, setFired] = useState<Set<string>>(new Set());

  const handleFire = useCallback((t: Transition) => {
    if (!canFire(marking, t)) return;
    setMarking(fire(marking, t));
    setLastAction(`Fired ${t.name}`);
    setStepCount((n) => n + 1);
    setFired((prev) => new Set(prev).add(t.name));
  }, [marking]);

  const reset = useCallback(() => {
    setMarking(INITIAL_MARKING);
    setLastAction("");
    setStepCount(0);
    setFired(new Set());
  }, []);

  const done = marking.codeDone > 0;
  const noEnabled = TRANSITIONS.every((t) => !canFire(marking, t));

  let statusText: React.ReactNode;
  if (stepCount === 0) {
    statusText = <span className="text-gray-400 dark:text-gray-500">Click requestApproval to begin - try to reach codeDone without going through humanApproval</span>;
  } else if (done && fired.has("reject")) {
    statusText = <>{lastAction}. Code rejected - codeDone reached via humanApproval, no execution.</>;
  } else if (done) {
    statusText = <>{lastAction}. Code executed safely - every path went through humanApproval.</>;
  } else if (noEnabled) {
    statusText = <>{lastAction}. No transitions can fire.</>;
  } else {
    statusText = lastAction;
  }

  return (
    <div className="not-prose my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative w-full md:w-[calc(100%+20rem)] md:-ml-40 max-w-[calc(100vw-2rem)] overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Human Gate</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">There is no arc from codePending to executeCode. Every path goes through humanApproval.</p>
        </div>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* SVG Diagram */}
      <div className="overflow-x-auto mb-6">
      <svg viewBox="0 0 910 380" className="w-full min-w-[910px]">
        <defs>
          <marker
            id="gate-arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>

        {/* Arrows */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={1.5}
            markerEnd="url(#gate-arrow)"
          />
        ))}

        {/* Places (circles) */}
        {(Object.keys(placePos) as Place[]).map((id) => {
          const { x, y } = placePos[id];
          const tokens = marking[id];
          const has = tokens > 0;
          const isRejected = REJECTED_PLACES.has(id);
          return (
            <g key={id}>
              <circle
                cx={x} cy={y} r={R}
                className={`transition-all duration-300 ${
                  has
                    ? isRejected
                      ? "fill-rose-50 dark:fill-rose-950 stroke-rose-500 dark:stroke-rose-500"
                      : "fill-emerald-50 dark:fill-emerald-950 stroke-emerald-500 dark:stroke-emerald-500"
                    : "fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
                }`}
                strokeWidth={1.5}
              />
              <text
                x={x} y={y - 7}
                textAnchor="middle" dominantBaseline="middle"
                className="fill-gray-700 dark:fill-gray-300"
                style={{ fontSize: 11, fontFamily: MONO }}
              >
                {id}
              </text>
              <text
                x={x} y={y + 14}
                textAnchor="middle" dominantBaseline="middle"
                className={`transition-all duration-300 font-semibold ${
                  has
                    ? isRejected
                      ? "fill-rose-600 dark:fill-rose-400"
                      : "fill-emerald-600 dark:fill-emerald-400"
                    : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 15 }}
              >
                {tokens}
              </text>
            </g>
          );
        })}

        {/* Transitions (rectangles) */}
        {TRANSITIONS.map((t, i) => {
          const { x, y } = transPos[i];
          const enabled = canFire(marking, t);
          const wasFired = fired.has(t.name);
          const isReject = REJECT_TRANSITIONS.has(t.name);
          return (
            <g
              key={t.name}
              onClick={() => handleFire(t)}
              style={{ cursor: enabled ? "pointer" : "default" }}
              role="button"
              tabIndex={enabled ? 0 : undefined}
            >
              <rect
                x={x - TW / 2} y={y - TH / 2}
                width={TW} height={TH}
                rx={3}
                className={`transition-all duration-300 ${
                  enabled
                    ? isReject
                      ? "fill-rose-500 stroke-rose-600"
                      : "fill-blue-500 stroke-blue-600"
                    : wasFired
                      ? isReject
                        ? "fill-rose-100 dark:fill-rose-900/30 stroke-rose-400 dark:stroke-rose-600"
                        : "fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-600"
                      : "fill-gray-200 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"
                }`}
                strokeWidth={1.5}
              />
              <text
                x={x} y={y + 1}
                textAnchor="middle" dominantBaseline="middle"
                className={`pointer-events-none transition-all duration-300 ${
                  enabled
                    ? "fill-white"
                    : wasFired
                      ? isReject
                        ? "fill-rose-700 dark:fill-rose-400"
                        : "fill-emerald-700 dark:fill-emerald-400"
                      : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 11, fontFamily: MONO }}
              >
                {wasFired && !enabled ? `\u2713 ${t.name}` : t.name}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {/* Status line */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        {statusText}
      </div>
    </div>
  );
};

export default HumanGateDemo;
