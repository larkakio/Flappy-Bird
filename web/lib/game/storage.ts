const KEY = "neon-flappy-progress";

export interface SavedProgress {
  highestLevelUnlocked: number;
  bestScores: Record<number, number>;
}

const DEFAULT: SavedProgress = {
  highestLevelUnlocked: 0,
  bestScores: {},
};

export function loadProgress(): SavedProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(progress: SavedProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function recordLevelComplete(
  levelIndex: number,
  score: number,
): SavedProgress {
  const current = loadProgress();
  const next: SavedProgress = {
    highestLevelUnlocked: Math.max(
      current.highestLevelUnlocked,
      levelIndex + 1,
    ),
    bestScores: { ...current.bestScores },
  };
  const prev = next.bestScores[levelIndex] ?? 0;
  if (score > prev) next.bestScores[levelIndex] = score;
  saveProgress(next);
  return next;
}
