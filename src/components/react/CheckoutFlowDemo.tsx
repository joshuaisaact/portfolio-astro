"use client";
import React, { useState, useCallback } from "react";

type CheckoutPlace =
  | "cartReady"
  | "inventory"
  | "inventoryReserved"
  | "paymentPending"
  | "paymentComplete"
  | "paymentFailed"
  | "orderFulfilled"
  | "orderCancelled";

type Marking = Record<CheckoutPlace, number>;

interface Transition {
  name: string;
  inputs: CheckoutPlace[];
  outputs: CheckoutPlace[];
}

const TRANSITIONS: Transition[] = [
  { name: "beginCheckout", inputs: ["cartReady", "inventory"], outputs: ["inventoryReserved", "paymentPending"] },
  { name: "completePayment", inputs: ["paymentPending"], outputs: ["paymentComplete"] },
  { name: "failPayment", inputs: ["paymentPending"], outputs: ["paymentFailed"] },
  { name: "fulfillOrder", inputs: ["paymentComplete", "inventoryReserved"], outputs: ["orderFulfilled"] },
  { name: "cancelOrder", inputs: ["paymentFailed", "inventoryReserved"], outputs: ["orderCancelled", "inventory"] },
];

const INITIAL_MARKING: Marking = {
  cartReady: 3, inventory: 2,
  inventoryReserved: 0, paymentPending: 0,
  paymentComplete: 0, paymentFailed: 0,
  orderFulfilled: 0, orderCancelled: 0,
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
// Three rows: success (top y=110), shared (middle y=250), failure (bottom y=390).
// paymentPending on the top row, inventoryReserved in the middle.
// beginCheckout fans up to paymentPending and right to inventoryReserved.
// Most edges are horizontal; only the two cross-connections are diagonal.
// The cancelOrder→inventory cycle routes along the bottom.

const R = 48;
const TW = 110;
const TH = 36;

const placePos: Record<CheckoutPlace, { x: number; y: number }> = {
  cartReady:         { x: 70,  y: 170 },
  inventory:         { x: 70,  y: 330 },
  paymentPending:    { x: 300, y: 110 },
  inventoryReserved: { x: 540, y: 250 },
  paymentComplete:   { x: 540, y: 110 },
  paymentFailed:     { x: 540, y: 390 },
  orderFulfilled:    { x: 830, y: 110 },
  orderCancelled:    { x: 830, y: 390 },
};

const transPos: { x: number; y: number }[] = [
  { x: 185, y: 250 },  // beginCheckout
  { x: 420, y: 110 },  // completePayment
  { x: 420, y: 390 },  // failPayment
  { x: 690, y: 110 },  // fulfillOrder
  { x: 690, y: 390 },  // cancelOrder
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

interface Edge { x1: number; y1: number; x2: number; y2: number; cycle?: boolean }

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
    const isCycle = t.name === "cancelOrder" && out === "inventory";
    const start = rectEdge(tp.x, tp.y, pp.x, pp.y);
    const end = circleEdge(pp.x, pp.y, tp.x, tp.y);
    edges.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, cycle: isCycle });
  }
});

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const FAIL_TRANSITIONS = new Set(["failPayment"]);
const FAILED_PLACES = new Set<CheckoutPlace>(["paymentFailed", "orderCancelled"]);

// Cycle path: cancelOrder bottom → down → left along bottom → up to inventory
const CYCLE_PATH = `M 690 408 L 690 455 Q 690 470 675 470 L 85 470 Q 70 470 70 455 L 70 378`;

const CheckoutFlowDemo: React.FC = () => {
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

  const noEnabled = TRANSITIONS.every((t) => !canFire(marking, t));

  let statusText: React.ReactNode;
  if (stepCount === 0) {
    statusText = <span className="text-gray-400 dark:text-gray-500">Three customers, two items in stock</span>;
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Resource Contention</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">Three customers, two items. Try failing a payment and watch inventory return.</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/joshuaisaact/petri-net/blob/main/src/examples/checkout/net.ts"
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
      <svg viewBox="0 0 910 485" className="w-full min-w-[910px]">
        <defs>
          <marker
            id="checkout-arrow"
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

        {/* Regular arrows */}
        {edges.filter((e) => !e.cycle).map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={1.5}
            markerEnd="url(#checkout-arrow)"
          />
        ))}

        {/* Cycle arrow: cancelOrder → inventory (routes along bottom) */}
        <path
          d={CYCLE_PATH}
          fill="none"
          className="stroke-gray-400 dark:stroke-gray-500"
          strokeWidth={1.5}
          markerEnd="url(#checkout-arrow)"
        />

        {/* Places (circles) */}
        {(Object.keys(placePos) as CheckoutPlace[]).map((id) => {
          const { x, y } = placePos[id];
          const tokens = marking[id];
          const has = tokens > 0;
          const isFailed = FAILED_PLACES.has(id);
          return (
            <g key={id}>
              <circle
                cx={x} cy={y} r={R}
                className={`transition-all duration-300 ${
                  has
                    ? isFailed
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
                style={{ fontSize: 10, fontFamily: MONO }}
              >
                {id}
              </text>
              <text
                x={x} y={y + 13}
                textAnchor="middle" dominantBaseline="middle"
                className={`transition-all duration-300 font-semibold ${
                  has
                    ? isFailed
                      ? "fill-rose-600 dark:fill-rose-400"
                      : "fill-emerald-600 dark:fill-emerald-400"
                    : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 14 }}
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
          const isFail = FAIL_TRANSITIONS.has(t.name);
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
                    ? isFail
                      ? "fill-rose-500 stroke-rose-600"
                      : "fill-blue-500 stroke-blue-600"
                    : wasFired
                      ? isFail
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
                      ? isFail
                        ? "fill-rose-700 dark:fill-rose-400"
                        : "fill-emerald-700 dark:fill-emerald-400"
                      : "fill-gray-400 dark:fill-gray-500"
                }`}
                style={{ fontSize: 11, fontFamily: MONO }}
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
        {statusText}
      </div>
    </div>
  );
};

export default CheckoutFlowDemo;
