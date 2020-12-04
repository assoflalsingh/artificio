import Konva from "konva";
import Annotation, {AnnotationCircleRadius, AnnotationCircleStrokeWidth} from "./Annotation";
import {AnnotationType} from "../core/constants";
import {createCircle} from "../core/utilities";
const ProposalHoverColor = 'red'

export default class Proposal extends Annotation {
	rectangle
	strokeWidth = 2
	circles = []
	isSelected
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
		this.group.draggable(false)
		this.type = AnnotationType.Proposal
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
		this.hideCircles()
		this.group.add(topLeft, topRight, bottomRight, bottomLeft)
	}

	hideCircles() {
		this.circles.forEach(c => c.hide())
		this.group.getLayer() && this.group.getLayer().batchDraw()
	}

	showCircles() {
		this.circles.forEach(c => c.show())
		this.group.getLayer() && this.group.getLayer().batchDraw()
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

	createRectangle() {
		const dimensions = this.annotationData.dimensions
		this.rectangle = new Konva.Rect({
			x: 0,
			y: 0,
			width: dimensions.w,
			height: dimensions.h,
			stroke: this.annotationData.color,
			strokeWidth: this.strokeWidth / this.scale,
			dash: [2 / this.scale, 2 / this.scale]
		})
		this.rectangle.on('mouseover', () => {
			document.body.style.cursor = 'pointer'
			this.rectangle.stroke(ProposalHoverColor)
			this.draw()
		})
		this.rectangle.on('mouseout', () => {
			document.body.style.cursor = 'auto'
			!this.isSelected && this.rectangle.stroke(this.annotationData.color)
			this.draw()
		})
		this.group.on('mouseover', () => {
			this.showCircles()
		})
		this.group.on('mouseout', () => {
			this.hideCircles()
		})
		this.group.add(this.rectangle)
	}

	resizeAnnotationStroke() {
		this.rectangle.strokeWidth(this.strokeWidth/this.scale)
		this.rectangle.dash([3 / this.scale, 3 / this.scale])
		this.circles.forEach(circle => {
			circle.radius(AnnotationCircleRadius / this.scale)
			circle.strokeWidth(AnnotationCircleStrokeWidth / this.scale)
		})
	}

	select() {
		this.group.moveToTop()
		this.rectangle.stroke(ProposalHoverColor)
		this.isSelected = true
	}

	deSelect() {
		this.rectangle.stroke(this.annotationData.color)
		this.isSelected = false
	}

	getArea() {
		return Math.abs(this.rectangle.width() * this.rectangle.height())
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

	getData() {
		const position = this.group.position();
		const topLeft = this.getTopLeftCoordinates();
		const width = Math.abs(this.rectangle.width());
		const height = Math.abs(this.rectangle.height());
		const x1 = position.x + topLeft.x,
			y1 = position.y + topLeft.y,
			x2 = x1 + width,
			y2 = y1 + height
		// return {
		// 	coordinates: [x1, y1, x2, y2],
		// 	label: null,
		// 	id: this.id
		// }
		return [x1, y1, x2, y2]
	}
}
