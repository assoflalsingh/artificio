import { horizontalScrollbarId } from "../../components/ImageAnnotation/canvas/CanvasWrapper";
import Konva from "konva";

const verticalPadding = 0.2;
export class HorizontalScrollBar {
  stage;
  layer = new Konva.Layer();
  width;
  startPosition;
  availableWidth;
  containerStage;
  containerStageStartPosition;
  scale;
  onDragMove;
  onDragStart;
  onDragEnd;

  constructor(onDragMove, onDragStart, onDragEnd, containerStage) {
    this.onDragMove = onDragMove;
    this.onDragStart = onDragStart;
    this.onDragEnd = onDragEnd;
    this.containerStage = containerStage;
    const elementHorizontalBar = document.getElementById(horizontalScrollbarId);
    this.stage = new Konva.Stage({
      container: horizontalScrollbarId,
      width: elementHorizontalBar.clientWidth,
      height: elementHorizontalBar.clientHeight,
    });
    this.stage.add(this.layer);
    this.initialize();
  }

  initialize() {
    this.scrollbar = new Konva.Rect({
      width: this.stage.width(),
      height: this.stage.height() * (1 - verticalPadding),
      fill: "grey",
      opacity: 0.6,
      x: 0,
      y: this.stage.height() * verticalPadding,
      cornerRadius: 4,
      draggable: true,
      dragBoundFunc: (pos) => {
        pos.x = Math.max(
          Math.min(pos.x, this.width - this.scrollbar.width()),
          0
        );
        pos.y = this.stage.height() * verticalPadding;
        return pos;
      },
    });
    this.addEventListeners();
    this.width = this.stage.width();
    this.layer.add(this.scrollbar);
    this.layer.draw();
  }

  addEventListeners() {
    this.scrollbar.on("dragstart", () => {
      this.startPosition = this.scrollbar.position();
      this.containerStageStartPosition = Object.assign(
        {},
        this.containerStage.position()
      );
      this.onDragStart();
    });
    this.scrollbar.on("dragmove", () => {
      this.dragMove();
    });
    this.scrollbar.on("dragend", () => {
      this.onDragEnd();
    });
  }

  dragMove() {
    const pos = this.scrollbar.position();
    const ratio = this.width / this.availableWidth;
    const diff = pos.x - this.startPosition.x;
    const allowedStageWidthBound =
      this.containerStage.width() - this.containerStage.width() * this.scale;
    this.onDragMove({
      x:
        this.containerStageStartPosition.x -
        diff * ratio * Math.abs(allowedStageWidthBound / this.width),
      y: this.containerStageStartPosition.y,
    });
  }

  reposition(scale) {
    this.scale = scale;
    if (scale === 1) {
      this.layer.hide();
    } else {
      this.layer.show();
      this.scrollbar.width(this.width / scale);
      this.availableWidth = this.width - this.scrollbar.width();
      const allowedStageWidthBound =
        this.containerStage.width() - this.containerStage.width() * scale;
      const ratio = this.availableWidth / Math.abs(allowedStageWidthBound);
      this.scrollbar.x(Math.abs(ratio * this.containerStage.position().x));
    }
    this.layer.batchDraw();
  }
}
