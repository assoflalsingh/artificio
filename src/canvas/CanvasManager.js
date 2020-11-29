import {CanvasScene} from "./CanvasScene";
import {CustomEventType, ToolTypeClassNameMap} from "./core/constants";
import {getScaledCoordinates} from "./core/utilities";

export class CanvasManager extends CanvasScene {
	activeTool
	annotations = []
	selectedAnnotation

	// ApplicationConfig is of type {appId: string}
	constructor(appConfig) {
		super(appConfig.appId);
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

	selectAnnotation(annotation) {
		if(this.selectedAnnotation) {
			this.deSelectActiveAnnotation()
		}
		this.annotations.forEach(ann => ann.deSelect())
		this.selectedAnnotation = annotation
		annotation.select()
		this.addSelectedAnnotationEventListeners()
		this.annotationLayerDraw()
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
		})
	}

	removeAnnotationEventListeners() {
		this.selectedAnnotation.getShape().off('dragstart.select')
		this.selectedAnnotation.getShape().off('dragend.select')
	}

	addAnnotationEventListeners(annotation) {
		annotation.getShape().on('click', () => {
			this.selectAnnotation(annotation)
			this.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
				position: this.getLabelSelectorPosition()
			})
		})
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
	addAnnotation = (annotation) => {
		this.annotationLayer.add(annotation.getShape())
		this.annotationLayerDraw()
		this.annotations.push(annotation)
		this.selectAnnotation(annotation)
		this.addAnnotationEventListeners(annotation)
	}

	deleteAnnotation(id) {
		const index = this.annotations.findIndex((ann) => ann.id === id);
		const annotation = this.annotations[index];
		this.selectedAnnotation && this.deSelectActiveAnnotation()
		annotation.getShape().destroy()
		this.annotationLayer.batchDraw()
		this.annotations.splice(index, 1);
		this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
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
		this.annotationLayer.destroyChildren();
		this.annotations = [];
		this.annotationLayer.batchDraw();
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
		figure.destroy()
		this.toolLayer.batchDraw()
	}

	getActiveTool() {
		return this.activeTool
	}

	setActiveTool = (toolType) => {
		const tool = ToolTypeClassNameMap[toolType]
		this.activeTool = new tool(this)
		this.addEventListeners(this.activeTool.eventListeners)
		this.deSelectActiveAnnotation()
	}

	unsetActiveTool() {
		this.removeEventListeners(this.activeTool.eventListeners)
		this.activeTool = null
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
	}

	getAnnotations = () => {
		return this.annotations
	}

	getData() {
		const imagePosition = this.konvaImage.position()
		return this.annotations.map(ann => {
			let data = ann.getData()
			const coordinates =  Object.assign([], ann.getData().coordinates)
			// x1
			coordinates[0] = (coordinates[0] - imagePosition.x) / this.konvaImage.width()
			// y1
			coordinates[1] = (coordinates[1] - imagePosition.y) / this.konvaImage.height()
			// x2
			coordinates[2] = (coordinates[2] - imagePosition.x) / this.konvaImage.width()
			// y2
			coordinates[3] = (coordinates[3] - imagePosition.y) / this.konvaImage.height()
			data = {...data, coordinates}
			return data
		})
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
}
