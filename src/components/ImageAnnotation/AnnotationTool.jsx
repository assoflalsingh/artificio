import * as React from "react";
import {RegionLeftToolBar} from "../../annotator/defaults";
import {Box, Typography} from "@material-ui/core";
import CanvasWrapper from "./CanvasWrapper";
import {CanvasManager} from "../../canvas/CanvasManager";
import {URL_MAP} from "../../others/artificio_api.instance";
import Thumbnails from "./Thumbnails";
import Loader from "./Loader";
import {ToolBar} from "./ToolBar";
import {LabelSelector} from "./LabelSelector";
import {LabelsContainer} from "./LabelsContainer";
import {CustomEventType, ToolType} from "../../canvas/core/constants";

export const appId = 'canvas-annotation-tool'

async function getImageData(api, imageId, pageNo) {
	// setProcessMsg('Fetching image file information...');
	try {
		const response = await api.post(URL_MAP.GET_ANNOTATION_DETAILS, {
			document_id: imageId,
			page_no: pageNo,
		})
		const data = response.data.data;
		// setProcessMsg(null);
		return data
	} catch (error) {
		if(error.response) {
			// setAjaxMessage({
			// 	error: true, text: error.response.data.message,
			// });
		} else {
			console.error(error);
		}
	}
}

export default class AnnotationTool extends React.Component {
	canvasManager
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
		textAnnotations: []
	}

	async fetchImageData(index) {
		this.setLoader(true);
		this.setState({activeImageIndex: index})
		const selectedImage = this.props.images[index]
		if(selectedImage) {
			const imageData = await getImageData(this.props.api, selectedImage._id, selectedImage.page_no);
			this.setState({
				imageLabels: imageData.image_labels,
				textAnnotations: imageData.image_json ? imageData.image_json.text_annotations : []
			})
			this.canvasManager.clearAnnotations()
			this.canvasManager.setImage(imageData.image_url, () => {
				this.setLoader(false)
			})
			this.canvasManager.dispatch(CustomEventType.NOTIFY_LABEL_CREATION)
			this.canvasManager.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN)
		} else {
			this.setLoader(false)
		}
	}

	showProposals = (show) => {
		if(show) {
			this.canvasManager.setActiveTool(ToolType.Proposal, this.state.textAnnotations, this.state.imageLabels)
		} else {
			this.canvasManager.unsetActiveTool()
		}
	}

	setLoader(value) {
		this.setState({loading: value})
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
		this.canvasManager = new CanvasManager({appId})
	}

	render() {
		const {images, onAnnotationToolClose} = this.props
		const activeImage = images && images[this.state.activeImageIndex]
		return (
				<Box display="flex" style={{height: '100%'}}>
					<RegionLeftToolBar dispatch={undefined} regions={activeImage ? activeImage.regions : []} />
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
									textAnnotations={this.state.textAnnotations}
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
								getActiveTool={this.canvasManager.getActiveTool}
								unsetActiveTool={this.canvasManager.unsetActiveTool}
							/>
					}
				</Box>
		)
	}
}

const styles = {
	labelsHeader: {
		color: 'green'
	}
}
