import Konva from "konva";
import {CanvasImage} from "./core/CanvasImage";
import {getScaledImageCoordinates} from "./core/utilities";
import {getStageBounds,} from "../components/ImageAnnotation/utilities";
import {VerticalScrollBar} from "./scroll/verticalScrollBar";
import {HorizontalScrollBar} from "./scroll/horizontalScrollBar";

export const paddingFactor = 0.02;
const callBackTimeout = 100;
const wheelingTimeout = 70;
const defaultStageScale = 0.97;
const defaultStagePadding = 10;

export class CanvasScene {
  appId;
  // Konva.Stage
  stage;
  // ------------- Scrollbars variables ------------- //
  verticalScrollBar;
  horizontalScrollBar;
  // ------------- End Scrollbars variables ----------//

  // Konva.Layer
  imageLayer = new Konva.Layer();
  annotationLayer = new Konva.Layer();
  toolLayer = new Konva.Layer();
  proposalLayer = new Konva.Layer();

  containerElementId;
  // Konva.Image
  konvaImage;

  // { width: number; height: number };
  imageDimensions;
  // { width: number; height: number };
  stageDimensions;
  // { width: number; height: number };
  container;

  // ------------- Zoom Variables ------------ //
  zoomDelta;
  zoomPosition;
  zoomAnime;
  oldScale = 1 / (1 - 2 * paddingFactor); // Initial value
  constrainedScale = 1;
  initialScale = 1;
  // ------------- End Zoom Variables ------------ //

  constructor(containerElementId) {
    this.appId = containerElementId;
    this.initializeCanvas(containerElementId);
  }

  initializeCanvas(containerElementId) {
    this.containerElementId = containerElementId;
    const element = document.getElementById(this.containerElementId);
    this.stage = new Konva.Stage({
      container: containerElementId,
      width: element.clientWidth,
      height: element.clientHeight,
      draggable: true,
      dragBoundFunc: (pos) =>
        getStageBounds(
          pos,
          this.stage,
          this.initialScale,
          this.oldScale,
          element.clientWidth,
          element.clientHeight
        ),
    });
    this.stage.add(this.imageLayer);
    this.proposalLayer.hide();
    this.stage.add(this.annotationLayer);
    this.stage.add(this.proposalLayer);
    this.stage.add(this.toolLayer);
    this.stageDimensions = {
      width: this.stage.width(),
      height: this.stage.height(),
    };
    this.container = {
      width: element.clientWidth,
      height: element.clientHeight,
    };
    this.attachEventListeners();
  }

  setStageDraggable = (value) => {
    this.stage.draggable(value);
  };

  // ------------- Zoom Methods ------------ //
  calculateStagePosition(position, newScale, oldScale) {
    const mousePointTo = {
      x: position.x / oldScale - this.stage.x() / oldScale,
      y: position.y / oldScale - this.stage.y() / oldScale,
    };
    return {
      x: -(mousePointTo.x - position.x / newScale) * newScale,
      y: -(mousePointTo.y - position.y / newScale) * newScale,
    };
  }

  createZoomAnimation = () => {
    return new Konva.Animation(
      (frame) => {
        const d =
          (Math.abs(this.zoomDelta) > 150 ? 150 : Math.abs(this.zoomDelta)) /
          25;
        const scaleBy = (0.02 * d * (frame.timeDiff + 10)) / 16.667 + 1;
        let newScale =
          this.zoomDelta > 0
            ? this.oldScale * scaleBy
            : this.oldScale / scaleBy;
        let newPos;
        if (newScale > this.constrainedScale) {
          newPos = this.calculateStagePosition(
            this.zoomPosition,
            newScale,
            this.oldScale
          );
        } else {
          newScale = this.constrainedScale;
          /* removing the repositioning to {x:0, y:0} */
          newPos = this.calculateStagePosition(
            this.zoomPosition,
            newScale,
            this.oldScale
          );
        }
        this.oldScale = newScale;
        this.stage.scale({ x: newScale, y: newScale });
        this.stage.position(newPos);
				this.repositionScrollBars();
      },
      [
        this.imageLayer,
        this.annotationLayer,
        this.toolLayer,
        this.proposalLayer,
      ]
    );
  };

  repositionStageAsPerScale() {
    const wheelUpPosition = getStageBounds(
      this.stage.position(),
      this.stage,
      this.initialScale,
      this.oldScale,
      this.container.width,
      this.container.height
    );
    this.stage.position(wheelUpPosition);
  }

  handleScrollZoom(position, delta) {
    this.zoomDelta = delta;
    this.zoomPosition = position;
    if (!this.zoomAnime) {
      this.zoomAnime = this.createZoomAnimation();
    }
    if (!this.zoomAnime.isRunning()) {
      this.zoomAnime.start();
    }
  }

