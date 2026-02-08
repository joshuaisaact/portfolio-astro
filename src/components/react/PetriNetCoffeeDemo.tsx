"use client";
import React, { useState, useCallback } from "react";

type CoffeePlace =
  | "waterCold"
  | "waterHot"
  | "beansWhole"
  | "beansGround"
  | "cupEmpty"
  | "coffeeReady";

type Marking = Record<CoffeePlace, number>;

interface Transition {
  name: string;
  inputs: CoffeePlace[];
  outputs: CoffeePlace[];
}

const TRANSITIONS: Transition[] = [
  { name: "heatWater", inputs: ["waterCold"], outputs: ["waterHot"] },
  { name: "grindBeans", inputs: ["beansWhole"], outputs: ["beansGround"] },
  { name: "pourOver", inputs: ["waterHot", "beansGround", "cupEmpty"], outputs: ["coffeeReady"] },
];

const INITIAL_MARKING: Marking = {
  waterCold: 1, waterHot: 0,
  beansWhole: 1, beansGround: 0,
  cupEmpty: 1, coffeeReady: 0,
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

// --- SVG Layout (matches Graphviz topology from petri-net/src/examples/coffee) ---

const R = 54;   // place circle radius
const TW = 118; // transition rect width
const TH = 42;  // transition rect height

const placePos: Record<CoffeePlace, { x: number; y: number }> = {
  waterCold:    { x: 75,  y: 75 },
  waterHot:     { x: 370, y: 75 },
  beansWhole:   { x: 75,  y: 215 },
  beansGround:  { x: 370, y: 215 },
  cupEmpty:     { x: 340, y: 345 },
  coffeeReady:  { x: 710, y: 215 },
};

const transPos: { x: number; y: number }[] = [
  { x: 215, y: 75 },  // heatWater
  { x: 215, y: 215 }, // grindBeans
  { x: 540, y: 215 }, // pourOver
];

// Compute arrow endpoints from circle/rect boundaries

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

const PetriNetCoffeeDemo: React.FC = () => {
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

  const allDone = marking.coffeeReady > 0;

  return (
    <div className="not-prose my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative w-full md:w-[calc(100%+20rem)] md:-ml-40 max-w-[calc(100vw-2rem)] overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Making Coffee</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">Click an enabled transition to fire it — heatWater and grindBeans can fire in either order</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/joshuaisaact/petri-net/blob/main/src/examples/coffee/net.ts"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            title="View source on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          </a>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="overflow-x-auto mb-6">
      <svg viewBox="0 0 785 420" className="w-full min-w-[785px]">
        <defs>
          <marker
            id="petri-arrow"
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
            markerEnd="url(#petri-arrow)"
          />
        ))}

        {/* Places (circles) */}
        {(Object.keys(placePos) as CoffeePlace[]).map((id) => {
          const { x, y } = placePos[id];
          const tokens = marking[id];
          const has = tokens > 0;
          return (
            <g key={id}>
              <circle
                cx={x} cy={y} r={R}
                className={`transition-all duration-300 ${
                  has
                    ? "fill-emerald-50 dark:fill-emerald-950 stroke-emerald-500 dark:stroke-emerald-500"
                    : "fill-white dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600"
                }`}
                strokeWidth={1.5}
              />
              <text
                x={x} y={y - 7}
                textAnchor="middle" dominantBaseline="middle"
                className="fill-gray-700 dark:fill-gray-300"
                style={{ fontSize: 14, fontFamily: MONO }}
              >
                {id}
              </text>
              <text
                x={x} y={y + 14}
                textAnchor="middle" dominantBaseline="middle"
                className={`transition-all duration-300 font-semibold ${
                  has ? "fill-emerald-600 dark:fill-emerald-400" : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 18 }}
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
                    ? "fill-blue-500 stroke-blue-600"
                    : wasFired
                      ? "fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-400 dark:stroke-emerald-600"
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
                      ? "fill-emerald-700 dark:fill-emerald-400"
                      : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 14, fontFamily: MONO }}
              >
                {wasFired && !enabled ? `✓ ${t.name}` : t.name}
              </text>
            </g>
          );
        })}
      </svg>
      </div>

      {/* Status line */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        {lastAction
          ? <>{lastAction}{allDone && " — all tokens consumed, no transitions enabled"}</>
          : <span className="text-gray-400 dark:text-gray-500">No transitions fired yet</span>
        }
      </div>
    </div>
  );
};

export default PetriNetCoffeeDemo;
