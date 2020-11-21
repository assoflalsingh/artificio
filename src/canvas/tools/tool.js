import {KeyMappings} from "../core/constants";

export class Tool {
	toolType
	canvasManager

	constructor(canvasManager) {
		this.canvasManager = canvasManager
		this.addEventListeners()
	}

	onKeyDown = (event) => {
		switch (event.keyCode) {
			case KeyMappings.Escape:
				this.exit()
				break
		}
	}

	addEventListeners() {
		window.addEventListener('keydown', this.onKeyDown)
	}

	// will be overriden by child class
	exitTool() {

	}

	exit() {
		this.exitTool()
		window.removeEventListener('keydown', this.onKeyDown)
		this.canvasManager.unsetActiveTool()
	}
}
