export type GamePhase = "menu" | "playing" | "levelComplete" | "gameOver";

export interface Bird {
  x: number;
  y: number;
  vy: number;
  rotation: number;
}

export interface Gate {
  x: number;
  gapY: number;
  gapSize: number;
  passed: boolean;
  width: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  sectorLabel: string;
  gatesTarget: number;
  scrollSpeed: number;
  gapRatio: number;
  gravity: number;
  flapImpulse: number;
  gateSpacing: number;
  movingGap: boolean;
  paletteShift: number;
}

export interface GameSnapshot {
  phase: GamePhase;
  levelIndex: number;
  score: number;
  gatesPassed: number;
  bird: Bird;
  gates: Gate[];
  particles: Particle[];
  shake: number;
  time: number;
  flash: number;
}

export interface SwipePoint {
  x: number;
  y: number;
  t: number;
}
