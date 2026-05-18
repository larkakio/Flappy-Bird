"use client";

import { getLevel } from "@/lib/game/levels";

export function GameOverModal({
  levelIndex,
  score,
  onRetry,
  onMenu,
}: {
  levelIndex: number;
  score: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  const level = getLevel(levelIndex);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="mx-6 max-w-sm rounded-2xl border border-fuchsia-500/40 bg-[#0a0614]/95 p-6 text-center shadow-[0_0_40px_rgba(255,43,214,0.25)]">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-400">
          Signal Lost
        </p>
        <h2 className="mt-1 text-2xl font-bold text-fuchsia-200">Drone Down</h2>
        <p className="mt-2 font-mono text-sm text-zinc-400">
          {level.sectorLabel} · Credits {score}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="neon-btn mt-6 w-full rounded-xl py-3 font-mono text-sm uppercase tracking-wider"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="mt-3 w-full rounded-xl border border-zinc-600/50 py-2 font-mono text-xs text-zinc-400"
        >
          Menu
        </button>
      </div>
    </div>
  );
}
