import Konva from "konva";
import Annotation, {AnnotationCircleRadius, AnnotationCircleStrokeWidth, AnnotationStrokeWidth} from "./Annotation";
import {createCircle} from "../core/utilities";

export default class RectangleAnnotation extends Annotation {
	rectangle
	circles = []
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
	constructor(annotationData, scale) {
		super(annotationData, scale)
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
			strokeWidth: AnnotationCircleStrokeWidth / this.scale
		});
		const topRight = createCircle({
			x: this.annotationData.dimensions.w,
			y: 0,
			radius: AnnotationCircleRadius/this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale
		});
		const bottomRight = createCircle({
			x: this.annotationData.dimensions.w,
			y: this.annotationData.dimensions.h,
			radius: AnnotationCircleRadius / this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale
		});
		const bottomLeft = createCircle({
			x: 0,
			y: this.annotationData.dimensions.h,
			radius: AnnotationCircleRadius / this.scale,
			fill: 'white',
			stroke: this.annotationData.color,
			strokeWidth: AnnotationCircleStrokeWidth / this.scale
		});
		this.circles = [topLeft, topRight, bottomRight, bottomLeft]
		this.group.add(topLeft, topRight, bottomRight, bottomLeft)
	}

	resizeAnnotationStroke() {
		this.rectangle.strokeWidth(AnnotationStrokeWidth/this.scale)
		this.circles.forEach(circle => {
			circle.radius(AnnotationCircleRadius / this.scale)
			circle.strokeWidth(AnnotationCircleStrokeWidth / this.scale)
		})

		// Recreate Label
		this.label.destroy()
		this.label.destroyChildren()
		this.addLabel()
	}

	getLabelPosition() {
		return {
			x: this.rectangle.width(),
			y: this.rectangle.height()
		}
	}

	// Return type of Konva.Group
	getShape() {
		return this.group
	}
}
