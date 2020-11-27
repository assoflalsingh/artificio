import Konva from "konva";

export const AnnotationStrokeWidth = 2
export const AnnotationCircleRadius = 4
export const AnnotationCircleStrokeWidth = 1
const TextPadding = 8

export default class Annotation {
	annotationData
	scale
	group = new Konva.Group({
		draggable: true
	})

	constructor(data, scale) {
		this.annotationData = data
		this.scale = scale
	}

	// Method will be overriden by child class
	resizeAnnotationStroke() {

	}

	resizeCanvasStroke(scale) {
		this.scale = scale
		this.resizeAnnotationStroke()
	}

	// Method will be overriden by child class
	getLabelPosition() {

	}

	addLabel() {
		const labelPosition = this.getLabelPosition();
		this.label = new Konva.Label({
			x: labelPosition.x,
			y: labelPosition.y,
		});
		const tag = new Konva.Tag({
			fill: this.annotationData.color,
			cornerRadius: 4 / this.scale
		})
		this.label.add(tag);
		const text = new Konva.Text({
			text: this.annotationData.label || 'annotation',
			fontSize: 12 / this.scale,
			fontStyle: 'bold',
			padding: 5 / this.scale,
			fill: 'white'
		})
		text.width(text.width() + TextPadding/this.scale)
		this.label.add(text);
		this.label.x(this.label.x() - this.label.width())
		this.group.add(this.label);
	}

	draw() {
		this.group.draw()
	}
}
