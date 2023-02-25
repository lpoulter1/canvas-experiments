import { InputsManager } from "./InputsManager";
// import { Paddle } from "./Paddle";

export type FrameData = {
  deltaTime: number;
  inputs: InputsManager;
};

export type Collision = "circle" | "rect";

export type Entity = {
  position: { x: number; y: number };
  collision: Collision;
  isDead: (e: Entity) => boolean;
  update: (frameData: FrameData) => void;
  draw: (c: CanvasRenderingContext2D) => void;
};

export function testCollision(a: Entity, b: Entity) {
  // need to narrow the type when I have google to remind me how
  if (a.collision === "circle" && b.collision === "circle") {
    return (
      Math.sqrt(
        (a.position.x - b.position.x) ** 2 + (a.position.y - b.position.y) ** 2
      ) <
      a.radius + b.radius
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
      circle.position.y - circle.radius <= rect.position.y + rect.height / 2;
    const bottomOfBallIsBelowTopOfRect =
      circle.position.y + circle.radius >= rect.position.y - rect.height / 2;
    const ballIsRightOfRectLeftSide =
      circle.position.x + circle.radius >= rect.position.x - rect.width / 2;
    const ballIsLeftOfRectRightSide =
      circle.position.x - circle.radius <= rect.position.x + rect.width / 2;
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
  return false;
}

// export abstract class Entity {
//   // how to say these methods are only required in subclasses? Abstract class?
//   update(frameData: {
//     deltaTime: number;
//     inputs: import("./InputsManager").InputsManager;
//   }): void {
//     throw new Error("Method not implemented.");
//   }
//   draw(context: CanvasRenderingContext2D): void {
//     throw new Error("Method not implemented.");
//   }

//   collision: string;
//   x: number;
//   y: number;

//   constructor(x: number, y: number) {
//     this.collision = "none";
//     this.position.x = x;
//     this.y = y;
//   }

//   static testCollision(a: Entity, b: Entity) {
//     // need to narrow the type when I have google to remind me how
//     if (a.collision === "circle" && b.collision === "circle") {
//       return (
//         Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) < a.radius + b.radius
//       );
//     }
//     if (
//       (a.collision === "circle" && b.collision === "rect") ||
//       (a.collision === "rect" && b.collision === "circle")
//     ) {
//       let circle = a.collision === "circle" ? a : b;
//       let rect = a.collision === "rect" ? a : b;
//       // this is a waaaaaay simplified collision that just works in this case (circle always comes from the bottom)
//       const topOfBallIsAboveBottomOfRect =
//         circle.y - circle.radius <= rect.y + rect.height / 2;
//       const bottomOfBallIsBelowTopOfRect =
//         circle.y + circle.radius >= rect.y - rect.height / 2;
//       const ballIsRightOfRectLeftSide =
//         circle.x + circle.radius >= rect.x - rect.width / 2;
//       const ballIsLeftOfRectRightSide =
//         circle.x - circle.radius <= rect.x + rect.width / 2;
//       return (
//         topOfBallIsAboveBottomOfRect &&
//         bottomOfBallIsBelowTopOfRect &&
//         ballIsRightOfRectLeftSide &&
//         ballIsLeftOfRectRightSide
//       );
//     }
//     console.warn(
//       `there is no collision function defined for a ${a.collision} and a ${b.collision}`
//     );
//     return false;
//   }
// }
