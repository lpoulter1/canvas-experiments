import { Entity, Collision } from "./Enity";
import { Paddle } from "./Paddle";

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

  testCollision(player: Paddle, ball: Ball) {
    // this is a waaaaaay simplified collision that just works in this case (circle always comes from the bottom)
    const topOfBallIsAboveBottomOfRect =
      ball.position.y - ball.radius <= player.position.y + player.height / 2;
    const bottomOfBallIsBelowTopOfPlayer =
      ball.position.y + ball.radius >= player.position.y - player.height / 2;
    const ballIsRightOfPlayerLeftSide =
      ball.position.x + ball.radius >= player.position.x - player.width / 2;
    const ballIsLeftOfPlayerRightSide =
      ball.position.x - ball.radius <= player.position.x + player.width / 2;
    return (
      topOfBallIsAboveBottomOfRect &&
      bottomOfBallIsBelowTopOfPlayer &&
      ballIsRightOfPlayerLeftSide &&
      ballIsLeftOfPlayerRightSide
    );
  }

  isDead(player: Entity) {
    if (player instanceof Paddle) {
      const outOfBounds = this.position.y < 0 - this.radius;
      if (outOfBounds) return true;
      const collidesWithPlayer = this.testCollision(player, this);
      return collidesWithPlayer;
    }
    return false;
  }
}
