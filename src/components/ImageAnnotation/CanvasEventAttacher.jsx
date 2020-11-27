import  React from 'react';
import {appId} from "./AnnotationTool";


const addEventListenersToApp = (listeners, containerId) => {
	const element = document.getElementById(containerId)
	listeners.forEach((listener) => {
		element.addEventListener(listener.event.toString(), listener.func)
	});
};

const addKeyboardEventListenersToApp = (listeners) => {
	listeners.forEach((listener) => {
		window.addEventListener(listener.event, listener.func)
	});
};

export class CanvasEventAttacher extends React.Component {
	containerId = appId;

	constructor(props) {
		super(props);
	}

	// Variable will be overriden by child classes
	eventListeners = [];

	// Variable will be overriden by child classes
	keyboardEventListeners = [];

	bindEventListeners() {
		const eventListeners = this.eventListeners;
		addEventListenersToApp(eventListeners, this.containerId);
		this.bindKeyboardEventListeners();
	}

	bindKeyboardEventListeners() {
		addKeyboardEventListenersToApp(this.keyboardEventListeners);
	}

	unbindDocumentEventListeners() {
		// Remove event Listeners
		const eventListeners = this.eventListeners;
		const element = document.getElementById(this.containerId);
		eventListeners.forEach((listener) => {
			element.removeEventListener(listener.event, listener.func);
		});
	}

	unbindKeyboardEventListeners() {
		// Remove Keyboard event listeners
		this.keyboardEventListeners.forEach((listener) => {
			window.removeEventListener(listener.event, listener.func);
		});
	}

	removeEventListeners = () => {
		this.unbindDocumentEventListeners();
		this.unbindKeyboardEventListeners();
	};

	unbindEventListeners() {
		this.removeEventListeners();
	}

	// Method will be overriden by child classes
	renderComponent() {}

	render() {
		return <>{this.renderComponent()}</>;
	}
}
