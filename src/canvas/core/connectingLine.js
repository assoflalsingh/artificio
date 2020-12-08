import {LabelContainerId, LabelId} from "../../components/ImageAnnotation/label/LabelsContainer";
import Konva from "konva";
import {AnnotationCircleRadius, AnnotationStrokeWidth} from "../annotations/Annotation";

export class ConnectingLine {
	canvasManager
	connectingLine

	constructor(canvasManager) {
		this.canvasManager = canvasManager
		this.initialize()
	}

	getConnectingLineEndPoint(pointer) {
		const canvas = document.getElementById(this.canvasManager.appId);
		const canvasBoundingRect = canvas.getBoundingClientRect();
		pointer.x = pointer.x - canvasBoundingRect.x
		pointer.y = pointer.y - canvasBoundingRect.y

		const stage = {
			x: this.canvasManager.annotationLayer.x() * this.canvasManager.stage.scale().x + this.canvasManager.stage.x(),
			y: this.canvasManager.annotationLayer.y() * this.canvasManager.stage.scale().y + this.canvasManager.stage.y(),
		};

		pointer.x = pointer.x - stage.x
		pointer.y = pointer.y - stage.y

		pointer.x /= this.canvasManager.stage.scale().x;
		pointer.y /= this.canvasManager.stage.scale().y;

		return pointer
	}

	isLabelInView() {
		const selectedAnnotation = this.canvasManager.getSelectedAnnotation()
		const labelContainer = document.getElementById(LabelContainerId)
		const boundingRect = labelContainer.getBoundingClientRect()
		const labelElementBoundingRect = document.getElementById(`${LabelId}-${selectedAnnotation.id}`).getBoundingClientRect()
		return labelElementBoundingRect.y >= boundingRect.y && labelElementBoundingRect.y <= (boundingRect.y + boundingRect.height)
	}

	initialize() {
		const selectedAnnotation = this.canvasManager.getSelectedAnnotation()
		const labelElement = selectedAnnotation && document.getElementById(`${LabelId}-${selectedAnnotation.id}`)
		if (selectedAnnotation && labelElement && this.isLabelInView()) {
			const scale = this.canvasManager.stage.scaleX()
			const canvas = document.getElementById(this.canvasManager.appId)
			const bounds = canvas.getBoundingClientRect()
			const labelElementBounds = labelElement.getBoundingClientRect()
			const labelY = labelElementBounds.y + labelElementBounds.height/2
			const pointer = this.getConnectingLineEndPoint({x: bounds.x + bounds.width, y: labelY})
			const annotationPointer = selectedAnnotation.getConnectingLineStartPosition()
			const c1 = new Konva.Circle({
				x: annotationPointer.x,
				y: annotationPointer.y,
				fill: selectedAnnotation.color,
				radius: AnnotationCircleRadius / scale
			})
			const c2 = new Konva.Circle({
				x: pointer.x,
				y: pointer.y,
				fill: selectedAnnotation.color,
				radius: AnnotationCircleRadius / scale
			})
			const line = new Konva.Line({
				points: [annotationPointer.x, annotationPointer.y, pointer.x, pointer.y],
				stroke: selectedAnnotation.color,
				strokeWidth: AnnotationStrokeWidth / scale,
			})
			this.connectingLine = new Konva.Group()
			this.connectingLine.add(c1, c2, line)
		}
	}

	getShape() {
		return this.connectingLine
	}
}
