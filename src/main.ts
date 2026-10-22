import {
  canvas,
  gameLoop,
  gameObject,
  loadImage,
  position,
  renderGameObject,
  size,
  type Position,
} from "play2d-game-library";
import shipImageUrl from "./assets/ship.svg";

const WIDTH = 640;
const HEIGHT = 360;
const SHIP_SIZE = size(32, 48);
const SHIP_SPEED = 120; // pixels per second
const START_Y = HEIGHT - 80;

const { element, context } = canvas(size(WIDTH, HEIGHT));
(document.getElementById("game") ?? document.body).append(element);

// Wraps `value` into [min, max), so the ship re-enters at the bottom after leaving the top.
const wrap = (value: number, min: number, max: number): number =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min;

// The ship's top-left position is a pure function of time: it moves up at SHIP_SPEED.
const shipPosition = (time: number): Position =>
  position(
    (WIDTH - SHIP_SIZE.width) / 2,
    wrap(START_Y - (SHIP_SPEED * time) / 1000, -SHIP_SIZE.height, HEIGHT),
  );

const ship = gameObject({
  position: shipPosition(0),
  size: SHIP_SIZE,
  image: await loadImage(shipImageUrl),
});

gameLoop(({ time }) => {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  renderGameObject(context, gameObject({ ...ship, position: shipPosition(time) }));
});
