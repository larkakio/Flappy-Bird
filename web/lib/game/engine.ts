import { getLevel } from "./levels";
import type {
  Bird,
  GamePhase,
  GameSnapshot,
  Gate,
  LevelConfig,
  Particle,
} from "./types";

const BIRD_SIZE = 22;
const GATE_WIDTH = 58;
const CEILING = 8;
const FLOOR_PAD = 12;

export function createBird(width: number, height: number): Bird {
  return {
    x: width * 0.22,
    y: height * 0.42,
    vy: 0,
    rotation: 0,
  };
}

export function createInitialState(
  levelIndex: number,
  width: number,
  height: number,
): GameSnapshot {
  return {
    phase: "menu",
    levelIndex,
    score: 0,
    gatesPassed: 0,
    bird: createBird(width, height),
    gates: [],
    particles: [],
    shake: 0,
    time: 0,
    flash: 0,
  };
}

function spawnGate(
  gates: Gate[],
  width: number,
  height: number,
  level: LevelConfig,
  time: number,
): Gate[] {
  const last = gates[gates.length - 1];
  const spawnX = last ? last.x : width + 80;
  if (last && last.x > width - level.gateSpacing) return gates;

  const gapSize = height * level.gapRatio;
  let gapY = height * (0.32 + Math.random() * 0.36);
  if (level.movingGap) {
    gapY = height * (0.38 + Math.sin(time * 0.002) * 0.12);
  }

  return [
    ...gates,
    {
      x: spawnX + level.gateSpacing,
      gapY,
      gapSize,
      passed: false,
      width: GATE_WIDTH,
    },
  ];
}

function spawnTrailParticles(
  particles: Particle[],
  bird: Bird,
  hue: number,
): Particle[] {
  const p: Particle = {
    x: bird.x - 8,
    y: bird.y + (Math.random() - 0.5) * 10,
    vx: -2 - Math.random() * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 1,
    maxLife: 1,
    hue,
  };
  const next = [...particles, p].slice(-40);
  return next;
}

function circleRectCollision(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

export function startPlaying(state: GameSnapshot): GameSnapshot {
  return { ...state, phase: "playing" as GamePhase };
}

export function flap(state: GameSnapshot): GameSnapshot {
  if (state.phase !== "playing") return state;
  const level = getLevel(state.levelIndex);
  return {
    ...state,
    bird: {
      ...state.bird,
      vy: level.flapImpulse,
    },
  };
}

export function tick(
  state: GameSnapshot,
  width: number,
  height: number,
  dt: number,
): GameSnapshot {
  if (state.phase !== "playing") {
    return {
      ...state,
      shake: Math.max(0, state.shake - dt * 0.01),
      flash: Math.max(0, state.flash - dt * 0.003),
      particles: decayParticles(state.particles, dt),
      time: state.time + dt,
    };
  }

  const level = getLevel(state.levelIndex);
  let { bird, gates, score, gatesPassed, particles, shake, flash } = state;
  const time = state.time + dt;

  bird = {
    ...bird,
    vy: bird.vy + level.gravity,
    y: bird.y + bird.vy,
    rotation: Math.max(-0.6, Math.min(0.9, bird.vy * 0.08)),
  };

  gates = gates
    .map((g) => ({ ...g, x: g.x - level.scrollSpeed }))
    .filter((g) => g.x > -GATE_WIDTH - 20);

  gates = spawnGate(gates, width, height, level, time);

  const r = BIRD_SIZE * 0.45;
  for (const gate of gates) {
    const topH = gate.gapY - gate.gapSize / 2;
    const botY = gate.gapY + gate.gapSize / 2;
    const botH = height - botY - FLOOR_PAD;

    if (
      circleRectCollision(bird.x, bird.y, r, gate.x, 0, gate.width, topH) ||
      circleRectCollision(
        bird.x,
        bird.y,
        r,
        gate.x,
        botY,
        gate.width,
        botH,
      )
    ) {
      return {
        ...state,
        phase: "gameOver",
        bird,
        gates,
        shake: 12,
        flash: 1,
        particles: burstParticles(particles, bird.x, bird.y),
        time,
      };
    }

    if (!gate.passed && bird.x > gate.x + gate.width) {
      gate.passed = true;
      score += 1;
      gatesPassed += 1;
    }
  }

  if (bird.y - r < CEILING || bird.y + r > height - FLOOR_PAD) {
    return {
      ...state,
      phase: "gameOver",
      bird,
      gates,
      score,
      gatesPassed,
      shake: 12,
      flash: 1,
      particles: burstParticles(particles, bird.x, bird.y),
      time,
    };
  }

  particles = spawnTrailParticles(particles, bird, 180 + level.paletteShift * 120);
  particles = decayParticles(particles, dt);

  if (gatesPassed >= level.gatesTarget) {
    return {
      ...state,
      phase: "levelComplete",
      bird,
      gates,
      score,
      gatesPassed,
      particles,
      time,
    };
  }

  return {
    ...state,
    bird,
    gates,
    score,
    gatesPassed,
    particles,
    shake,
    flash,
    time,
  };
}

function decayParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map((p) => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life - dt * 0.002,
    }))
    .filter((p) => p.life > 0);
}

function burstParticles(
  particles: Particle[],
  x: number,
  y: number,
): Particle[] {
  const burst: Particle[] = Array.from({ length: 24 }, (_, i) => ({
    x,
    y,
    vx: Math.cos((i / 24) * Math.PI * 2) * (3 + Math.random() * 4),
    vy: Math.sin((i / 24) * Math.PI * 2) * (3 + Math.random() * 4),
    life: 1,
    maxLife: 1,
    hue: 300 + Math.random() * 60,
  }));
  return [...particles, ...burst].slice(-60);
}

export function advanceLevel(
  state: GameSnapshot,
  width: number,
  height: number,
): GameSnapshot {
  const nextIndex = Math.min(state.levelIndex + 1, 3);
  return {
    ...createInitialState(nextIndex, width, height),
    phase: "playing",
    levelIndex: nextIndex,
  };
}

export function retryLevel(
  state: GameSnapshot,
  width: number,
  height: number,
): GameSnapshot {
  return {
    ...createInitialState(state.levelIndex, width, height),
    phase: "playing",
  };
}

export function goToMenu(
  state: GameSnapshot,
  width: number,
  height: number,
): GameSnapshot {
  return createInitialState(state.levelIndex, width, height);
}

export { BIRD_SIZE, GATE_WIDTH, FLOOR_PAD };
