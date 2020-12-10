import {verticalScrollbarId} from "../../components/ImageAnnotation/canvas/CanvasWrapper";
import Konva from "konva";

const horizontalPadding = 0.2

export class VerticalScrollBar {
	stage
	layer = new Konva.Layer()
	scrollbar
	height
	startPosition
	availableHeight
	moveStage
	containerStage
	containerStageStartPosition
	scale

	constructor(moveStage, containerStage) {
		this.moveStage = moveStage
		this.containerStage = containerStage
		const elementVerticalBar = document.getElementById(verticalScrollbarId)
		this.stage = new Konva.Stage({
			container: verticalScrollbarId,
			width: elementVerticalBar.clientWidth,
			height: elementVerticalBar.clientHeight,
		});
		this.stage.add(this.layer)
		this.initialize()
	}

	initialize() {
		this.scrollbar = new Konva.Rect({
			width: this.stage.width() * (1 - horizontalPadding),
			height: this.stage.height(),
			fill: "grey",
			opacity: 0.8,
			x: this.stage.width() * horizontalPadding,
			y: 0,
			cornerRadius: 4,
			draggable: true,
			dragBoundFunc: (pos) => {
				pos.x = this.stage.width() * horizontalPadding;
				pos.y = Math.max(Math.min(pos.y, this.height - this.scrollbar.height()), 0);
				return pos;
			},
		});
		this.height = this.stage.height()
		this.addEventListeners()
		this.layer.add(this.scrollbar)
		this.layer.draw()
	}

	addEventListeners() {
		this.scrollbar.on('dragstart', () => {
			this.startPosition = this.scrollbar.position()
			this.containerStageStartPosition = Object.assign({}, this.containerStage.position())
		})
		this.scrollbar.on('dragmove', () => {
			this.dragMove()
		})
	}

	dragMove() {
		const pos = this.scrollbar.position()
		const ratio = this.height/this.availableHeight
		const diff = pos.y - this.startPosition.y
		const allowedStageHeightBound = this.containerStage.height() - this.containerStage.height() * this.scale
		this.moveStage({
			x: this.containerStageStartPosition.x,
			y: this.containerStageStartPosition.y - diff * ratio * Math.abs(allowedStageHeightBound/this.height)

		})
	}

	reposition(scale) {
		this.scale = scale
		if(scale === 1) {
			this.layer.hide()
		} else {
			this.layer.show()
			const allowedStageHeightBound = this.containerStage.height() - this.containerStage.height() * scale
			this.scrollbar.height(this.height / this.scale)
			this.availableHeight = this.height - this.scrollbar.height()
			const ratio = this.availableHeight / Math.abs(allowedStageHeightBound)

			this.scrollbar.y(Math.abs(ratio * this.containerStage.position().y))
		}
		this.layer.batchDraw()
	}
}
