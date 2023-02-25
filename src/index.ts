import { Game } from "./Game";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const game = new Game(canvas);
game.start();
