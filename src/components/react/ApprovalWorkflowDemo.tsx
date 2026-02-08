"use client";
import React, { useState, useCallback } from "react";

type ApprovalPlace =
  | "submitted"
  | "awaitingFinance"
  | "awaitingLegal"
  | "financeApproved"
  | "financeRejected"
  | "legalApproved"
  | "legalRejected"
  | "contractExecuted";

type Marking = Record<ApprovalPlace, number>;

interface Transition {
  name: string;
  inputs: ApprovalPlace[];
  outputs: ApprovalPlace[];
}

const TRANSITIONS: Transition[] = [
  { name: "submit", inputs: ["submitted"], outputs: ["awaitingFinance", "awaitingLegal"] },
  { name: "approveFinance", inputs: ["awaitingFinance"], outputs: ["financeApproved"] },
  { name: "rejectFinance", inputs: ["awaitingFinance"], outputs: ["financeRejected"] },
  { name: "approveLegal", inputs: ["awaitingLegal"], outputs: ["legalApproved"] },
  { name: "rejectLegal", inputs: ["awaitingLegal"], outputs: ["legalRejected"] },
  { name: "execute", inputs: ["financeApproved", "legalApproved"], outputs: ["contractExecuted"] },
];

const INITIAL_MARKING: Marking = {
  submitted: 1,
  awaitingFinance: 0, awaitingLegal: 0,
  financeApproved: 0, financeRejected: 0,
  legalApproved: 0, legalRejected: 0,
  contractExecuted: 0,
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
const TW = 110;
const TH = 36;

const placePos: Record<ApprovalPlace, { x: number; y: number }> = {
  submitted:        { x: 70,  y: 250 },
  awaitingFinance:  { x: 260, y: 130 },
  awaitingLegal:    { x: 260, y: 370 },
  financeApproved:  { x: 530, y: 75 },
  financeRejected:  { x: 530, y: 185 },
  legalApproved:    { x: 530, y: 315 },
  legalRejected:    { x: 530, y: 425 },
  contractExecuted: { x: 850, y: 200 },
};

const transPos: { x: number; y: number }[] = [
  { x: 160, y: 250 },  // submit
  { x: 395, y: 75 },   // approveFinance
  { x: 395, y: 185 },  // rejectFinance
  { x: 395, y: 315 },  // approveLegal
  { x: 395, y: 425 },  // rejectLegal
  { x: 700, y: 200 },  // execute
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
const REJECT_TRANSITIONS = new Set(["rejectFinance", "rejectLegal"]);
const REJECTED_PLACES = new Set<ApprovalPlace>(["financeRejected", "legalRejected"]);

const ApprovalWorkflowDemo: React.FC = () => {
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

  const executed = marking.contractExecuted > 0;
  const noEnabled = TRANSITIONS.every((t) => !canFire(marking, t));
  const stuck = noEnabled && !executed && stepCount > 0;

  let statusText: React.ReactNode;
  if (stepCount === 0) {
    statusText = <span className="text-gray-400 dark:text-gray-500">Click submit to begin the approval process</span>;
  } else if (executed) {
    statusText = <>{lastAction}. Both approvals present, so execute could fire.</>;
  } else if (stuck) {
    statusText = <>{lastAction}. No transitions can fire. <span className="font-medium">execute</span> needs financeApproved and legalApproved.</>;
  } else {
    statusText = lastAction;
  }

  return (
    <div className="not-prose my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative w-full md:w-[calc(100%+20rem)] md:-ml-40 max-w-[calc(100vw-2rem)] overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Concurrent Approvals</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0">Try rejecting one approver and see what happens to execute</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/joshuaisaact/petri-net/blob/main/src/examples/purchase-orders/net.ts"
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
      <svg viewBox="0 0 920 500" className="w-full min-w-[920px]">
        <defs>
          <marker
            id="approval-arrow"
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
            markerEnd="url(#approval-arrow)"
          />
        ))}

        {/* Places (circles) */}
        {(Object.keys(placePos) as ApprovalPlace[]).map((id) => {
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

export default ApprovalWorkflowDemo;
