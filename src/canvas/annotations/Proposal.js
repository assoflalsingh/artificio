import Konva from "konva";
import Annotation from "./Annotation";
import {AnnotationType} from "../core/constants";
const ProposalHoverColor = 'red'

export default class Proposal extends Annotation {
	rectangle
	strokeWidth = 2
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
		this.group.add(this.rectangle)
	}

	resizeAnnotationStroke() {
		this.rectangle.strokeWidth(this.strokeWidth/this.scale)
		this.rectangle.dash([3 / this.scale, 3 / this.scale])
	}

	select() {
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

	getData() {
		const position = this.group.position();
		const width = Math.abs(this.rectangle.width());
		const height = Math.abs(this.rectangle.height());
		const x1 = position.x,
			y1 = position.y,
			x2 = x1 + width,
			y2 = y1 + height
		return [x1, y1, x2, y2]
	}
}
