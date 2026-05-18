"use client";

import { getLevel } from "@/lib/game/levels";

export function LevelCompleteModal({
  levelIndex,
  score,
  onContinue,
  onMenu,
}: {
  levelIndex: number;
  score: number;
  onContinue: () => void;
  onMenu: () => void;
}) {
  const level = getLevel(levelIndex);
  const next = getLevel(levelIndex + 1);
  const hasNext = levelIndex < 3;

  return (
    <Overlay>
      <Card>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">
          Cleared
        </p>
        <h2 className="mt-1 text-2xl font-bold text-cyan-200">
          {level.sectorLabel} Complete
        </h2>
        <p className="mt-2 font-mono text-sm text-zinc-400">
          Credits earned: <span className="text-lime-300">{score}</span>
        </p>
        {hasNext ? (
          <>
            <p className="mt-4 font-mono text-xs text-cyan-400/80">
              Continue to {next.sectorLabel} — {next.name}
            </p>
            <button type="button" onClick={onContinue} className="neon-btn mt-6 w-full rounded-xl py-3 font-mono text-sm uppercase tracking-wider">
              Continue
            </button>
          </>
        ) : (
          <p className="mt-4 font-mono text-xs text-lime-300">
            Campaign complete. You conquered the neon void.
          </p>
        )}
        <button
          type="button"
          onClick={onMenu}
          className="mt-3 w-full rounded-xl border border-zinc-600/50 py-2 font-mono text-xs text-zinc-400"
        >
          Menu
        </button>
      </Card>
    </Overlay>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-6 max-w-sm rounded-2xl border border-cyan-500/40 bg-[#0a0614]/95 p-6 text-center shadow-[0_0_40px_rgba(0,245,255,0.2)]">
      {children}
    </div>
  );
}
