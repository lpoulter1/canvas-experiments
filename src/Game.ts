import { Entity } from "./Enity";
import { Paddle } from "./Paddle";
import { InputsManager } from "./InputsManager";
import { Ball } from "./Ball";

export class Game {
  entities: Entity[];
  context: CanvasRenderingContext2D;
  newBallInterval: number;
  lastBallCreated: number;
  lastUpdate!: number;
  player!: Paddle;
  inputsManager!: InputsManager;

  constructor(canvas: HTMLCanvasElement) {
    this.entities = []; // contains all game entities (Balls, Paddles, ...)
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.newBallInterval = 500; // ms between each ball
    this.lastBallCreated = -Infinity; // timestamp of last time a ball was launched
  }

  start() {
    this.lastUpdate = performance.now();
    this.player = new Paddle();
    this.entities.push(this.player);
    this.inputsManager = new InputsManager();
    this.loop();
  }

  update() {
    // calculate time elapsed
    const newTime = performance.now();
    const deltaTime = newTime - this.lastUpdate;

    // update every entity
    const frameData = {
      deltaTime,
      inputs: this.inputsManager,
    };
    this.entities.forEach((entity) => entity.update(frameData));

    // other update logic (here, create new entities)
    if (this.lastBallCreated + this.newBallInterval < newTime) {
      const ball = new Ball({ x: this.player.position.x, y: 300 });
      this.entities.push(ball);
      this.lastBallCreated = newTime;
    }

    // remember current time for next update
    this.lastUpdate = newTime;
  }

  draw() {
    this.entities.forEach((entity) => entity.draw(this.context));
  }

  cleanup() {
    // to prevent memory leak, don't forget to cleanup dead entities
    this.entities.forEach((entity) => {
      if (entity.isDead(this.player)) {
        const index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
      }
    });
  }

  loop() {
    requestAnimationFrame(() => {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
      this.update();
      this.draw();
      this.cleanup();
      this.loop();
    });
  }
}
