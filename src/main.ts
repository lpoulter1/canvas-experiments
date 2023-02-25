class Ball extends Entity {
  speed: number;
  radius: number;
  constructor(x, y) {
    super(x, y);
    this.collision = "circle";
    this.speed = 300; // px per second
    this.radius = 10; // radius in px
  }

  update({ deltaTime }) {
    this.position.y -= (this.speed * deltaTime) / 1000; // deltaTime is ms so we divide by 1000
  }

  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  isDead(player) {
    const outOfBounds = this.position.y < 0 - this.radius;
    const collidesWithPlayer = Entity.testCollision(player, this);
    return outOfBounds || collidesWithPlayer;
  }
}

class Paddle extends Entity {
  speed: number;
  width: number;
  height: number;
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

class InputsManager {
  direction: number;
  constructor() {
    this.direction = 0;
    window.addEventListener("keydown", this.onKeydown.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
  }

  onKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        this.direction = -1;
        break;
      case "ArrowRight":
        this.direction = 1;
        break;
    }
  }

  onKeyup(event) {
    switch (event.key) {
      case "ArrowLeft":
        if (this.direction === -1) this.direction = 0;
        break;
      case "ArrowRight":
        this.direction = 1;
        if (this.direction === 1) this.direction = 0;
        break;
    }
  }
}

export {};
