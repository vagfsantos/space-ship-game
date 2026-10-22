import {
  canvas,
  clamp,
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
  requestTiltPermission,
  scaleVector,
  size,
  tilt,
  vector,
  type DirectionKeys,
  type GameObject,
  type Vector,
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
const container = document.getElementById("game") ?? document.body;
container.prepend(element);

// Input: arrow keys on desktop, tilting left/right on phones. Both always work.
const keys = keyboard();
const device = tilt({ maxAngle: 25 });

// Touch devices: the first tap asks for tilt permission (required on iOS) and
// makes the current way the phone is held the neutral position.
const hint = document.getElementById("hint");
if (hint !== null && matchMedia("(pointer: coarse)").matches) {
  hint.hidden = false;
  if (!window.isSecureContext) {
    // Browsers only allow motion sensors on HTTPS pages.
    hint.textContent = "Tilt needs HTTPS: open this page with https://";
  } else {
    // iOS only shows the permission prompt from the end of a tap (pointerup or
    // click), not from pointerdown/touchstart. Keep listening until it's granted.
    const enableTilt = (): void => {
      void requestTiltPermission().then((granted) => {
        if (!granted) {
          hint.textContent = "Tilt permission denied or not supported. Tap to try again";
          return;
        }
        container.removeEventListener("pointerup", enableTilt);
        hint.hidden = true;
        device.calibrate();
      });
    };
    container.addEventListener("pointerup", enableTilt);
  }
}

// Keyboard direction plus the phone's left/right tilt, limited to one full speed.
const steering = (): Vector => {
  const fromKeys = direction(keys.pressed(), ARROWS);
  return vector(clamp(fromKeys.x + device.current().x, -1, 1), fromKeys.y);
};

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
  const velocity = scaleVector(steering(), SHIP_SPEED);
  ship = wrapOnScreen(move(ship, scaleVector(velocity, deltaTime / 1000)));

  clearCanvas(context);
  renderGameObject(context, ship);
});
