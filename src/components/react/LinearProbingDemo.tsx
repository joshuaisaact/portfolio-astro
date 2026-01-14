"use client";
import React, { useState, useCallback } from "react";

interface Slot {
  key: string | null;
  probes: number;
}

const INITIAL_SIZE = 50;

function hashString(str: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % size;
  }
  return hash;
}

function generateRandomKey(): string {
  const names = [
    "alice", "bob", "carol", "dave", "eve", "frank", "grace", "henry",
    "iris", "jack", "kate", "leo", "maya", "nick", "olive", "paul",
    "quinn", "rose", "sam", "tara", "uma", "vic", "walt", "xena", "yuri", "zoe"
  ];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
}

function getSlotColor(probes: number, isEmpty: boolean): string {
  if (isEmpty) return "bg-gray-100 dark:bg-gray-800";
  if (probes === 1) return "bg-emerald-400 dark:bg-emerald-500";
  if (probes === 2) return "bg-yellow-400 dark:bg-yellow-500";
  if (probes <= 4) return "bg-orange-400 dark:bg-orange-500";
  return "bg-red-500 dark:bg-red-600";
}

function getCollisionLabel(probes: number): string {
  const collisions = probes - 1;
  if (collisions === 0) return "0 collisions";
  if (collisions === 1) return "1 collision";
  return `${collisions} collisions`;
}

const LinearProbingDemo: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>(
    Array(INITIAL_SIZE).fill(null).map(() => ({ key: null, probes: 0 }))
  );
  const [lastInsert, setLastInsert] = useState<{ key: string; hash: number; finalIndex: number; probes: number } | null>(null);
  const [totalProbes, setTotalProbes] = useState(0);
  const [insertCount, setInsertCount] = useState(0);

  const filledSlots = slots.filter(s => s.key !== null);
  const filledCount = filledSlots.length;
  const loadFactor = Math.round((filledCount / INITIAL_SIZE) * 100);
  const avgProbes = insertCount > 0 ? (totalProbes / insertCount).toFixed(1) : "0";
  // Worst lookup = max probes of any key currently in the table
  const maxProbes = filledSlots.length > 0 ? Math.max(...filledSlots.map(s => s.probes)) : 0;

  const insert = useCallback(() => {
    const filledCount = slots.filter(s => s.key !== null).length;
    if (filledCount >= INITIAL_SIZE - 1) return;

    const key = generateRandomKey();
    const hash = hashString(key, INITIAL_SIZE);

    let probes = 0;
    let index = hash;

    const newSlots = [...slots];

    while (newSlots[index].key !== null) {
      probes++;
      index = (index + 1) % INITIAL_SIZE;
    }
    probes++;

    newSlots[index] = { key, probes };
    setSlots(newSlots);
    setLastInsert({ key, hash, finalIndex: index, probes });
    setTotalProbes(prev => prev + probes);
    setInsertCount(prev => prev + 1);
  }, [slots]);

  const insertMany = useCallback((count: number) => {
    let currentSlots = [...slots];
    let currentTotal = totalProbes;
    let currentCount = insertCount;

    for (let i = 0; i < count; i++) {
      const currentFilledCount = currentSlots.filter(s => s.key !== null).length;
      if (currentFilledCount >= INITIAL_SIZE - 1) break;

      const key = generateRandomKey();
      const hash = hashString(key, INITIAL_SIZE);

      let probes = 0;
      let index = hash;

      while (currentSlots[index].key !== null) {
        probes++;
        index = (index + 1) % INITIAL_SIZE;
      }
      probes++;

      currentSlots[index] = { key, probes };
      currentTotal += probes;
      currentCount++;
    }

    setSlots(currentSlots);
    setTotalProbes(currentTotal);
    setInsertCount(currentCount);
    setLastInsert(null);
  }, [slots, totalProbes, insertCount]);

  const reset = useCallback(() => {
    setSlots(Array(INITIAL_SIZE).fill(null).map(() => ({ key: null, probes: 0 })));
    setLastInsert(null);
    setTotalProbes(0);
    setInsertCount(0);
  }, []);

  return (
    <div className="my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Linear Probing
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Watch clusters form as the table fills up
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={insert}
            disabled={filledCount >= INITIAL_SIZE - 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +1
          </button>
          <button
            onClick={() => insertMany(5)}
            disabled={filledCount >= INITIAL_SIZE - 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +5
          </button>
          <button
            onClick={() => insertMany(Math.floor(INITIAL_SIZE * 0.9) - filledCount)}
            disabled={filledCount >= Math.floor(INITIAL_SIZE * 0.9)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Fill to 90%
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Prompt */}
      {insertCount === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Click <span className="font-medium text-blue-500">+1</span> a few times, then <span className="font-medium text-orange-500">Fill to 90%</span> to see clustering in action
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{loadFactor}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Load</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-emerald-500">{avgProbes}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Lookup</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className={`text-2xl font-bold ${maxProbes > 4 ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {maxProbes}<span className="text-base text-gray-400 dark:text-gray-500">/{INITIAL_SIZE}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Worst Lookup</div>
        </div>
      </div>

      {/* Hash Table Visualization - 10x5 grid */}
      <div className="mb-6">
        <div className="grid grid-cols-10 gap-1.5 max-w-lg mx-auto">
          {slots.map((slot, index) => {
            const isOriginalHash = lastInsert && lastInsert.hash === index;
            const isFinalPosition = lastInsert && lastInsert.finalIndex === index;
            return (
              <div
                key={index}
                className={`
                  aspect-square rounded-md transition-all duration-300
                  ${getSlotColor(slot.probes, slot.key === null)}
                  ${isOriginalHash ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900' : ''}
                  ${isFinalPosition && lastInsert.probes > 1 ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900' : ''}
                `}
                title={slot.key ? `Slot ${index}: ${slot.key} (${getCollisionLabel(slot.probes)})` : `Slot ${index}: empty`}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Empty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-400"></div>
          <span className="text-gray-600 dark:text-gray-400">0 collisions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-400"></div>
          <span className="text-gray-600 dark:text-gray-400">1 collision</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-400"></div>
          <span className="text-gray-600 dark:text-gray-400">2-3 collisions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">4+ collisions</span>
        </div>
      </div>

      {/* Last Insert Info */}
      {lastInsert && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <span className="font-mono font-medium text-gray-900 dark:text-gray-100">"{lastInsert.key}"</span>
          {' → '}hashed to <span className="text-blue-500 font-medium">slot {lastInsert.hash}</span>
          {lastInsert.probes > 1 ? (
            <span className={lastInsert.probes > 4 ? 'text-red-500 font-medium' : ''}>
              {' → '}collision! walked {lastInsert.probes - 1} slots to <span className="text-red-500 font-medium">slot {lastInsert.finalIndex}</span>
            </span>
          ) : (
            <span className="text-emerald-500 font-medium"> → inserted directly</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LinearProbingDemo;
