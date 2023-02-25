import { Collision, Entity, FrameData } from "./Enity";

export class Paddle implements Entity {
  position: { x: number; y: number };
  collision: Collision;
  speed: number;
  width: number;
  height: number;

  constructor() {
    this.position = { x: 150, y: 50 };
    this.collision = "rect";
    this.speed = 200;
    this.width = 50;
    this.height = 10;
  }

  update({ deltaTime, inputs }: FrameData) {
    this.position.x += ((this.speed * deltaTime) / 1000) * inputs.direction;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.rect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height
    );
    context.fill();
  }

  isDead() {
    return false;
  }
}
