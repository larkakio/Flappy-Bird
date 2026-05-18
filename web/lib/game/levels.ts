import type { LevelConfig } from "./types";

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Neon Dawn",
    sectorLabel: "Sector 1",
    gatesTarget: 5,
    scrollSpeed: 2.4,
    gapRatio: 0.22,
    gravity: 0.45,
    flapImpulse: -7.2,
    gateSpacing: 220,
    movingGap: false,
    paletteShift: 0,
  },
  {
    id: 2,
    name: "Grid Rush",
    sectorLabel: "Sector 2",
    gatesTarget: 8,
    scrollSpeed: 2.76,
    gapRatio: 0.198,
    gravity: 0.48,
    flapImpulse: -7.4,
    gateSpacing: 200,
    movingGap: false,
    paletteShift: 0.15,
  },
  {
    id: 3,
    name: "Overdrive",
    sectorLabel: "Sector 3",
    gatesTarget: 12,
    scrollSpeed: 3.0,
    gapRatio: 0.185,
    gravity: 0.52,
    flapImpulse: -7.6,
    gateSpacing: 185,
    movingGap: true,
    paletteShift: 0.3,
  },
  {
    id: 4,
    name: "Void Run",
    sectorLabel: "Sector 4",
    gatesTarget: 15,
    scrollSpeed: 3.25,
    gapRatio: 0.17,
    gravity: 0.55,
    flapImpulse: -7.8,
    gateSpacing: 170,
    movingGap: true,
    paletteShift: 0.45,
  },
];

export function getLevel(index: number): LevelConfig {
  return LEVELS[Math.min(index, LEVELS.length - 1)]!;
}
