import { InputsManager } from "./InputsManager";

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
