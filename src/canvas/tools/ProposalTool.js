import {Tool} from "./tool";
import {CustomEventType, ToolType} from "../core/constants";
import * as uuid from "uuid";
import {generateRandomColor} from "../core/utilities";
import {DefaultLabel} from "../../components/ImageAnnotation/label/LabelSelector";
import RectangleAnnotation from "../annotations/RectangleAnnotation";

const ToolMode = {
	Merge: 'Merge',
	AssignLabel: 'AssignLabel'
}

export class ProposalTool extends Tool {
	toolMode

	constructor(canvasManager, proposals, imageLabels) {
		super(canvasManager, proposals, imageLabels);
		this.toolType = ToolType.Proposal
		this.canvasManager.addOrResetProposals(proposals)
	}

	findAndSelectProposal(pointer) {
		const intersectedProposal = this.canvasManager.getIntersectedAnnotation(pointer,
			this.canvasManager.proposalLayer,
			this.canvasManager.proposals
		)
		if (intersectedProposal) {
			if (intersectedProposal.isSelected) {
				intersectedProposal.deSelect()
			} else {
				intersectedProposal.select()
			}
		}
	}

	exitTool() {
		this.canvasManager.hideProposals()
		this.canvasManager.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
	}

	createAnnotation = () => {
		const proposals = this.canvasManager.proposals.filter(p => p.isSelected)
		if (proposals.length > 0) {
			let minX = Infinity
			let minY = Infinity
			let maxX = -Infinity
			let maxY = -Infinity
			proposals.forEach(p => {
				const coordinates = p.getData()
				const x1 = coordinates[0]
				const y1 = coordinates[1]
				const x2 = coordinates[2]
				const y2 = coordinates[3]

				if(x1 < minX) {
					minX = x1
				}

				if(y1 < minY) {
					minY = y1
				}

				if(x2 > maxX) {
					maxX = x2
				}

				if(y2 > maxY) {
					maxY = y2
				}
			})
			const annotationData = {
				dimensions: {
					x: minX,
					y: minY,
					w: maxX - minX,
					h: maxY - minY
				},
				id: uuid.v4(),
				color: generateRandomColor(),
				label: DefaultLabel.label_name
			}
			const rectangle = new RectangleAnnotation(annotationData, this.canvasManager.stage.scaleX(), this.imageLabels)
			this.canvasManager.addAnnotation(rectangle)
			this.toolMode = ToolMode.Merge
			this.showLabelDropDown()
			// this.exitTool()
		} else {

		}
	}

	showLabelDropDown = () => {
		const selectedProposals = this.canvasManager.proposals.filter(p => p.isSelected)
		if (selectedProposals.length > 0) {
			this.canvasManager.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
				position: {
					x: this.canvasManager.stage.width()/2,
					y: this.canvasManager.stage.height()/2
				},
				proposalMode: true
			})
		} else {

		}
	}

	assignLabel = (label) => {
		const proposals = this.canvasManager.proposals.filter(p => p.isSelected)
		if(this.toolMode === ToolMode.Merge) {
			// Note: push to undo stack not required as add annotation is already carrying out the same
			this.canvasManager.setAnnotationLabel(label.value)
		} else {
			proposals.forEach(proposal => {
				const coordinates = proposal.getData()
				const x1 = coordinates[0]
				const y1 = coordinates[1]
				const x2 = coordinates[2]
				const y2 = coordinates[3]
				const annotationData = {
					dimensions: {
						x: x1,
						y: y1,
						w: x2 - x1,
						h: y2 - y1
					},
					id: uuid.v4(),
					color: generateRandomColor(),
					label: label.value
				}
				const rectangle = new RectangleAnnotation(annotationData, this.canvasManager.stage.scaleX(), this.imageLabels)
				rectangle.deSelect()
				this.canvasManager.addAnnotation(rectangle, false)
			})
			// push to undo stack
			this.canvasManager.updateUndoStack()
		}

		this.canvasManager.addOrResetProposals()
		this.canvasManager.updateModelAnnotationLabel(proposals, label.value)
		this.toolMode = null
	}

	resizeCanvasStroke() {
		this.canvasManager.proposals.forEach(p => {
			p.resizeCanvasStroke(this.canvasManager.stage.scaleX())
		})
		this.canvasManager.proposalLayer.batchDraw()
	}

	eventListeners = [
		{
			event: 'click',
			func: this.findAndSelectProposal.bind(this),
		}
	]
}
