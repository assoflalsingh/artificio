import Konva from "konva";
import * as uuid from 'uuid'
export const AnnotationStrokeWidth = 2
export const AnnotationCircleRadius = 4
export const AnnotationCircleStrokeWidth = 1
export const AnnotationProposalColor = 'blue'
export const AnnotationProposalLowConfidenceScoreColor = 'red'
const TextPadding = 8

export default class Annotation {
	annotationData
	scale
	id
	label
	color
	group = new Konva.Group({
		draggable: true,
		id: uuid.v4()
	})
	type
	labelValue
	imageLabels = []

	/**
	 * @param data
	 * {
			dimensions: {x: number, y: number, w: number, h: number};
			id: string;
			color: string;
			label: string;
		}
	 * @param scale
	 * @param imageLabels
	 * {
			"label_name": string,
			"label_shape": string",
			"label_datatype": string",
			"label_color": string
			}
	 */
	constructor(data, scale, imageLabels) {
		this.annotationData = data
		this.id = data.id
		this.scale = scale
		this.color = data.color
		this.labelValue = data.labelValue
		this.imageLabels = imageLabels || []
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

	shouldLabelBeAdded() {
		return !!this.imageLabels.find(label => label.label_name === this.annotationData.label)
	}

	addLabel() {
		if (this.shouldLabelBeAdded()) {
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
	}

	reCreateLabel() {
		// Recreate Label
		if (this.label) {
			this.label.destroy()
			this.label.destroyChildren()
			this.group.getLayer() && this.group.getLayer().draw()
		}
		this.addLabel()
	}

	getLabel() {
		return this.annotationData.label
	}

	// Return type of Konva.Group
	getShape() {
		return this.group
	}

	setLabel(label) {
		this.annotationData.label = label
		this.reCreateLabel()
	}

	setLabelValue = (labelValue) => {
		this.labelValue = labelValue
	}

	getLabelValue = () => {
		return  this.labelValue
	}

	draw() {
		this.group.draw()
	}
}
