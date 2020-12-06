import * as React from "react";
import {RegionLeftToolBar} from "../../annotator/defaults";
import {Box, Snackbar, Typography} from "@material-ui/core";
import CanvasWrapper from "./CanvasWrapper";
import {CanvasManager} from "../../canvas/CanvasManager";
import Thumbnails from "./Thumbnails";
import Loader from "./Loader";
import {ToolBar} from "./ToolBar";
import {LabelSelector} from "./LabelSelector";
import {LabelsContainer} from "./LabelsContainer";
import {CustomEventType, ToolType} from "../../canvas/core/constants";
import {getImageData, saveAnnotationData} from "./apiMethods";
import Alert from "@material-ui/lab/Alert";
import {generateAnnotationsFromData} from "./utilities";

export const appId = 'canvas-annotation-tool'

export default class AnnotationTool extends React.Component {
	canvasManager
	textAnnotations
	state = {
		activeImageIndex: 0,
		loading: false,
		imageLabels: [],
		/**
		 * @param textAnnotations
		 {
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
		textAnnotations: [],
		imageMetadata: null,
		ajaxMessage: null
	}

	updateModelAnnotationLabel = (proposals, labelName) => {
		if (proposals && proposals.length > 0) {
			proposals.forEach(proposal => {
				const ids = proposal.id.split('-')
				const proposalIndex = parseInt(ids[0])
				const wordIndex = parseInt(ids[1])
				const word = this.textAnnotations[proposalIndex].word_details[wordIndex]
				word.entity_label = labelName
			})
		}
	}

	updateModelAnnotationData = (proposal) => {
		if (proposal) {
			const ids = proposal.id.split('-')
			const proposalIndex = parseInt(ids[0])
			const wordIndex = parseInt(ids[1])
			const data = this.canvasManager.getAnnotationData(proposal)
			const word = this.textAnnotations[proposalIndex].word_details[wordIndex]
			if(word && word.bounding_box && word.bounding_box.vertices) {
				word.bounding_box.vertices = data.label_points.map(point => {
					return {x: point[0], y: point[1]}
				})
			}
		}
	}

	addAnnotations(userAnnotatedData) {
		if (userAnnotatedData && userAnnotatedData.labels && userAnnotatedData.labels.length > 0) {
			const annotations = generateAnnotationsFromData(
				userAnnotatedData,
				this.canvasManager.stage,
				this.state.imageLabels,
				this.canvasManager.imageDimensions,
				this.canvasManager.konvaImage.position(),
				{
					width: this.canvasManager.konvaImage.width(),
					height: this.canvasManager.konvaImage.height()
				},
			)
			this.canvasManager.addAnnotationsFromData(annotations)
		}
	}

	async fetchImageData(index) {
		this.setLoader(true);
		this.setState({activeImageIndex: index})
		const selectedImage = this.props.images[index]
		if(selectedImage) {
			const imageData = await getImageData(this.props.api, selectedImage._id, selectedImage.page_no);
			this.textAnnotations = imageData.image_json ? imageData.image_json.text_annotations : []

			this.setState({
				imageLabels: imageData.image_labels,
				imageMetadata: imageData.image_json.metadata
			})

			// Clear canvas
			this.canvasManager.clearAnnotations()

			// Reset undo redo stack
			this.canvasManager.resetUndoRedoStack()

			// set text annotations in canvas manager
			this.canvasManager.setTextAnnotations(this.textAnnotations)

			// Set canvas image
			this.canvasManager.setImage(imageData.image_url, () => {
				this.addAnnotations(imageData.image_json ? imageData.image_json.user_annotate_data : {})
				this.setLoader(false)
			})
			this.canvasManager.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
			this.canvasManager.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
		} else {
			this.setLoader(false)
		}
	}

	saveImageData = () =>  {
		const selectedImage = this.props.images[this.state.activeImageIndex]
		const annotatedData = this.canvasManager.getData()
		saveAnnotationData(
			this.props.api,
			selectedImage._id,
			selectedImage.page_no,
			this.state.imageMetadata,
			this.textAnnotations,
			annotatedData
		).then(()=>{
			this.setState({ajaxMessage: {
				error: false, text: 'Annotation details saved successfully !!',
			}});
		}).catch((error) => {
			if(error.response) {
				this.setState({ajaxMessage: {
					error: true, text: error.response.data.message,
				}});
			} else {
				console.error(error);
			}
		})
	}

	showProposals = (show) => {
		if(show) {
			this.canvasManager.setProposalTool(ToolType.Proposal, this.textAnnotations, this.state.imageLabels)
		} else {
			this.canvasManager.unsetProposalTool()
		}
	}

	setLoader(value) {
		this.setState({loading: value})
	}

	fetchNextImage = () => {
		const nextIndex = this.state.activeImageIndex + 1
		if(nextIndex < this.props.images.length) {
			this.fetchImageData(nextIndex)
		}
	}

	fetchPreviousImage = () => {
		const prevIndex = this.state.activeImageIndex - 1
		if(prevIndex >= 0) {
			this.fetchImageData(prevIndex)
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		// Todo simplify logic
		// select first image
		if (nextProps	&& nextProps.images[this.state.activeImageIndex]) {
			const imageData = nextProps.images[this.state.activeImageIndex]
			const image = new Image()
			image.src = imageData.img_thumb_src
			image.onload = () => {
				this.fetchImageData(0)
			}
			image.onerror = () => {
				this.setLoader(false)
			}
		} else {
			this.setLoader(false)
		}
	}

	componentDidMount() {
		this.setLoader(true);
		this.canvasManager = new CanvasManager({appId}, this.updateModelAnnotationData, this.updateModelAnnotationLabel)
	}

	render() {
		const {images, onAnnotationToolClose} = this.props
		const activeImage = images && images[this.state.activeImageIndex]
		return (
				<Box display="flex" style={{height: '100%'}}>
					<RegionLeftToolBar
						dispatch={undefined}
						regions={activeImage ? activeImage.regions : []}
						undo={this.canvasManager && this.canvasManager.undo}
						redo={this.canvasManager && this.canvasManager.redo}
						fetchNextImage={this.fetchNextImage}
						fetchPreviousImage={this.fetchPreviousImage}
						save={this.saveImageData}
					/>
					<Box style={{flexGrow: 1, overflow: 'hidden', width: '75%'}}>
						<ToolBar
							setActiveTool={this.canvasManager
								&& this.canvasManager.setActiveTool.bind(this, ToolType.Rectangle, null, this.state.imageLabels)
							}
							onAnnotationToolClose={onAnnotationToolClose}
							showProposals={this.showProposals}
						/>
						<Box style={{backgroundColor: '#383838', height: '78%'}}>
							{this.state.loading && <Loader/>}
							<CanvasWrapper id={appId}/>
						</Box>
						<Box display="flex">
							{/*{this.state.selectedImage &&*/}
							{/*	<Typography style={{margin: 'auto'}}>*/}
							{/*		{images[this.state.selectedImage].document_file_name} {images[this.state.selectedImage].page_no})*/}
							{/*	</Typography>*/}
							{/*}*/}
							{activeImage && <Typography style={{margin: 'auto'}}>Select an image....</Typography>}
						</Box>
						<Thumbnails
							images={images}
							activeImageIndex={this.state.activeImageIndex}
							fetchImageData={this.fetchImageData.bind(this)}
						/>
					</Box>
					<Box style={{width: '25%', display: 'flex', flexDirection: 'column'}}>
						{
							this.canvasManager &&
								<LabelsContainer
									getAnnotations={this.canvasManager.getAnnotations}
									getAnnotationData={this.canvasManager.getAnnotationData}
									imageLabels={this.state.imageLabels}
									textAnnotations={this.textAnnotations}
								/>
						}
						{/*<Box style={{overflow: 'auto', flexGrow: 1}}>*/}
						{/*	{activeImage && */}
						{/*		<LabelValues */}
						{/*			activeImage={activeImage} */}
						{/*			labelsData={images[this.state.selectedImage].labels_data} */}
						{/*			setLabelsData={setLabelsData} */}
						{/*		/>}*/}
						{/*</Box>*/}
					</Box>
					{
						this.canvasManager &&
							<LabelSelector
								imageLabels={this.state.imageLabels}
								deSelectActiveAnnotation={this.canvasManager.deSelectActiveAnnotation}
								deleteAnnotation={() =>
									this.canvasManager.deleteAnnotation(this.canvasManager.getSelectedAnnotation().id)
								}
								getSelectedAnnotation={this.canvasManager.getSelectedAnnotation}
								setAnnotationLabel={this.canvasManager.setAnnotationLabel}
								// getActiveTool={this.canvasManager.getActiveTool}
								// unsetActiveTool={this.canvasManager.unsetActiveTool}
								getProposalTool={this.canvasManager.getProposalTool}
							/>
					}
					<Snackbar open={Boolean(this.state.ajaxMessage)} autoHideDuration={6000} >
						{this.state.ajaxMessage &&
							<Alert
								onClose={() => this.setState({ajaxMessage: null})}
								severity={this.state.ajaxMessage.error ? "error" : "success"}
							>
							{this.state.ajaxMessage.error ? "Error occurred: " : ""}{this.state.ajaxMessage.text}
						</Alert>}
					</Snackbar>
				</Box>
		)
	}
}

const styles = {
	labelsHeader: {
		color: 'green'
	}
}
