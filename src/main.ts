import {
  canvas,
  clamp,
  clearCanvas,
  fitCanvas,
  gameLoop,
  gameObject,
  isPressed,
  keyboard,
  loadImage,
  move,
  moveTo,
  position,
  renderGameObject,
  renderTiledImage,
  requestTiltPermission,
  responsiveSize,
  scaleVector,
  size,
  tilt,
  vector,
  wrap,
  type GameObject,
  type Vector,
} from "play2d-game-library";
import nebulaImageUrl from "./assets/nebula.jpg";
import shipImageUrl from "./assets/ship.svg";

const SHIP_SIZE = size(32, 48);
const SHIP_SPEED = 300; // pixels per second
const BACKGROUND_SPEED = 80; // pixels per second, downwards: the ship seems to fly up
const LEFT_KEY = "ArrowLeft";
const RIGHT_KEY = "ArrowRight";

// Portrait game world, 640 tall. The width follows the screen's shape when the game
// starts (from 9:21 tall phones to 9:16), so phones fill the whole screen and wider
// screens get a 9:16 column.
const { element, context } = canvas(
  responsiveSize(
    { height: 640, minAspect: 9 / 21, maxAspect: 9 / 16 },
    size(window.innerWidth, window.innerHeight),
  ),
);
const { width: WIDTH, height: HEIGHT } = element;
fitCanvas(element);
const container = document.getElementById("game") ?? document.body;
container.prepend(element);

// Input: left/right arrow keys on desktop, tilting left/right on phones. Both always work.
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
          hint.textContent =
            "Tilt permission denied or not supported. Tap to try again";
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
// The ship only moves left and right: x from -1 to 1, y always 0.
const steering = (): Vector => {
  const pressed = keys.pressed();
  const fromKeys = Number(isPressed(pressed, RIGHT_KEY)) - Number(isPressed(pressed, LEFT_KEY));
  return vector(clamp(fromKeys + device.current().x, -1, 1), 0);
};

const wrapOnScreen = (object: GameObject): GameObject =>
  moveTo(
    object,
    position(
      wrap(object.position.x, -object.size.width, WIDTH),
      object.position.y,
    ),
  );

// Game state: the ship as of the last frame. Each frame replaces it with a new, moved copy.
let ship = gameObject({
  position: position(
    (WIDTH - SHIP_SIZE.width) / 2,
    HEIGHT - SHIP_SIZE.height - 48,
  ),
  size: SHIP_SIZE,
  image: await loadImage(shipImageUrl),
});

// The nebula is seamless, so it repeats forever. Tiles are as wide as the screen.
const nebula = await loadImage(nebulaImageUrl);
const nebulaTileSize = size(WIDTH, WIDTH);

gameLoop(({ time, deltaTime }) => {
  const velocity = scaleVector(steering(), SHIP_SPEED);
  ship = wrapOnScreen(move(ship, scaleVector(velocity, deltaTime / 1000)));

  clearCanvas(context);
  renderTiledImage(context, {
    image: nebula,
    tileSize: nebulaTileSize,
    offset: vector(0, (BACKGROUND_SPEED * time) / 1000),
  });
  renderGameObject(context, ship);
});
