import Konva from "konva";
import Annotation, {AnnotationCircleRadius, AnnotationCircleStrokeWidth, AnnotationStrokeWidth} from "./Annotation";
import {createCircle} from "../core/utilities";
import {AnnotationType} from "../core/constants";

export default class RectangleAnnotation extends Annotation {
	rectangle
	circles = []
	strokeWidth = AnnotationStrokeWidth
	/**
	 * @param annotationData
	 * {
			dimensions: {x: number, y: number, w: number, h: number};
			id: string;
			color: string;
			label: string;
		}
	 * @param scale
	 */
	constructor(annotationData, scale, imageLabels) {
		super(annotationData, scale, imageLabels)
		this.type = AnnotationType.Rectangle
		this.initialize()
	}

	initialize() {
		const dimensions = this.annotationData.dimensions
		this.group.position({
			x: dimensions.x,
			y: dimensions.y,
		})
		this.createRectangle()
		this.addCircles()
		this.addLabel()
	}

	createRectangle() {
		const dimensions = this.annotationData.dimensions
		this.rectangle = new Konva.Rect({
			x: 0,
			y: 0,
			width: dimensions.w,
			height: dimensions.h,
			stroke: this.annotationData.color,
			strokeWidth: AnnotationStrokeWidth / this.scale
		})
		this.group.add(this.rectangle)
	}

	addCircles() {
		const topLeft = createCircle({
			x: 0,
			y: 0,
			radius: AnnotationCircleRadius / this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale,
			draggable: true
		});
		const topRight = createCircle({
			x: this.annotationData.dimensions.w,
			y: 0,
			radius: AnnotationCircleRadius/this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale,
			draggable: true
		});
		const bottomRight = createCircle({
			x: this.annotationData.dimensions.w,
			y: this.annotationData.dimensions.h,
			radius: AnnotationCircleRadius / this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale,
			draggable: true
		});
		const bottomLeft = createCircle({
			x: 0,
			y: this.annotationData.dimensions.h,
			radius: AnnotationCircleRadius / this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale,
			draggable: true
		});
		this.circles = [topLeft, topRight, bottomRight, bottomLeft]
		this.addEventListenersToCircles(topLeft, topRight, bottomRight, bottomLeft)
		this.group.add(topLeft, topRight, bottomRight, bottomLeft)
	}

	addEventListenersToCircles(topLeft, topRight, bottomRight, bottomLeft) {
		topLeft.on('dragmove', () => {
			topRight.y(topLeft.y())
			bottomLeft.x(topLeft.x())
			this.adjustRectangleDimensionsAndPosition()
		})
		topRight.on('dragmove', () => {
			topLeft.y(topRight.y())
			bottomRight.x(topRight.x())
			this.adjustRectangleDimensionsAndPosition()
		})
		bottomRight.on('dragmove', () => {
			bottomLeft.y(bottomRight.y())
			topRight.x(bottomRight.x())
			this.adjustRectangleDimensionsAndPosition()
		})
		bottomLeft.on('dragmove', () => {
			bottomRight.y(bottomLeft.y())
			topLeft.x(bottomLeft.x())
			this.adjustRectangleDimensionsAndPosition()
		})
		this.circles.forEach(c => {
			c.on('dragstart', () => {
				this.label && this.label.destroy()
				this.label && this.label.destroyChildren()
			})
			c.on('dragend', () => {
				this.addLabel()
			})
		})
	}

	adjustRectangleDimensionsAndPosition() {
		const width =
			// topRight.x() - topLeft.x()
			this.circles[1].x() - this.circles[0].x()
		const height =
			// bottomLeft.y() - topLeft.y()
			this.circles[3].y() - this.circles[0].y()

		const position = this.circles[0].position()

		this.rectangle.position(position)
		this.rectangle.width(width)
		this.rectangle.height(height)
	}

	resizeAnnotationStroke() {
		this.rectangle.strokeWidth(this.strokeWidth/this.scale)
		this.circles.forEach(circle => {
			circle.radius(AnnotationCircleRadius / this.scale)
			circle.strokeWidth(AnnotationCircleStrokeWidth / this.scale)
		})

		this.reCreateLabel()
	}

	getTopLeftCoordinates() {
		const coor = {x: Infinity, y: Infinity}
		// Get max position for circles
		this.circles.forEach(c => {
			if(c.x() < coor.x) {
				coor.x = c.x()
			}
			if(c.y() < coor.y) {
				coor.y = c.y()
			}
		})
		return coor
	}

	getBottomRightCoordinates() {
		const coor = {x: -Infinity, y: -Infinity}
		// Get max position for circles
		this.circles.forEach(c => {
			if(c.x() > coor.x) {
				coor.x = c.x()
			}
			if(c.y() > coor.y) {
				coor.y = c.y()
			}
		})
		return coor
	}

	getLabelPosition() {
		const position = this.getBottomRightCoordinates()
		return {
			x: position.x,
			y: position.y
		}
	}

	getLabelSelectorPosition() {
		const position = this.group.position()
		const topLeft = this.getBottomRightCoordinates();
		return {
			x: position.x + topLeft.x - Math.abs(this.rectangle.width()),
			y: position.y + topLeft.y,
		}
	}

	select() {
		this.circles.forEach(c => c.show())
		this.group.draggable(true)
		this.group.moveToTop()
		// this.rectangle.strokeWidth((this.strokeWidth + 5)/this.scale);
	}

	deSelect() {
		this.circles.forEach(c => c.hide())
		this.group.draggable(false)
		// this.rectangle.strokeWidth((this.strokeWidth - 5)/this.scale);
	}

	getArea() {
		return Math.abs(this.rectangle.width() * this.rectangle.height())
	}

	getData() {
		const position = this.group.position();
		const topLeft = this.getTopLeftCoordinates();
		const width = Math.abs(this.rectangle.width());
		const height = Math.abs(this.rectangle.height());
		const x1 = position.x + topLeft.x,
			y1 = position.y + topLeft.y,
			x2 = x1 + width,
			y2 = y1 + height
		return {
			coordinates: [x1, y1, x2, y2],
			label: this.annotationData.label,
			labelValue: this.getLabelValue(),
			id: this.id
		}
	}
}
