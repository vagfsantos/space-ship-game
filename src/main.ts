import {
  canvas,
  clearCanvas,
  direction,
  gameLoop,
  gameObject,
  keyboard,
  loadImage,
  move,
  moveTo,
  position,
  renderGameObject,
  scaleVector,
  size,
  type DirectionKeys,
  type GameObject,
} from "play2d-game-library";
import shipImageUrl from "./assets/ship.svg";

const WIDTH = 640;
const HEIGHT = 360;
const SHIP_SIZE = size(32, 48);
const SHIP_SPEED = 200; // pixels per second
const ARROWS: DirectionKeys = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

const { element, context } = canvas(size(WIDTH, HEIGHT));
(document.getElementById("game") ?? document.body).append(element);

const keys = keyboard();

// Wraps `value` into [min, max), so the ship re-enters from the opposite edge.
const wrap = (value: number, min: number, max: number): number =>
  ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min;

const wrapOnScreen = (object: GameObject): GameObject =>
  moveTo(
    object,
    position(
      wrap(object.position.x, -object.size.width, WIDTH),
      wrap(object.position.y, -object.size.height, HEIGHT),
    ),
  );

// Game state: the ship as of the last frame. Each frame replaces it with a new, moved copy.
let ship = gameObject({
  position: position((WIDTH - SHIP_SIZE.width) / 2, HEIGHT - 80),
  size: SHIP_SIZE,
  image: await loadImage(shipImageUrl),
});

gameLoop(({ deltaTime }) => {
  const velocity = scaleVector(direction(keys.pressed(), ARROWS), SHIP_SPEED);
  ship = wrapOnScreen(move(ship, scaleVector(velocity, deltaTime / 1000)));

  clearCanvas(context);
  renderGameObject(context, ship);
});
