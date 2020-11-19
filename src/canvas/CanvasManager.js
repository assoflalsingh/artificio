import {CanvasScene} from "./CanvasScene";
import {CustomEventType} from "./core/constants";
import {RectangleAnnotation} from "./annotations/RectangleAnnotation";

export class CanvasManager extends CanvasScene {
	annotations = [];

	// ApplicationConfig is of type {appId: string;}
	constructor(appConfig) {
		super(appConfig.appId);
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

	// Show is of type boolean
	setLoader(show) {
		this.dispatch(CustomEventType.SHOW_LOADER, { loading: show });
	}

	// Return type RectangleAnnotation
	getAnnotationById(id) {
		return this.annotations.find((ann) => ann.getId() === id);
	}

	/**
	 * @param annotationData
	 * {
			points: number[];
			id: string;
			color: string;
			label: string;
		}
	 */
	addAnnotation(annotationData) {
		const annotation = new RectangleAnnotation(annotationData);
		this.annotationLayer.add(annotation.getShape());
		this.annotations.push(annotation);
		this.focusAnnotation(annotationData.id);
	}

	deleteAnnotation(id) {
		const index = this.annotations.findIndex((ann) => ann.getId() === id);
		const annotation = this.annotations[index];
		annotation.getShape().destroy();
		this.annotationLayer.batchDraw();
		this.annotations.splice(index, 1);
		this.focusAllAnnotations();
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
		annotation?.focus();
		this.annotationLayer.batchDraw();
	}

	blurAnnotation(id) {
		const annotation = this.getAnnotationById(id);
		annotation?.blur();
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
}
