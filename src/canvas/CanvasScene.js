import Konva from "konva";
import {CanvasImage} from "./core/CanvasImage";
import {getScaledImageCoordinates} from "./core/utilities";

export class CanvasScene {
	appId
	stage
	imageLayer
	containerElementId
	konvaImage
	annotationLayer =  new Konva.Layer();
	// { width: number; height: number };
	imageDimensions
	// { width: number; height: number };
	stageDimensions

	constructor(containerElementId) {
		this.appId = containerElementId;
		this.initializeCanvas(containerElementId);
	}

	initializeCanvas(containerElementId) {
		this.containerElementId = containerElementId;
		this.stage = new Konva.Stage({
			container: containerElementId
		});
		this.stage.add(this.imageLayer);
		this.stage.add(this.annotationLayer);
	}


	setLoader(show) {}

	setImage(imageUrl) {
		this.setLoader(true);
		const element = document.getElementById(this.containerElementId) as HTMLElement;
		const canvasImage = new CanvasImage(imageUrl);
		canvasImage.onLoad((image) => {
			const containerWidth = element.clientWidth;
			const containerHeight = element.clientHeight;
			const { width, height } = getScaledImageCoordinates(containerWidth, containerHeight, image.width, image.height, {
				x: 0,
				y: 0
			});

			this.stage.width(width);
			this.stage.height(height);
			if (this.konvaImage) {
				this.konvaImage.image(image);
				this.konvaImage.width(width);
				this.konvaImage.height(height);
			} else {
				this.konvaImage = new Konva.Image({
					x: 0,
					y: 0,
					image: image,
					width,
					height
				});
				this.imageLayer.add(this.konvaImage);
			}
			this.imageLayer.draw();
			this.setLoader(false);
			this.imageDimensions = { width: image.width, height: image.height };
			this.stageDimensions = { width: this.stage.width(), height: this.stage.height() };
		});
	}
}
