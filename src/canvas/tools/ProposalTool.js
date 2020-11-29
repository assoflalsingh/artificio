import {Tool} from "./tool";
import {CustomEventType, ToolType} from "../core/constants";
import * as uuid from "uuid";
import {generateRandomColor} from "../core/utilities";
import {DefaultLabel} from "../../components/ImageAnnotation/LabelSelector";
import RectangleAnnotation from "../annotations/RectangleAnnotation";

export class ProposalTool extends Tool {
	constructor(canvasManager, proposals) {
		super(canvasManager);
		this.toolType = ToolType.Proposal
		this.canvasManager.addProposals(proposals)
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
		const rectangle = new RectangleAnnotation(annotationData, this.canvasManager.stage.scaleX())
		this.canvasManager.addAnnotation(rectangle)
		this.exitTool()
	}

	showLabelDropDown = () => {
		this.canvasManager.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
			position: {
				x: this.canvasManager.stage.width()/2,
				y: this.canvasManager.stage.height()/2
			},
			proposalMode: true
		})
	}

	assignLabel = (label) => {
		const proposals = this.canvasManager.proposals.filter(p => p.isSelected)
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
			const rectangle = new RectangleAnnotation(annotationData, this.canvasManager.stage.scaleX())
			rectangle.deSelect()
			this.canvasManager.addAnnotation(rectangle, false)
		})
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
