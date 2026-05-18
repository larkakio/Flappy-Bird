"use client";

import { getLevel } from "@/lib/game/levels";
import type { GameSnapshot } from "@/lib/game/types";

export function GameHUD({ snapshot }: { snapshot: GameSnapshot }) {
  const level = getLevel(snapshot.levelIndex);
  const progress = `${snapshot.gatesPassed}/${level.gatesTarget}`;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-4 pt-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/90">
        <p className="text-fuchsia-300/80">{level.sectorLabel}</p>
        <p className="text-lg font-bold text-cyan-200">{level.name}</p>
      </div>
      <div className="text-right font-mono">
        <p className="text-[10px] uppercase tracking-widest text-lime-300/70">
          Credits
        </p>
        <p className="text-2xl font-bold tabular-nums text-lime-200">
          {snapshot.score}
        </p>
        <p className="text-[10px] text-fuchsia-300/60">Gates {progress}</p>
      </div>
    </div>
  );
}
