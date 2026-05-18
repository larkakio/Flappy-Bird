import { getLevel } from "./levels";
import type { GameSnapshot } from "./types";
import { BIRD_SIZE, FLOOR_PAD } from "./engine";

function hsl(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  shift: number,
) {
  const horizon = h * 0.72;
  ctx.save();
  ctx.strokeStyle = hsl(185 + shift * 80, 100, 55, 0.12);
  ctx.lineWidth = 1;

  for (let i = 0; i < 14; i++) {
    const t = i / 14;
    const y = horizon + (h - horizon) * t * t;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const vanishX = w * 0.5;
  for (let i = -8; i <= 8; i++) {
    const offset = i * 0.12 + Math.sin(time * 0.001 + i) * 0.02;
    ctx.beginPath();
    ctx.moveTo(vanishX, horizon);
    ctx.lineTo(vanishX + offset * w * 1.4, h - FLOOR_PAD);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
) {
  ctx.save();
  for (let i = 0; i < 48; i++) {
    const x = ((i * 97) % 1000) / 1000 * w;
    const y = ((i * 53) % 700) / 1000 * h * 0.65;
    const blink = 0.3 + 0.7 * Math.abs(Math.sin(time * 0.003 + i));
    ctx.fillStyle = hsl(200 + (i % 5) * 20, 100, 70, blink * 0.5);
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.restore();
}

function drawGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  gapY: number,
  gapSize: number,
  width: number,
  h: number,
  time: number,
  shift: number,
) {
  const topH = gapY - gapSize / 2;
  const botY = gapY + gapSize / 2;
  const botH = h - botY - FLOOR_PAD;
  const pulse = 0.65 + 0.35 * Math.sin(time * 0.008 + x * 0.02);
  const cyan = hsl(185 + shift * 100, 100, 55, pulse);
  const magenta = hsl(310 + shift * 60, 100, 58, pulse * 0.85);

  const drawColumn = (y: number, height: number, color: string) => {
    if (height <= 0) return;
    const grad = ctx.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, hsl(185 + shift * 100, 100, 75, pulse));
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillRect(x, y, width, height);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = hsl(185 + shift * 100, 100, 85, 0.9);
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
  };

  drawColumn(0, topH, cyan);
  drawColumn(botY, botH, magenta);

  ctx.save();
  ctx.fillStyle = hsl(185 + shift * 100, 100, 70, 0.15 * pulse);
  ctx.fillRect(x - 4, gapY - gapSize / 2, width + 8, gapSize);
  ctx.restore();
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number,
  shift: number,
  time: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const glow = 0.7 + 0.3 * Math.sin(time * 0.012);

  ctx.shadowColor = hsl(185 + shift * 80, 100, 60, 1);
  ctx.shadowBlur = 20 * glow;

  ctx.beginPath();
  ctx.moveTo(BIRD_SIZE * 0.6, 0);
  ctx.lineTo(0, -BIRD_SIZE * 0.45);
  ctx.lineTo(-BIRD_SIZE * 0.35, 0);
  ctx.lineTo(0, BIRD_SIZE * 0.45);
  ctx.closePath();
  ctx.fillStyle = hsl(185 + shift * 80, 100, 55, 0.95);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-BIRD_SIZE * 0.1, -BIRD_SIZE * 0.55);
  ctx.lineTo(-BIRD_SIZE * 0.55, -BIRD_SIZE * 0.2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = hsl(310 + shift * 50, 100, 62, 0.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(BIRD_SIZE * 0.15, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = hsl(120, 100, 55, 1);
  ctx.fill();
  ctx.restore();
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  snapshot: GameSnapshot,
) {
  for (const p of snapshot.particles) {
    const a = p.life / p.maxLife;
    ctx.fillStyle = hsl(p.hue, 100, 60, a * 0.8);
    ctx.fillRect(p.x, p.y, 3, 3);
  }
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  snapshot: GameSnapshot,
  width: number,
  height: number,
) {
  const level = getLevel(snapshot.levelIndex);
  const shift = level.paletteShift;
  const shakeX = (Math.random() - 0.5) * snapshot.shake;
  const shakeY = (Math.random() - 0.5) * snapshot.shake;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#050508");
  bg.addColorStop(0.55, "#0a0618");
  bg.addColorStop(1, "#120a22");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  if (snapshot.flash > 0) {
    ctx.fillStyle = hsl(310, 100, 70, snapshot.flash * 0.35);
    ctx.fillRect(0, 0, width, height);
  }

  drawStars(ctx, width, height, snapshot.time);
  drawGrid(ctx, width, height, snapshot.time, shift);

  for (const gate of snapshot.gates) {
    drawGate(
      ctx,
      gate.x,
      gate.gapY,
      gate.gapSize,
      gate.width,
      height,
      snapshot.time,
      shift,
    );
  }

  drawParticles(ctx, snapshot);

  if (snapshot.phase !== "menu") {
    drawBird(
      ctx,
      snapshot.bird.x,
      snapshot.bird.y,
      snapshot.bird.rotation,
      shift,
      snapshot.time,
    );
  }

  ctx.fillStyle = hsl(185 + shift * 80, 80, 50, 0.25);
  ctx.fillRect(0, height - FLOOR_PAD, width, FLOOR_PAD);

  ctx.restore();
}
