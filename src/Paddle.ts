import { Entity } from "./Enity";

export class Paddle extends Entity {
  constructor() {
    super(150, 50);
    this.collision = "rect";
    this.speed = 200;
    this.width = 50;
    this.height = 10;
  }

  update({ deltaTime, inputs }) {
    this.x += ((this.speed * deltaTime) / 1000) * inputs.direction;
  }

  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.beginPath();
    context.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.fill();
  }

  isDead() {
    return false;
  }
}
