"use client";

import {
  advanceLevel,
  createInitialState,
  flap,
  goToMenu,
  retryLevel,
  startPlaying,
  tick,
} from "@/lib/game/engine";
import { getLevel } from "@/lib/game/levels";
import { renderFrame } from "@/lib/game/renderer";
import { loadProgress, recordLevelComplete } from "@/lib/game/storage";
import type { GameSnapshot, SwipePoint } from "@/lib/game/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameHUD } from "./GameHUD";
import { GameOverModal } from "./GameOverModal";
import { LevelCompleteModal } from "./LevelCompleteModal";

const SWIPE_MIN_DY = -40;
const SWIPE_MAX_MS = 350;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameSnapshot | null>(null);
  const sizeRef = useRef({ w: 360, h: 640 });
  const touchRef = useRef<SwipePoint | null>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    createInitialState(0, 360, 640),
  );
  const [levelIndex, setLevelIndex] = useState(0);
  const [highestUnlocked, setHighestUnlocked] = useState(0);

  useEffect(() => {
    const progress = loadProgress();
    setLevelIndex(progress.highestLevelUnlocked);
    setHighestUnlocked(progress.highestLevelUnlocked);
    const s = createInitialState(progress.highestLevelUnlocked, 360, 640);
    stateRef.current = s;
    setSnapshot(s);
  }, []);

  const syncState = useCallback((next: GameSnapshot) => {
    stateRef.current = next;
    setSnapshot(next);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    sizeRef.current = { w, h };
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [resize]);

  useEffect(() => {
    const loop = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const state = stateRef.current;
      if (!ctx || !state) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const last = lastRef.current || now;
      const dt = Math.min(now - last, 32);
      lastRef.current = now;

      const { w, h } = sizeRef.current;
      const next = tick(state, w, h, dt);
      if (next !== state) {
        if (
          next.phase === "levelComplete" &&
          state.phase === "playing"
        ) {
          const progress = recordLevelComplete(
            next.levelIndex,
            next.score,
          );
          setHighestUnlocked(progress.highestLevelUnlocked);
        }
        syncState(next);
      } else if (next.phase === "playing") {
        stateRef.current = next;
      }

      renderFrame(ctx, stateRef.current!, w, h);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [syncState]);

  const doFlap = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (s.phase === "menu") {
      const started = startPlaying(s);
      syncState(started);
      return;
    }
    syncState(flap(s));
  }, [syncState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    if (stateRef.current?.phase === "menu") doFlap();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dy = t.clientY - start.y;
    const dx = t.clientX - start.x;
    const dt = Date.now() - start.t;
    if (
      dy < SWIPE_MIN_DY &&
      Math.abs(dx) < Math.abs(dy) &&
      dt < SWIPE_MAX_MS
    ) {
      doFlap();
    } else if (Math.abs(dy) < 12 && Math.abs(dx) < 12 && dt < 250) {
      doFlap();
    }
  };

  const startLevel = (index: number) => {
    const { w, h } = sizeRef.current;
    const s = createInitialState(index, w, h);
    const playing = startPlaying(s);
    setLevelIndex(index);
    syncState(playing);
  };

  const handleContinue = () => {
    const { w, h } = sizeRef.current;
    syncState(advanceLevel(stateRef.current!, w, h));
    setLevelIndex((i) => Math.min(i + 1, 3));
  };

  const handleRetry = () => {
    const { w, h } = sizeRef.current;
    syncState(retryLevel(stateRef.current!, w, h));
  };

  const handleMenu = () => {
    const { w, h } = sizeRef.current;
    syncState(goToMenu(stateRef.current!, w, h));
  };

  const level = getLevel(snapshot.levelIndex);

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1 w-full touch-none"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onTouchEnd={handleTouchEnd}
        onClick={doFlap}
        onKeyDown={(e) => {
          if (e.code === "Space") {
            e.preventDefault();
            doFlap();
          }
        }}
        tabIndex={0}
        aria-label="Neon Flappy playfield"
      />

      <GameHUD snapshot={snapshot} />

      {snapshot.phase === "menu" && (
        <MenuOverlay
          levelIndex={levelIndex}
          highestUnlocked={highestUnlocked}
          sectorLabel={level.sectorLabel}
          levelName={level.name}
          onStart={() => startLevel(levelIndex)}
          onSelectLevel={startLevel}
        />
      )}

      {snapshot.phase === "levelComplete" && (
        <LevelCompleteModal
          levelIndex={snapshot.levelIndex}
          score={snapshot.score}
          onContinue={handleContinue}
          onMenu={handleMenu}
        />
      )}

      {snapshot.phase === "gameOver" && (
        <GameOverModal
          levelIndex={snapshot.levelIndex}
          score={snapshot.score}
          onRetry={handleRetry}
          onMenu={handleMenu}
        />
      )}

      {snapshot.phase === "playing" && (
        <p className="pointer-events-none absolute bottom-4 inset-x-0 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/50">
          Swipe up to thrust
        </p>
      )}
    </div>
  );
}

function MenuOverlay({
  levelIndex,
  highestUnlocked,
  sectorLabel,
  levelName,
  onStart,
  onSelectLevel,
}: {
  levelIndex: number;
  highestUnlocked: number;
  sectorLabel: string;
  levelName: string;
  onStart: () => void;
  onSelectLevel: (i: number) => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="text-center px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-fuchsia-400 animate-pulse">
          Neon Flappy
        </p>
        <h1 className="mt-2 text-3xl font-bold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-lime-300 bg-clip-text text-transparent">
          Cyber Run
        </h1>
        <p className="mt-3 font-mono text-sm text-cyan-300/80">
          {sectorLabel} · {levelName}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="neon-btn mt-8 rounded-xl px-10 py-3 font-mono text-sm uppercase tracking-widest"
        >
          Launch Drone
        </button>
        <p className="mt-4 font-mono text-[10px] text-zinc-500">
          Swipe up on the field to thrust
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              disabled={i > highestUnlocked}
              onClick={() => onSelectLevel(i)}
              className="rounded-lg border border-cyan-500/30 px-3 py-1 font-mono text-xs text-cyan-300 disabled:opacity-30"
            >
              S{i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
