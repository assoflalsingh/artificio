import Konva from "konva";
import {CanvasImage} from "./core/CanvasImage";
import {getScaledImageCoordinates} from "./core/utilities";
import {getStageBounds} from "../components/ImageAnnotation/utilities";
const paddingFactor = 0.02

export class CanvasScene {
	appId
	// Konva.Stage
	stage
	// Konva.Layer
	imageLayer = new Konva.Layer()
	containerElementId
	// Konva.Image
	konvaImage
	annotationLayer = new Konva.Layer();
	// { width: number; height: number };
	imageDimensions
	// { width: number; height: number };
	stageDimensions
	// { width: number; height: number };
	container

	// ------------- Zoom Variables ------------ //
	zoomDelta
	zoomPosition
	zoomAnime
	oldScale = 1 / (1 - 2 * paddingFactor) // Initial value
	constrainedScale = 1
	initialScale = 1
	// ------------- End Zoom Variables ------------ //

	constructor(containerElementId) {
		this.appId = containerElementId;
		this.initializeCanvas(containerElementId);
	}

	initializeCanvas(containerElementId) {
		this.containerElementId = containerElementId;
		const element = document.getElementById(this.containerElementId)
		this.stage = new Konva.Stage({
			container: containerElementId,
			width: element.clientWidth,
			height: element.clientHeight,
			draggable: true,
			dragBoundFunc: pos =>
				getStageBounds(
					pos,
					this.stage,
					this.initialScale,
					this.oldScale,
					element.clientWidth,
					element.clientHeight
				)
		});
		this.stage.add(this.imageLayer);
		this.stage.add(this.annotationLayer);
		this.stageDimensions = { width: this.stage.width(), height: this.stage.height() };
		this.container = { width: element.clientWidth, height: element.clientHeight}
		this.attachZoomEventListeners()
	}

	// ------------- Zoom Methods ------------ //
	calculateStagePosition(
		position,
		newScale,
		oldScale
	) {
		const mousePointTo = {
			x: position.x / oldScale - this.stage.x() / oldScale,
			y: position.y / oldScale - this.stage.y() / oldScale
		}
		return {
			x: -(mousePointTo.x - position.x / newScale) * newScale,
			y: -(mousePointTo.y - position.y / newScale) * newScale
		}
	}

	createZoomAnimation = () => {
		return new Konva.Animation(frame => {
			const d = (Math.abs(this.zoomDelta) > 150 ? 150 : Math.abs(this.zoomDelta)) / 25
			const scaleBy = (0.02 * d * (frame.timeDiff + 10)) / 16.667 + 1
			let newScale = this.zoomDelta > 0 ? this.oldScale * scaleBy : this.oldScale / scaleBy
			let newPos
			if (newScale > this.constrainedScale) {
				newPos = this.calculateStagePosition(this.zoomPosition, newScale, this.oldScale)
			} else {
				newScale = this.constrainedScale
				/* removing the repositioning to {x:0, y:0} */
				newPos = this.calculateStagePosition(this.zoomPosition, newScale, this.oldScale)
			}
			this.oldScale = newScale
			this.stage.scale({x: newScale, y: newScale})
			this.stage.position(newPos)
		}, [this.imageLayer, this.annotationLayer])
	}

	repositionStageAsPerScale() {
		const wheelUpPosition = getStageBounds(
			this.stage.position(),
			this.stage,
			this.initialScale,
			this.oldScale,
			this.container.width,
			this.container.height
		)
		this.stage.position(wheelUpPosition)
	}

	handleScrollZoom(position, delta) {
		this.zoomDelta = delta
		this.zoomPosition = position
		if (!this.zoomAnime) {
			this.zoomAnime = this.createZoomAnimation()
		}
		if (!this.zoomAnime.isRunning()) {
			this.zoomAnime.start()
		}
	}

	handleStopZoom() {
		this.zoomAnime.stop()
		this.stage.batchDraw()
		this.repositionStageAsPerScale()
	}

	attachZoomEventListeners () {
		let wheeling
		this.stage.on('wheel', (e) => {
			e.evt.preventDefault()
			this.handleScrollZoom(this.stage.getPointerPosition(), -e.evt.deltaY)
			clearTimeout(wheeling)
			wheeling = setTimeout(() => {
				this.handleStopZoom()
				wheeling = undefined
			}, 70)
		})
	}

	// ------------- End Zoom Methods ------------ //

	setLoader(show) {}

	getImagePosition(imageWidth, imageHeight) {
		return {
			x: (this.stage.width() / 2) - (imageWidth / 2),
			y: (this.stage.height() / 2) - (imageHeight / 2)
		}
	}

	setImage(imageUrl, callback) {
		this.setLoader(true);
		const element = document.getElementById(this.containerElementId)
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
					y: paddingFactor
				});
			const imagePosition = this.getImagePosition(width, height)
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
					height
				});
				this.imageLayer.add(this.konvaImage);
			}
			this.imageLayer.draw();
			this.setLoader(false);
			callback()
			this.imageDimensions = { width: image.width, height: image.height };
		});
	}
}
