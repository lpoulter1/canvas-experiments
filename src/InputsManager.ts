export class InputsManager {
  direction: number;
  constructor() {
    this.direction = 0;
    window.addEventListener("keydown", this.onKeydown.bind(this));
    window.addEventListener("keyup", this.onKeyup.bind(this));
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        this.direction = -1;
        break;
      case "ArrowRight":
        this.direction = 1;
        break;
    }
  }

  onKeyup(event: KeyboardEvent) {
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
