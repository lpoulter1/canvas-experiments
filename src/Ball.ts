import { Entity } from "./Enity";

export class Ball extends Entity {
  speed: number;
  radius: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.collision = "circle";
    this.speed = 300; // px per second
    this.radius = 10; // radius in px
  }

  update({ deltaTime }: { deltaTime: number }) {
    this.y -= (this.speed * deltaTime) / 1000; // deltaTime is ms so we divide by 1000
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  isDead(player) {
    const outOfBounds = this.y < 0 - this.radius;
    const collidesWithPlayer = Entity.testCollision(player, this);
    return outOfBounds || collidesWithPlayer;
  }
}
