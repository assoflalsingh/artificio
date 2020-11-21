import {Tool} from "./tool";
import {ToolType} from "../core/constants";
import {CursorPointerCrossHair} from "../core/utilities";

export class RectangleTool extends Tool {
	tempCrossHairCursor

	constructor(canvasManager) {
		super(canvasManager);
		this.toolType = ToolType.Rectangle
		this.initializeTool()
	}

	initializeTool() {
		this.addTempCrossHairs()
		this.changeMouseBehaviour('crosshair')
	}

	changeMouseBehaviour(cursorType) {
		document.body.style.cursor = cursorType
	}

	addTempCrossHairs() {
		this.tempCrossHairCursor = CursorPointerCrossHair(
			{
				width: this.canvasManager.stage.width(),
				height: this.canvasManager.stage.height()
			},
			this.canvasManager.stage.scaleX()
		)
		this.canvasManager.addToolFigure(this.tempCrossHairCursor)
	}

	onMouseMove(pointer) {
		if (this.tempCrossHairCursor) {
			const upperLeftPoint = this.canvasManager.annotationLayer.position()
			this.tempCrossHairCursor
				.getChildren()[0]
				.points([
					-upperLeftPoint.x,
					pointer.y,
					this.canvasManager.stage.width(),
					pointer.y
				])
			this.tempCrossHairCursor
				.getChildren()[1]
				.points([
					pointer.x,
					-upperLeftPoint.y,
					pointer.x,
					this.canvasManager.stage.height()
				])

			this.canvasManager.toolLayerDraw()
		}
	}

	onDragEnd() {

	}

	onDragStart() {

	}

	onMouseOut() {

	}

	exitTool() {
		this.canvasManager.removeToolFigure(this.tempCrossHairCursor)
	}

	eventListeners = [
		{
			event: 'mousemove',
			func: this.onMouseMove.bind(this)
		},
		{
			event: 'mouseup',
			func: this.onDragEnd.bind(this)
		},
		{
			event: 'mousedown',
			func: this.onDragStart.bind(this)
		},
		{
			element: document.getElementById(this.canvasManager.appId),
			event: 'mouseout',
			func: this.onMouseOut.bind(this)
		}
	]
}
