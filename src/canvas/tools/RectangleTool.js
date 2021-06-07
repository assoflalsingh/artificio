import * as uuid from "uuid";
import { Tool } from "./tool";
import { ToolType } from "../core/constants";
import {
  CursorPointerCrossHair,
  generateRandomColor,
  TempRectangle,
} from "../core/utilities";
import Rectangle from "../annotations/Rectangle";
import { DefaultLabel } from "../../components/ImageAnnotation/label/LabelSelector";

export class RectangleTool extends Tool {
  tempCrossHairCursor;
  tempRectangle;
  imageLabels;

  constructor(canvasManager, data, imageLabels) {
    super(canvasManager, data, imageLabels);
    this.toolType = ToolType.Rectangle;
    this.initializeTool();
  }

  initializeTool() {
    this.addTempCrossHairs();
    this.changeMouseBehaviour("crosshair");
  }

  changeMouseBehaviour(cursorType) {
    document.body.style.cursor = cursorType;
  }

  addTempCrossHairs() {
    this.tempCrossHairCursor = CursorPointerCrossHair(
      {
        width: this.canvasManager.stage.width(),
        height: this.canvasManager.stage.height(),
      },
      this.canvasManager.stage.scaleX()
    );
    this.canvasManager.addToolShape(this.tempCrossHairCursor);
  }

  addTempRectangle() {
    this.tempRectangle = TempRectangle(this.canvasManager.stage.scaleX());
    this.canvasManager.addToolShape(this.tempRectangle);
  }

  redrawCrossHair(pointer) {
    if (this.tempCrossHairCursor) {
      const upperLeftPoint = this.canvasManager.annotationLayer.position();
      this.tempCrossHairCursor
        .getChildren()[0]
        .points([
          -upperLeftPoint.x,
          pointer.y,
          this.canvasManager.stage.width(),
          pointer.y,
        ]);
      this.tempCrossHairCursor
        .getChildren()[1]
        .points([
          pointer.x,
          -upperLeftPoint.y,
          pointer.x,
          this.canvasManager.stage.height(),
        ]);

      this.canvasManager.toolLayerDraw();
    }
  }

  getRectangleCoordinates() {
    let x = this.tempRectangle.x(),
      y = this.tempRectangle.y(),
      w = this.tempRectangle.width(),
      h = this.tempRectangle.height();
    if (w < 0) {
      x += w;
      w = Math.abs(w);
    }
    if (h < 0) {
      y += h;
      h = Math.abs(h);
    }
    return { x, y, w, h };
  }

  onMouseMove(pointer) {
    if (this.tempRectangle) {
      const height = pointer.y - this.tempRectangle.y();
      const width = pointer.x - this.tempRectangle.x();
      this.tempRectangle.height(height);
      this.tempRectangle.width(width);
    }
    this.redrawCrossHair(pointer);
  }

  onDragEnd() {
    const dimensions = this.getRectangleCoordinates();
    const annotationData = {
      dimensions,
      id: uuid.v4(),
      color: generateRandomColor(),
      label: DefaultLabel.label_value,
    };
    const rectangle = new Rectangle(
      annotationData,
      this.canvasManager.stage.scaleX(),
      this.imageLabels
    );
    // check if previous added Rectangle was assigned a label if not then remove it...
    let previousAddedRect =
      this.canvasManager.annotations[
        this.canvasManager.annotations.length - 1
      ] || [];
    if (
      previousAddedRect &&
      previousAddedRect.annotationData?.label === DefaultLabel.label_value
    ) {
      this.canvasManager.deleteAnnotation(previousAddedRect.id);
    }
    this.canvasManager.addAnnotation(rectangle);
    this.canvasManager.setStageDraggable(true);
    this.tempRectangle &&
      this.canvasManager.removeToolShape(this.tempRectangle);
  }

  onDragStart(pointer) {
    this.canvasManager.setStageDraggable(false);
    this.addTempRectangle();
    this.tempRectangle.position({
      x: pointer.x,
      y: pointer.y,
    });
  }

  onMouseOut(pointer) {}

  resizeCanvasStroke(scale) {
    if (this.tempCrossHairCursor) {
      this.tempCrossHairCursor.getChildren().forEach((child) => {
        child.strokeWidth(1 / scale);
        child.dash([5 / scale, 5 / scale]);
      });
    }
  }

  exitTool() {
    this.changeMouseBehaviour("default");
    this.canvasManager.removeToolShape(this.tempCrossHairCursor);
    this.tempRectangle &&
      this.canvasManager.removeToolShape(this.tempRectangle);
  }

  eventListeners = [
    {
      event: "mousemove",
      func: this.onMouseMove.bind(this),
    },
    {
      event: "mouseup",
      func: this.onDragEnd.bind(this),
    },
    {
      event: "mousedown",
      func: this.onDragStart.bind(this),
    },
    {
      element: document.getElementById(this.canvasManager.appId),
      event: "mouseout",
      func: this.onMouseOut.bind(this),
    },
  ];
}
