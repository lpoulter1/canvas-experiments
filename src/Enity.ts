export class Entity {
  collision: string;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.collision = "none";
    this.x = x;
    this.y = y;
  }

  update() {
    console.warn(`${this.constructor.name} needs an update() function`);
  }
  draw() {
    console.warn(`${this.constructor.name} needs a draw() function`);
  }
  isDead() {
    console.warn(`${this.constructor.name} needs an isDead() function`);
  }

  static testCollision(a, b) {
    if (a.collision === "none") {
      console.warn(`${a.constructor.name} needs a collision type`);
      return undefined;
    }
    if (b.collision === "none") {
      console.warn(`${b.constructor.name} needs a collision type`);
      return undefined;
    }
    if (a.collision === "circle" && b.collision === "circle") {
      return (
        Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) < a.radius + b.radius
      );
    }
    if (
      (a.collision === "circle" && b.collision === "rect") ||
      (a.collision === "rect" && b.collision === "circle")
    ) {
      let circle = a.collision === "circle" ? a : b;
      let rect = a.collision === "rect" ? a : b;
      // this is a waaaaaay simplified collision that just works in this case (circle always comes from the bottom)
      const topOfBallIsAboveBottomOfRect =
        circle.y - circle.radius <= rect.y + rect.height / 2;
      const bottomOfBallIsBelowTopOfRect =
        circle.y + circle.radius >= rect.y - rect.height / 2;
      const ballIsRightOfRectLeftSide =
        circle.x + circle.radius >= rect.x - rect.width / 2;
      const ballIsLeftOfRectRightSide =
        circle.x - circle.radius <= rect.x + rect.width / 2;
      return (
        topOfBallIsAboveBottomOfRect &&
        bottomOfBallIsBelowTopOfRect &&
        ballIsRightOfRectLeftSide &&
        ballIsLeftOfRectRightSide
      );
    }
    console.warn(
      `there is no collision function defined for a ${a.collision} and a ${b.collision}`
    );
    return undefined;
  }
}
