import {
  canvas,
  clearCanvas,
  gameLoop,
  gameObject,
  loadImage,
  moveTo,
  position,
  renderGameObject,
  size,
  vector,
  type Position,
} from "play2d-game-library";
import shipImageUrl from "./assets/ship.svg";

const WIDTH = 640;
const HEIGHT = 360;
const SHIP_SIZE = size(32, 48);
const SHIP_START = position((WIDTH - SHIP_SIZE.width) / 2, HEIGHT - 80);
const SHIP_VELOCITY = vector(0, -120); // pixels per second: straight up

const { element, context } = canvas(size(WIDTH, HEIGHT));
(document.getElementById("game") ?? document.body).append(element);

// Wraps `value` into [min, max), so the ship re-enters from the opposite edge.
const wrap = (value: number, min: number, max: number): number =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min;

// The ship's top-left position is a pure function of time: start + velocity × seconds,
// wrapped so it re-enters from the opposite edge.
const shipPosition = (time: number): Position => {
  const seconds = time / 1000;
  return position(
    wrap(SHIP_START.x + SHIP_VELOCITY.x * seconds, -SHIP_SIZE.width, WIDTH),
    wrap(SHIP_START.y + SHIP_VELOCITY.y * seconds, -SHIP_SIZE.height, HEIGHT),
  );
};

const ship = gameObject({
  position: shipPosition(0),
  size: SHIP_SIZE,
  image: await loadImage(shipImageUrl),
});

gameLoop(({ time }) => {
  clearCanvas(context);
  renderGameObject(context, moveTo(ship, shipPosition(time)));
});
