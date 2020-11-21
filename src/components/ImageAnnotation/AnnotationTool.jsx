import * as React from "react";
import {RegionLeftToolBar, RegionTopToolBar} from "../../annotator/defaults";
import {Box, Button, CircularProgress, Typography} from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CanvasWrapper from "./CanvasWrapper";
import {CanvasManager} from "../../canvas/CanvasManager";
import {URL_MAP} from "../../others/artificio_api.instance";
import Thumbnails from "./Thumbnails";
import Loader from "./Loader";

const appId = 'canvas-annotation-tool'

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
		loading: false
	}

	async fetchImageData(index) {
		this.setLoader(true);
		this.setState({activeImageIndex: index})
		const selectedImage = this.props.images[index]
		if(selectedImage) {
			const imageData = await getImageData(this.props.api, selectedImage._id, selectedImage.page_no);
			this.canvasManager.setImage(imageData.image_url, () => {
				this.setLoader(false)
			})
		} else {
			this.setLoader(false)
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
			(
				<Box display="flex" style={{height: '100%'}}>
					<RegionLeftToolBar dispatch={undefined} regions={activeImage ? activeImage.regions : []} />
					<Box style={{flexGrow: 1, overflow: 'hidden'}}>
						<RegionTopToolBar dispatch={undefined} selectedTool={''}/>
						<Box style={{backgroundColor: 'black', height: '78%'}}>
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
					<Box style={{width: '300px', display: 'flex', flexDirection: 'column', padding: '0.5rem'}}>
						<Box display="flex">
							<Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>LABEL/ANNOTATION</Typography>
							<Button
								style={{marginLeft: 'auto'}}
								onClick={onAnnotationToolClose}
								startIcon={<CloseOutlinedIcon />}>
								Close
							</Button>
						</Box>
						{/*<Box style={{overflow: 'auto', flexGrow: 1}}>*/}
						{/*	{activeImage && */}
						{/*		<LabelValues */}
						{/*			activeImage={activeImage} */}
						{/*			labelsData={images[this.state.selectedImage].labels_data} */}
						{/*			setLabelsData={setLabelsData} */}
						{/*		/>}*/}
						{/*</Box>*/}
					</Box>
				</Box>
			)
		)
	}
}