  // This method will be overriden by child class
  resizeCanvasStroke(scale) {}

  handleStopZoom() {
    this.zoomAnime.stop();
    this.stage.batchDraw();
    this.repositionStageAsPerScale();
    this.resizeCanvasStroke(this.stage.scaleX());
  }

  attachEventListeners() {
    let wheeling;
    this.stage.on("wheel", (e) => {
      e.evt.preventDefault();
      if (!wheeling) {
        // Start scrolling
        // Hide label selector dropdown
        this.getSelectedAnnotation() && this.handleScrollZoomStart();
      }
      this.handleScrollZoom(this.stage.getPointerPosition(), -e.evt.deltaY);
      clearTimeout(wheeling);
      wheeling = setTimeout(() => {
        // Stop scrolling
        this.handleStopZoom();
        // Show label selector dropdown
        this.getSelectedAnnotation() && this.handleScrollZoomEnd();
        wheeling = undefined;
      }, wheelingTimeout);
    });
    this.stage.on("dragend", () => {
      this.repositionScrollBars();
    });
  }

  getCenterPosition() {
    return {
      x: this.stage.width() / 2 + this.container.width * paddingFactor,
      y: this.stage.height() / 2 + this.container.height * paddingFactor,
    };
  }

  clickZoomInOut = (delta) => {
    const centerPos = this.getCenterPosition();
    this.handleScrollZoom(centerPos, delta);
    // to clear timeout everytime we scroll
    // setting scrollend timeout to 70ms
    const wheeling = setTimeout(() => {
      clearTimeout(wheeling);
      this.handleStopZoom();
    }, 70);
  };

  // ------------- End Zoom Methods ------------ //

  // ------------- Scrollbar methods ------------- //
  addScrollbars() {
  	this.verticalScrollBar = new VerticalScrollBar(this.moveStage, this.stage)
  	this.horizontalScrollBar = new HorizontalScrollBar(this.moveStage, this.stage)
  }

  moveStage = (position) => {
		this.stage.position(position)
		this.stage.draw()
	}

  repositionScrollBars() {
  	this.verticalScrollBar && this.verticalScrollBar.reposition(this.stage.scaleX())
		this.horizontalScrollBar && this.horizontalScrollBar.reposition(this.stage.scaleX())
  }
  // ------------- End Scrollbar methods ------------- //

  setLoader(show) {}

  getImagePosition(imageWidth, imageHeight) {
    return {
      x: this.stage.width() / 2 - imageWidth / 2,
      y: this.stage.height() / 2 - imageHeight / 2,
    };
  }

  setImage(imageUrl, callback) {
    this.setLoader(true);
    const element = document.getElementById(this.containerElementId);
    const canvasImage = new CanvasImage(imageUrl);
    canvasImage.onLoad((image) => {
      const containerWidth = element.clientWidth;
      const containerHeight = element.clientHeight;
      const { width, height } = getScaledImageCoordinates(
        containerWidth,
        containerHeight,
        image.width,
        image.height,
        {
          x: paddingFactor,
          y: paddingFactor,
        }
      );
      const imagePosition = this.getImagePosition(width, height);
      if (this.konvaImage) {
        this.konvaImage.image(image);
        this.konvaImage.width(width);
        this.konvaImage.height(height);
        this.konvaImage.x(imagePosition.x);
        this.konvaImage.y(imagePosition.y);
      } else {
        this.konvaImage = new Konva.Image({
          x: imagePosition.x,
          y: imagePosition.y,
          image: image,
          width,
          height,
        });
        this.imageLayer.add(this.konvaImage);
      }
      this.imageLayer.draw();
      this.setLoader(false);
      this.imageDimensions = { width: image.width, height: image.height };

      // Align stage
      this.clickZoomInOut(1);
      this.clickZoomInOut(-10);

      // Timeout for smooth loader hide
      setTimeout(() => {
				this.addScrollbars();
        callback();
      }, callBackTimeout);
    });
  }

  fitImageToScreen() {
    const scale = this.stage.width() / this.konvaImage.width();
    this.stage.scale({
      x: scale * defaultStageScale,
      y: scale * defaultStageScale,
    });
    const position = this.konvaImage.position();
    this.stage.position({
      x: -position.x * this.stage.scaleX() + defaultStagePadding,
      y: -position.y * this.stage.scaleX() + defaultStagePadding,
    });
		this.oldScale = scale * defaultStageScale;
    this.repositionScrollBars();
    this.annotationLayer && this.resizeCanvasStroke(this.initialScale);
    this.stage.draw();
  }

  getSelectedAnnotation = () => {};

  handleScrollZoomStart = () => {};
  handleScrollZoomEnd = () => {};

  resizeCanvasStroke = () => {};
}
