import { KeyMappings } from "../core/constants";

export class Tool {
  toolType;
  canvasManager;
  imageLabels;

  constructor(canvasManager, data, imageLabels) {
    this.canvasManager = canvasManager;
    this.imageLabels = imageLabels;
    this.addEventListeners();
  }

  onKeyDown = (event) => {
    switch (event.keyCode) {
      case KeyMappings.Escape:
        // this.exit();
        break;
      default:;
    }
  };

  addEventListeners() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  // will be overriden by child class
  exitTool() {}

  // exit() {
  //   this.exitTool();
  //   window.removeEventListener("keydown", this.onKeyDown);
  // }
}
