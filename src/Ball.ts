import { Entity, testCollision, Collision } from "./Enity";

export class Ball implements Entity {
  speed: number;
  radius: number;
  position: { x: number; y: number };
  collision: Collision;

  constructor(position: { x: number; y: number }) {
    this.position = position;
    this.collision = "circle";
    this.speed = 300; // px per second
    this.radius = 10; // radius in px
  }

  update({ deltaTime }: { deltaTime: number }) {
    this.position.y -= (this.speed * deltaTime) / 1000; // deltaTime is ms so we divide by 1000
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  isDead(player: Entity) {
    const outOfBounds = this.position.y < 0 - this.radius;
    if (outOfBounds) return true;
    const collidesWithPlayer = testCollision(player, this);
    return collidesWithPlayer;
  }
}
