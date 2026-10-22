import { createCanvas, size } from "play2d-game-library";

const WIDTH = 640;
const HEIGHT = 360;

const { element, context } = createCanvas(size(WIDTH, HEIGHT));
(document.getElementById("game") ?? document.body).append(element);

const drawShip = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.fillStyle = "#7fdbff";
  ctx.beginPath();
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x + 12, y + 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.closePath();
  ctx.fill();
};

drawShip(context, WIDTH / 2, HEIGHT - 40);
