import Konva from "konva";
import {CanvasImage} from "./core/CanvasImage";
import {getScaledImageCoordinates} from "./core/utilities";
import {
	getHorizontalScrollbar,
	getStageBounds,
	getVerticalScrollBar, scrollBarHeight, scrollBarWidth,
	scrollPadding
} from "../components/ImageAnnotation/utilities";
import {CustomEventType} from "./core/constants";

export const paddingFactor = 0.02
const callBackTimeout = 100
const wheelingTimeout = 70

export class CanvasScene {
	appId
	// Konva.Stage
	stage
	// ------------- Scrollbars variables ------------- //
	scrollLayer = new Konva.Layer()
	verticalBar
	horizontalScrollBar
	// ------------- End Scrollbars variables ----------//

	// Konva.Layer
	imageLayer = new Konva.Layer()
	annotationLayer = new Konva.Layer()
	toolLayer = new Konva.Layer()
	proposalLayer = new Konva.Layer()

	containerElementId
	// Konva.Image
	konvaImage

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
		this.stage.add(this.imageLayer)
		this.proposalLayer.hide()
		this.stage.add(this.annotationLayer)
		this.stage.add(this.proposalLayer)
		this.stage.add(this.toolLayer)
		this.stageDimensions = { width: this.stage.width(), height: this.stage.height() };
		this.container = { width: element.clientWidth, height: element.clientHeight}
		this.attachEventListeners()
		this.addScrollbars()
	}

	setStageDraggable(value) {
		this.stage.draggable(value)
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
		}, [
			this.imageLayer,
			this.annotationLayer,
			this.scrollLayer,
			this.toolLayer,
			this.proposalLayer
		])
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
		// Hide scroll layer when zoom start called
		this.scrollLayer.isVisible() && this.scrollLayer.hide()
	}

	// This method will be overriden by child class
	resizeCanvasStroke(scale) {

	}

	handleStopZoom() {
		this.zoomAnime.stop()
		this.stage.batchDraw()
		this.repositionStageAsPerScale()
		this.repositionScrollBars()
		this.resizeCanvasStroke(this.stage.scaleX())
	}

	attachEventListeners () {
		let wheeling
		this.stage.on('wheel', (e) => {
			e.evt.preventDefault()
			if (!wheeling) {

				// Hide label selector dropdown
				this.getSelectedAnnotation() && this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
			}
			this.handleScrollZoom(this.stage.getPointerPosition(), -e.evt.deltaY)
			clearTimeout(wheeling)
			wheeling = setTimeout(() => {
				this.handleStopZoom()

				// Show label selector dropdown
				this.getSelectedAnnotation() && this.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
					position: this.getLabelSelectorPosition()
				})
				wheeling = undefined
			}, wheelingTimeout)
		})
		this.stage.on('dragstart', (e) => {
			console.log(this.stage.position())
			e.target.getClassName && e.target.getClassName() === 'Stage' && this.scrollLayer.hide()
		})
		this.stage.on('dragend', () => {
			console.log(this.stage.position())
			this.repositionScrollBars()
		})
	}

	clickZoomInOut = (delta) => {
		const centerPos = {
			x: this.stage.width() / 2 + this.container.width * paddingFactor,
			y: this.stage.height() / 2 + this.container.height * paddingFactor
		}
		this.handleScrollZoom(centerPos, delta)
		// to clear timeout everytime we scroll
		// setting scrollend timeout to 70ms
		const wheeling = setTimeout(() => {
			clearTimeout(wheeling)
			this.handleStopZoom()
		}, 70)
	}

	// ------------- End Zoom Methods ------------ //

	// ------------- Scrollbar methods ------------- //
	addScrollbars() {
		const stage = this.stage
		stage.add(this.scrollLayer)
		this.verticalBar = getVerticalScrollBar(stage)
		// let verticalBarDragStartPos
		this.verticalBar.on('dragstart', () => {
			// verticalBarDragStartPos = this.verticalBar.position()
			this.setStageDraggable(false)
		})
		this.verticalBar.on('dragend', () => {
			// const scaleY = stage.scale().y
			// const availableHeight = stage.height() - scrollPadding * 2 - this.verticalBar.height();
			//
			// const diffY = this.verticalBar.position().y - verticalBarDragStartPos.y
			// const ratio = stage.height() / availableHeight
			// console.log('delta', availableHeight, stage.height(), diffY, ratio)
			// this.stage.y(this.stage.y() - diffY * ratio)
			// this.stage.batchDraw()
			this.setStageDraggable(true)
		})

		this.horizontalScrollBar = getHorizontalScrollbar(stage)
		this.horizontalScrollBar.on('dragstart', () => {
			this.setStageDraggable(false)
		})
		this.horizontalScrollBar.on('dragend', () => {
			this.setStageDraggable(true)
		})

		this.scrollLayer.add(this.verticalBar, this.horizontalScrollBar);
		this.scrollLayer.draw();
	}

	repositionScrollBars() {
		const stage = this.stage
		const scaleX = stage.scale().x
		const scaleY = stage.scale().y
		const stagePosition = this.stage.position()
		if (!(scaleX === 1 && scaleY === 1)) {
			this.scrollLayer.show()
			const x = Math.abs(stage.position().x) / scaleX
			const y = Math.abs(stage.position().y) / scaleY
			const scrollWidth = scrollBarWidth / scaleX
			const scaledStageWidth = stage.width() / scaleX
			const scrollHeight = scrollBarHeight / scaleY
			const scaledStageHeight = stage.height() / scaleY

			// Reposition vertical scroll bar
			this.verticalBar.x(x + scaledStageWidth - scrollWidth - (scrollPadding / scaleX))
			this.verticalBar.y(y + (scrollPadding / scaleY) + ((Math.abs(stagePosition.y) / scaleY) / scaleY) * 0.98)
			this.verticalBar.width(scrollWidth)
			this.verticalBar.height(scaledStageHeight * 0.98 / scaleY)

			// Reposition horizontal scroll bar
			this.horizontalScrollBar.x(x + (scrollPadding / scaleX) + ((Math.abs(stagePosition.x) / scaleX) / scaleX) * 0.98)
			this.horizontalScrollBar.y(y + scaledStageHeight - scrollHeight - (scrollPadding / scaleY))
			this.horizontalScrollBar.height(scrollHeight)
			this.horizontalScrollBar.width(scaledStageWidth * 0.98 / scaleX)

			this.scrollLayer.draw()
		}
	}
	// ------------- End Scrollbar methods ------------- //

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
				this.konvaImage.image(image)
				this.konvaImage.width(width)
				this.konvaImage.height(height)
				this.konvaImage.x(imagePosition.x)
				this.konvaImage.y(imagePosition.y)
			} else {
				this.konvaImage = new Konva.Image({
					x: imagePosition.x,
					y: imagePosition.y,
					image: image,
					width,
					height
				});
				this.imageLayer.add(this.konvaImage)
			}
			this.imageLayer.draw();
			this.setLoader(false);
			this.imageDimensions = { width: image.width, height: image.height }

			// Align stage
			this.clickZoomInOut(1)
			this.clickZoomInOut(-10)

			// Timeout for smooth loader hide
			setTimeout(() => {
				callback()
			}, callBackTimeout)
		});
	}

	getSelectedAnnotation = () => {}

	getLabelSelectorPosition = () => {}

	dispatch = (eventType, payload) => {}
}
