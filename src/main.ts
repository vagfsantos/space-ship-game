import { createCanvas } from "play2d-game-library";

const WIDTH = 640;
const HEIGHT = 360;

const parent = document.getElementById("game") ?? document.body;
const { context } = createCanvas({ width: WIDTH, height: HEIGHT, parent });

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
