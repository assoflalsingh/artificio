import * as uuid from 'uuid'
import {CanvasScene} from "./CanvasScene";
import {CustomEventType, ToolTypeClassNameMap} from "./core/constants";
import {generateRandomColor, getScaledCoordinates, getUnScaledCoordinates} from "./core/utilities";
import Proposal from "./annotations/Proposal";
import {AnnotationProposalColor, AnnotationProposalLowConfidenceScoreColor} from "./annotations/Annotation";
import {UndoRedoStack} from "./core/UndoRedoStack";
import RectangleAnnotation from "./annotations/RectangleAnnotation";
import {DefaultLabel} from "../components/ImageAnnotation/LabelSelector";

export class CanvasManager extends CanvasScene {
	activeTool
	annotations = []
	proposals = []
	selectedAnnotation
	undoRedoStack = new UndoRedoStack()
	eventListeners = [
		{
			event: 'click',
			func: this.findAndSelectAnnotation.bind(this)
		}
	]

	// ApplicationConfig is of type {appId: string}
	constructor(appConfig) {
		super(appConfig.appId);
		this.addEventListeners(this.eventListeners)
		window.canvas = this
	}

	// Show is of type boolean
	setLoader(show) {
		this.dispatch(CustomEventType.SHOW_LOADER, { loading: show })
	}

	// Return type RectangleAnnotation
	getAnnotationById(id) {
		return this.annotations.find((ann) => ann.id === id)
	}

	getIntersectedAnnotation(pointer, layer, annotations) {
		let minArea = Infinity
		let finalAnnotation
		const intersections = layer.getAllIntersections(getUnScaledCoordinates(pointer, this.stage))
		intersections.forEach(intersection => {
			const annotation = annotations.find(ann => {
				return Boolean(intersection.findAncestor('#' + ann.getShape().id()))
			})
			if (annotation) {
				const area = annotation.getArea() || 0
				if (area < minArea) {
					minArea = area
					finalAnnotation = annotation
				}
			}
		})
		return finalAnnotation
	}

	findAndSelectAnnotation(pointer) {
		if (this.annotationLayer.visible()) {
			const intersectedAnnotation = this.getIntersectedAnnotation(pointer, this.annotationLayer, this.annotations)
			intersectedAnnotation && this.selectAnnotation(intersectedAnnotation)
		}
	}

