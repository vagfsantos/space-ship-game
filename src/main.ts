import { canvas, gameLoop, position, size, type Position } from "play2d-game-library";

const WIDTH = 640;
const HEIGHT = 360;
const SHIP_SPEED = 120; // pixels per second
const SHIP_HALF_HEIGHT = 16;
const START_Y = HEIGHT - 40;

const { element, context } = canvas(size(WIDTH, HEIGHT));
(document.getElementById("game") ?? document.body).append(element);

// Wraps `value` into [min, max), so the ship re-enters at the bottom after leaving the top.
const wrap = (value: number, min: number, max: number): number =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min;

// The ship's position is a pure function of time: it moves up at SHIP_SPEED.
const shipPosition = (time: number): Position =>
  position(
    WIDTH / 2,
    wrap(START_Y - (SHIP_SPEED * time) / 1000, -SHIP_HALF_HEIGHT, HEIGHT + SHIP_HALF_HEIGHT),
  );

const drawShip = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Position,
): void => {
  ctx.fillStyle = "#7fdbff";
  ctx.beginPath();
  ctx.moveTo(x, y - SHIP_HALF_HEIGHT);
  ctx.lineTo(x + 12, y + 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.closePath();
  ctx.fill();
};

gameLoop(({ time }) => {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawShip(context, shipPosition(time));
});
