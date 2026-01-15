"use client";
import React, { useState, useCallback } from "react";

// Tiers: 25 + 12 + 6 + 4 + 2 + 1 = 50 total slots (same as linear probing demo)
const TIERS = [25, 12, 6, 4, 2, 1];
const TOTAL_SLOTS = TIERS.reduce((a, b) => a + b, 0);

interface Slot {
  key: string | null;
  probes: number;
  offset: number;
}

type TierSlots = Slot[][];

function initializeTiers(): TierSlots {
  return TIERS.map(size =>
    Array(size).fill(null).map(() => ({ key: null, probes: 0, offset: 0 }))
  );
}

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

function getSlotColor(offset: number, isEmpty: boolean): string {
  if (isEmpty) return "bg-gray-100 dark:bg-gray-800";
  if (offset === 0) return "bg-emerald-400 dark:bg-emerald-500";
  if (offset <= 2) return "bg-yellow-400 dark:bg-yellow-500";
  if (offset <= 4) return "bg-orange-400 dark:bg-orange-500";
  return "bg-red-500 dark:bg-red-600";
}

const ElasticHashingDemo: React.FC = () => {
  const [tiers, setTiers] = useState<TierSlots>(initializeTiers);
  const [totalProbes, setTotalProbes] = useState(0);
  const [insertCount, setInsertCount] = useState(0);
  const [lastInsert, setLastInsert] = useState<{ key: string; tier: number; slot: number; probes: number; offset: number } | null>(null);

  const filledSlots = tiers.flat().filter(s => s.key !== null);
  const filledCount = filledSlots.length;
  const loadFactor = Math.round((filledCount / TOTAL_SLOTS) * 100);
  const avgProbes = insertCount > 0 ? (totalProbes / insertCount).toFixed(1) : "0";
  // Worst lookup = max probes/offset of any key currently in the table
  const maxProbes = filledSlots.length > 0 ? Math.max(...filledSlots.map(s => s.probes)) : 0;
  const maxOffset = filledSlots.length > 0 ? Math.max(...filledSlots.map(s => s.offset)) : 0;

  // Elastic hashing: interleaved probing across tiers
  // Key insight: check offset 0 in ALL tiers, then offset 1 in ALL tiers, etc.
  // This prevents clusters from forming in any single tier
  const insert = useCallback(() => {
    if (filledCount >= TOTAL_SLOTS - 1) return;

    const key = generateRandomKey();
    const newTiers = tiers.map(tier => tier.map(slot => ({ ...slot })));

    let probes = 0;
    let inserted = false;
    let insertTier = 0;
    let insertSlot = 0;
    let insertOffset = 0;

    // Precompute hash for each tier
    const hashes = TIERS.map(size => hashString(key, size));

    // Interleaved probing: for each offset, try ALL tiers before increasing offset
    const maxTierSize = TIERS[0]; // Largest tier
    for (let offset = 0; offset < maxTierSize && !inserted; offset++) {
      for (let tierIdx = 0; tierIdx < TIERS.length && !inserted; tierIdx++) {
        const tierSize = TIERS[tierIdx];
        if (offset >= tierSize) continue; // This tier is smaller than current offset

        const slotIdx = (hashes[tierIdx] + offset) % tierSize;
        probes++;

        if (newTiers[tierIdx][slotIdx].key === null) {
          newTiers[tierIdx][slotIdx] = { key, probes, offset };
          inserted = true;
          insertTier = tierIdx;
          insertSlot = slotIdx;
          insertOffset = offset;
        }
      }
    }

    if (inserted) {
      setTiers(newTiers);
      setLastInsert({ key, tier: insertTier, slot: insertSlot, probes, offset: insertOffset });
      setTotalProbes(prev => prev + probes);
      setInsertCount(prev => prev + 1);
    }
  }, [tiers, filledCount]);

  const insertMany = useCallback((count: number) => {
    let currentTiers = tiers.map(tier => tier.map(slot => ({ ...slot })));
    let currentTotal = totalProbes;
    let currentCount = insertCount;
    let currentFilled = filledCount;

    for (let i = 0; i < count && currentFilled < TOTAL_SLOTS - 1; i++) {
      const key = generateRandomKey();

      let probes = 0;
      let inserted = false;

      // Precompute hash for each tier
      const hashes = TIERS.map(size => hashString(key, size));

      // Interleaved probing: for each offset, try ALL tiers before increasing offset
      const maxTierSize = TIERS[0];
      for (let offset = 0; offset < maxTierSize && !inserted; offset++) {
        for (let tierIdx = 0; tierIdx < TIERS.length && !inserted; tierIdx++) {
          const tierSize = TIERS[tierIdx];
          if (offset >= tierSize) continue;

          const slotIdx = (hashes[tierIdx] + offset) % tierSize;
          probes++;

          if (currentTiers[tierIdx][slotIdx].key === null) {
            currentTiers[tierIdx][slotIdx] = { key, probes, offset };
            inserted = true;
          }
        }
      }

      if (inserted) {
        currentTotal += probes;
        currentCount++;
        currentFilled++;
      }
    }

    setTiers(currentTiers);
    setTotalProbes(currentTotal);
    setInsertCount(currentCount);
    setLastInsert(null);
  }, [tiers, totalProbes, insertCount, filledCount]);

  const reset = useCallback(() => {
    setTiers(initializeTiers());
    setTotalProbes(0);
    setInsertCount(0);
    setLastInsert(null);
  }, []);

  return (
    <div className="my-8 p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Elastic Hashing
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Same 50 slots, spread across multiple tiers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={insert}
            disabled={filledCount >= TOTAL_SLOTS - 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            +1
          </button>
          <button
            onClick={() => insertMany(5)}
            disabled={filledCount >= TOTAL_SLOTS - 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            +5
          </button>
          <button
            onClick={() => insertMany(Math.floor(TOTAL_SLOTS * 0.9) - filledCount)}
            disabled={filledCount >= Math.floor(TOTAL_SLOTS * 0.9)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Fill to 90%
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Prompt */}
      {insertCount === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          Same capacity as above, but probing spreads across tiers — watch the worst case stay low
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
          <div className={`text-2xl font-bold ${maxOffset > 4 ? 'text-red-500' : 'text-emerald-500'}`}>
            {maxOffset}<span className="text-base text-gray-400 dark:text-gray-500"> offset{maxOffset !== 1 ? 's' : ''}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{maxProbes} checks</div>
        </div>
      </div>

      {/* Tiered Visualization */}
      <div className="space-y-2 mb-6">
        {tiers.map((tier, tierIdx) => (
          <div key={tierIdx} className="flex items-center gap-2">
            <div className="text-xs text-gray-400 dark:text-gray-500 w-12 text-right shrink-0">
              Tier {tierIdx}
            </div>
            <div className="flex gap-1 flex-wrap">
              {tier.map((slot, slotIdx) => {
                const isLastInsert = lastInsert && lastInsert.tier === tierIdx && lastInsert.slot === slotIdx;
                return (
                  <div
                    key={slotIdx}
                    className={`
                      w-6 h-6 sm:w-7 sm:h-7 rounded transition-all duration-300
                      ${getSlotColor(slot.offset, slot.key === null)}
                      ${isLastInsert ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900' : ''}
                    `}
                    title={slot.key ? `${slot.key} (offset ${slot.offset}, ${slot.probes} checks)` : 'Empty'}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Empty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Offset 0</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Offset 1-2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-400"></div>
          <span className="text-gray-600 dark:text-gray-400">Offset 3-4</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Offset 5+</span>
        </div>
      </div>

      {/* Last Insert Info */}
      {lastInsert && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <span className="font-mono font-medium text-gray-900 dark:text-gray-100">"{lastInsert.key}"</span>
          {' → '}inserted into <span className="text-blue-500 font-medium">Tier {lastInsert.tier}</span>
          {' '}at <span className={lastInsert.offset > 3 ? 'text-orange-500' : 'text-emerald-500'}>offset {lastInsert.offset}</span>
          <span className="text-gray-400"> ({lastInsert.probes} check{lastInsert.probes !== 1 ? 's' : ''})</span>
        </div>
      )}
    </div>
  );
};

export default ElasticHashingDemo;