	selectAnnotation(annotation) {
		if(this.selectedAnnotation) {
			this.deSelectActiveAnnotation()
		}
		this.annotations.forEach(ann => ann.deSelect())
		this.selectedAnnotation = annotation
		annotation.select()
		this.addSelectedAnnotationEventListeners()
		this.annotationLayerDraw()
		this.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
			position: this.getLabelSelectorPosition()
		})
	}

	getSelectedAnnotation = () => {
		return this.selectedAnnotation
	}

	addSelectedAnnotationEventListeners() {
		this.selectedAnnotation.getShape().on('dragstart.select', () => {
			// Hide label selector dropdown
			this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
		})
		this.selectedAnnotation.getShape().on('dragend.select', () => {
			// Show label selector dropdown
		  this.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
				position: this.getLabelSelectorPosition()
			})
			this.updateUndoStack()
		})
	}

	removeAnnotationEventListeners() {
		this.selectedAnnotation.getShape().off('dragstart.select')
		this.selectedAnnotation.getShape().off('dragend.select')
	}

	deSelectActiveAnnotation = () => {
		if(this.selectedAnnotation) {
			this.selectedAnnotation.deSelect()
			this.removeAnnotationEventListeners()
			this.selectedAnnotation = undefined
			this.annotationLayerDraw()
			this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
		}
	}

	/**
	 * {
			points: number[];
			id: string;
			color: string;
			label: string;
		}
	 * @param annotation
	 */
	addAnnotation = (annotation, select = true) => {
		this.annotationLayer.add(annotation.getShape())
		this.annotationLayerDraw()
		this.annotations.push(annotation)
		select && this.selectAnnotation(annotation)
		this.updateUndoStack()
	}

	deleteAnnotation(id) {
		const index = this.annotations.findIndex((ann) => ann.id === id);
		const annotation = this.annotations[index];
		this.selectedAnnotation && this.deSelectActiveAnnotation()
		annotation.getShape().destroy()
		this.annotationLayer.batchDraw()
		this.annotations.splice(index, 1);
		this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
		this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
		this.updateUndoStack()
	}

	/**
	 * {
			points: number[];
			id: string;
			color: string;
			label: string;
		}
	 * @param id -> string
	 */

	focusAnnotation(id) {
		this.blurAllAnnotations();
		const annotation = this.getAnnotationById(id);
		annotation && annotation.focus();
		this.annotationLayer.batchDraw();
	}

	blurAnnotation(id) {
		const annotation = this.getAnnotationById(id);
		annotation && annotation.blur();
		this.annotationLayer.batchDraw();
	}

	focusAllAnnotations() {
		this.annotations.forEach((ann) => ann.focus());
		this.annotationLayer.batchDraw();
	}

	blurAllAnnotations() {
		this.annotations.forEach((ann) => ann.blur());
		this.annotationLayer.batchDraw();
	}

	clearAnnotations() {
		this.deSelectActiveAnnotation()
		this.annotationLayer.destroyChildren();
		this.annotations = [];
		this.annotationLayer.batchDraw();
		this.proposalLayer.destroyChildren();
		this.proposals = [];
		this.proposalLayer.batchDraw();
		this.toolLayer.destroyChildren();
		this.toolLayerDraw()
	}

	transformEventDataForTool = (event, eventData) => {
		switch (event) {
			case 'click':
			case 'mousemove':
			case 'mousedown':
			case 'mouseup':
				let cord = this.stage.getPointerPosition()
				cord = getScaledCoordinates(cord, this.stage)
				return cord
			default:
				return eventData
		}
	}

	on = (eventType, callback) => {
		if (this.activeTool) {
			eventType += '.' + this.activeTool.toolType || 'default'
		}
		this.stage.on(eventType, callback)
	}

	addEventListeners(eventListenerObjects) {
		eventListenerObjects.forEach(el => {
			if (el.element) {
				el.element.addEventListener(el.event, el.func)
			} else {
				this.on(el.event, (evt) => {
					el.func(this.transformEventDataForTool(el.event, evt))
				})
			}
		})
	}

	removeEventListeners(eventListenerObjects) {
		eventListenerObjects.forEach(el => {
			if (el.element) {
				el.element.removeEventListener(el.event, el.func)
			} else {
				let eventType = el.event
				if (this.activeTool) {
					eventType += '.' + this.activeTool.toolType
				}
				this.stage && this.stage.off(eventType)
			}
		})
	}

	addToolShape = figure => {
		this.toolLayer.add(figure)
		figure.draw()
	}

	removeToolShape = (figure) => {
		if (figure) {
			figure.destroy()
			this.toolLayer.batchDraw()
		}
	}

	getActiveTool = () => {
		return this.activeTool
	}

	setActiveTool = (toolType, data, imageLabels) => {
		const tool = ToolTypeClassNameMap[toolType]
		this.activeTool = new tool(this, data, imageLabels)
		this.addEventListeners(this.activeTool.eventListeners)
		this.deSelectActiveAnnotation()
	}

	unsetActiveTool = () => {
		if (this.activeTool) {
			this.removeEventListeners(this.activeTool.eventListeners)
			this.activeTool.exitTool()
			this.activeTool = null
		}
	}

	toolLayerDraw() {
		this.toolLayer.batchDraw()
	}

	annotationLayerDraw() {
		this.annotationLayer.batchDraw()
	}

	resizeCanvasStroke(scale) {
		if(this.activeTool) {
			this.activeTool.resizeCanvasStroke(scale)
			this.toolLayerDraw()
		}
		this.annotations.forEach(ann => {
			ann.resizeCanvasStroke(this.stage.scaleX())
		})
		this.annotationLayerDraw()
	}

	getLabelSelectorPosition = () => {
		const annotation = this.selectedAnnotation
		if(annotation) {
			const canvas = document.getElementById(this.appId)
			const canvasBoundingRect = canvas.getBoundingClientRect()
			const args = annotation.getLabelSelectorPosition()
			args.x *= this.stage.scale().x
			args.y *= this.stage.scale().y
			const stage = {
				x: this.annotationLayer.x() * this.stage.scale().x + this.stage.x(),
				y: this.annotationLayer.y() * this.stage.scale().y + this.stage.y()
			}
			const position = {
				x: args.x + stage.x,
				y: args.y + stage.y
			}
			const padding = 20
			return {
				x: canvasBoundingRect.x + position.x,
				y: canvasBoundingRect.y + position.y + padding
			}
		}
	}

	getSelectedAnnotation = () => {
		return this.selectedAnnotation
	}

	setAnnotationLabel = (label) => {
		this.selectedAnnotation.setLabel(label)
		this.selectedAnnotation.draw()
		this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
		this.updateUndoStack()
	}

	getAnnotations = () => {
		return this.annotations
	}

	/**
	 * @param proposals
		 {
		 		block_details: {},
				word_details: {
					word_description: string;
					entity_label: string;
					bounding_box: {
						vertices: {
							x: number;
							y: number
						}[]
					}
				}
			}
	 */
	addOrResetProposals(proposals) {
		// const annotationData = {
		// 	"dimensions": {
		// 		"x": 329,
		// 		"y": 103,
		// 		"w": 146,
		// 		"h": 109
		// 	},
		// 	"id": "ad3be96e-690e-4f7a-baeb-4bc8498468b5",
		// 	"color": "rgb(198,24,138)",
		// 	"label": "arto_others"
		// }
		// const proposal = new Proposal(annotationData, this.stage.scaleX())
		// this.proposalLayer.add(proposal.getShape())
		// this.proposalLayer.batchDraw()

		if (this.proposals.length === 0) {
			const imagePosition = this.konvaImage.position()
			proposals.forEach(proposal => {
				proposal.word_details.forEach(word => {
					const coordinates = word.bounding_box.vertices
					const topLeft = coordinates[0]
					const bottomRight = coordinates[2]
					const width = (bottomRight.x - topLeft.x)/this.imageDimensions.width * this.konvaImage.width()
					const height = (bottomRight.y - topLeft.y)/this.imageDimensions.height * this.konvaImage.height()
					const annotationData = {
						dimensions: {
							x: (topLeft.x / this.imageDimensions.width * this.konvaImage.width()) + imagePosition.x,
							y: (topLeft.y / this.imageDimensions.height * this.konvaImage.height()) + imagePosition.y,
							w: width,
							h: height
						},
						id: uuid.v4(),
						label: word.bounding_box.entity_label,
						color: word.confidence_score > 0.5 ? AnnotationProposalColor : AnnotationProposalLowConfidenceScoreColor
					}
					const proposal = new Proposal(annotationData, this.stage.scaleX())
					this.proposals.push(proposal)
					this.proposalLayer.add(proposal.getShape())
				})
			})
		} else {
			this.proposals.forEach(p => p.deSelect())
		}
		this.proposalLayer.show()
		this.proposalLayer.batchDraw()
	}

	hideProposals() {
		this.proposalLayer.hide()
		this.proposalLayer.batchDraw()
	}

	getAnnotationData = (annotation, scaled) => {
		const imagePosition = this.konvaImage.position()
		const annotationData = annotation.getData()
		const coordinates =  Object.assign([], annotationData.coordinates)

		// x1
		coordinates[0] = coordinates[0] - imagePosition.x
		// y1
		coordinates[1] = coordinates[1] - imagePosition.y
		// x2
		coordinates[2] = coordinates[2] - imagePosition.x
		// y2
		coordinates[3] = coordinates[3] - imagePosition.y

		if (scaled) {
			// x1
			coordinates[0] = coordinates[0] / this.konvaImage.width()
			// y1
			coordinates[1] = coordinates[1] / this.konvaImage.height()
			// x2
			coordinates[2] = coordinates[2] / this.konvaImage.width()
			// y2
			coordinates[3] = coordinates[3] / this.konvaImage.height()
		} else {
			// x1
			coordinates[0] = coordinates[0] / this.konvaImage.width() * this.imageDimensions.width
			// y1
			coordinates[1] = coordinates[1] / this.konvaImage.height() * this.imageDimensions.height
			// x2
			coordinates[2] = coordinates[2] / this.konvaImage.width() * this.imageDimensions.width
			// y2
			coordinates[3] = coordinates[3] / this.konvaImage.height() * this.imageDimensions.height
		}
		const width = coordinates[2] - coordinates[0]
		const height = coordinates[3] - coordinates[1]
		return {
			label_name: annotationData.label,
			label_value: annotationData.label,
			label_shape: annotation.type.toLowerCase(),
			label_points: [
				[Math.round(coordinates[0]), Math.round(coordinates[1])],
				[Math.round(coordinates[0] + width), Math.round(coordinates[1])],
				[Math.round(coordinates[2]), Math.round(coordinates[3])],
				[Math.round(coordinates[0]), Math.round(coordinates[1] + height)]
			]
		}
	}

	/**
	 *
	 * @param scaled
	 * @returns
	 * {
	 *   "image": {
					"w": number,
					"h": number
				},
				labels: {
					"label_name": number,
					"label_value": number,
					"label_shape": number,
					"label_points": number[][]
				}[]
	 * }
	 */
	getData = (scaled = false) => {
		const labels = []
		this.annotations.forEach(ann => {
			labels.push(this.getAnnotationData(ann, scaled))
		})
		return {
			image: {
				w: this.imageDimensions.width,
				h: this.imageDimensions.height
			},
			labels
		}
	}

	updateUndoStack() {
		this.undoRedoStack.push(this.annotations.map(annotation => {
			const data = annotation.getData()
			return {...data, imageLabels: annotation.imageLabels, color: annotation.annotationData.color}
		}))
	}

	addAnnotationsFromData(annotations) {
		annotations.forEach(annotation => {
			const x1 = annotation.coordinates[0]
			const y1 = annotation.coordinates[1]
			const x2 = annotation.coordinates[2]
			const y2 = annotation.coordinates[3]
			const width = x2 - x1
			const height = y2 - y1
			const annotationData = {
				dimensions: {x: x1, y: y1, w: width, h: height},
				id: annotation.id,
				color: annotation.color,
				label: annotation.label
			}
			const ann = new RectangleAnnotation(annotationData, this.stage.scaleX(), annotation.imageLabels)
			ann.deSelect()
			this.annotationLayer.add(ann.getShape())
			this.annotations.push(ann)
		})
		this.annotationLayerDraw()
	}

	undo = () => {
		this.clearAnnotations()
		const annotations = this.undoRedoStack.undo()
		if (annotations && annotations.length > 0) {
			this.addAnnotationsFromData(annotations)
			this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
		}
	}

	redo = () => {
		const annotations = this.undoRedoStack.redo()
		if (annotations && annotations.length > 0) {
			this.clearAnnotations()
			this.addAnnotationsFromData(annotations)
			this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
		}
	}

	resetUndoRedoStack = () => {
		this.undoRedoStack.reset()
	}

	/**
	 * @param eventType -> type string
	 * @param payload -> type any
	 */
	dispatch = (eventType, payload) => {
		const data = { detail: payload },
			event = new CustomEvent(eventType, data),
			element = document.getElementById(this.appId);
		element.dispatchEvent(event);
	};

	destroy() {
		this.removeEventListeners(this.eventListeners)
		this.stage.destroyChildren()
		this.stage.destroy()
	}
}
