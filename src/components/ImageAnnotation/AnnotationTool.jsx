import * as React from "react";
import {Box, Snackbar, Typography} from "@material-ui/core";
import CanvasWrapper from "./canvas/CanvasWrapper";
import {CanvasManager} from "../../canvas/CanvasManager";
import Thumbnails from "./helpers/Thumbnails";
import Loader from "./helpers/Loader";
import {ToolBar} from "./helpers/ToolBar";
import {LabelSelector} from "./label/LabelSelector";
import {LabelsContainer} from "./label/LabelsContainer";
import {CustomEventType, ToolType} from "../../canvas/core/constants";
import {getImageData, getStructureTemplate, saveAnnotationData, saveStructure} from "./apiMethods";
import Alert from "@material-ui/lab/Alert";
import {findTextAnnotations, generateAnnotationsFromData,} from "./utilities";
import {LeftToolBar} from "./helpers/LeftToolBar";
import { CreateStructureDialog } from "./helpers/CreateStructureDialog";
import { ChooseStructureDialog } from "./helpers/ChooseStructureDialog";

export const appId = "canvas-annotation-tool";
export const DefaultLabel = {
  label_name: "Label",
  label_value: "arto_others",
};
export default class AnnotationTool extends React.Component {
  canvasManager;
  textAnnotations;
  annotationAccuracy = {};
  imageData;
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
    ajaxMessage: null,
    imageName: null,
    createStructOpen: false,
    chooseStructOpen: false,
    deleteAllAnnotation: false,
  };

  deleteProposalInModelData = (proposal) => {
    const ids = proposal.id.split("-");
    const proposalIndex = parseInt(ids[0]);
    const wordIndex = parseInt(ids[1]);
    if (this.textAnnotations[proposalIndex]) {
      this.textAnnotations[proposalIndex].word_details[wordIndex] = null
    }
  };

  updateModelLabelsForAllAnnotations = (labelValue) => {
    const annotations = this.canvasManager.getAnnotations();
    annotations.forEach((ann) => {
      const proposals = this.canvasManager.getProposals();
      const words = findTextAnnotations(ann, proposals);
      const label = ann.getLabel();
      words.forEach((w) => {
        const index = w.index;
        const proposal = proposals[index];
        if (proposal) {
					const ids = proposal.id.split("-");
					const proposalIndex = parseInt(ids[0]);
					const wordIndex = parseInt(ids[1]);
					this.textAnnotations[proposalIndex].word_details[
						wordIndex
						].entity_label = labelValue || label;
				}
      });
    });
  };

  updateModelLabelsForDeletedAnnotation = (annId) => {
      const annotation = this.canvasManager.getAnnotationById(annId);
      const proposals = this.canvasManager.getProposals();
      const words = findTextAnnotations(annotation, proposals);
      words.forEach((w) => {
        const index = w.index;
        const proposal = proposals[index];
        if (proposal) {
          const ids = proposal.id.split("-");
					const proposalIndex = parseInt(ids[0]);
          const wordIndex = parseInt(ids[1]);
          this.textAnnotations[proposalIndex].word_details[
						wordIndex
						].entity_label = DefaultLabel.label_value;
				}
      });
  };

  updateModelAnnotationLabel = (proposals, labelName) => {
    if (proposals && proposals.length > 0) {
      proposals.forEach((proposal) => {
        const ids = proposal.id.split("-");
        const proposalIndex = parseInt(ids[0]);
        const wordIndex = parseInt(ids[1]);
        this.textAnnotations[proposalIndex].word_details[
          wordIndex
        ].entity_label = labelName;
      });
    }
  };

  updateModelAnnotationData = (proposal) => {
    if (proposal) {
      const ids = proposal.id.split("-");
      const proposalIndex = parseInt(ids[0]);
      const wordIndex = parseInt(ids[1]);
      const data = this.canvasManager.getAnnotationData(proposal);
      const word = this.textAnnotations[proposalIndex].word_details[wordIndex];
      if (word && word.bounding_box && word.bounding_box.vertices) {
        word.bounding_box.vertices = data.label_points.map((point) => {
          return { x: point[0], y: point[1] };
        });
      }
    }
  };

  setWordsAccuracyInModel = () => {
    for (let annotationId in this.annotationAccuracy) {
      const confidence = this.annotationAccuracy[annotationId];
      const annotation = this.canvasManager.getAnnotationById(annotationId);
      const proposals = this.canvasManager.getProposals();
      const words = findTextAnnotations(annotation, proposals);
      if (words.some((w) => w.confidence_score < 0.5) && confidence === 1) {
        words.forEach((w) => {
          const index = w.index;
          const proposal = proposals[index];
          if (proposal) {
						const ids = proposal.id.split("-");
						const proposalIndex = parseInt(ids[0]);
						const wordIndex = parseInt(ids[1]);
						this.textAnnotations[proposalIndex].word_details[
							wordIndex
							].confidence_score = 1.00;
					}
        });
      }
    }
  };

  getAnnotationAccuracy = (annotationId) => {
    return this.annotationAccuracy[annotationId];
  };

  setAnnotationAccuracy = (annotationId, confidence) => {
    this.annotationAccuracy[annotationId] = confidence;
  };

  addAnnotations(userAnnotatedData) {
    if (
      userAnnotatedData &&
      userAnnotatedData.labels &&
      userAnnotatedData.labels.length > 0
    ) {
      const annotations = generateAnnotationsFromData(
        userAnnotatedData,
        this.canvasManager.stage,
        this.state.imageLabels,
        this.canvasManager.imageDimensions,
        this.canvasManager.konvaImage.position(),
        {
          width: this.canvasManager.konvaImage.width(),
          height: this.canvasManager.konvaImage.height(),
        }
      );
      this.canvasManager.addAnnotationsFromData(annotations);
      this.canvasManager.notifyLabelCreation();
    }
  }

  initializeCanvas = () => {
    const imageData = this.imageData;
    const proposals = this.textAnnotations;
    // Clear canvas
    this.canvasManager.resetCanvas();
    // Reset undo redo stack
    this.canvasManager.resetUndoRedoStack();
    // set text annotations in canvas manager
    this.canvasManager.setTextAnnotations(this.textAnnotations);
    // Set canvas image
    this.canvasManager.setImage(imageData.image_url, () => {
      // Fit image to screen
      this.canvasManager.fitImageToScreen();
      this.addAnnotations(
        imageData.image_json ? imageData.image_json.user_annotate_data : {}
      );
      this.canvasManager.addOrResetProposals(proposals, false);
      this.canvasManager.notifyLabelCreation();
      if(imageData.struct_id && !this.props.inReview) {
        this.chooseStructure(imageData.struct_id);
      } else {
        this.setLoader(false);
      }
    });
    this.canvasManager.unsetProposalTool();
    this.canvasManager.hideLabelSelectorDropdown();
    this.canvasManager.dispatch(CustomEventType.NOTIFY_PROPOSAL_RESET);
  };

  async fetchImageData(index) {
    this.setLoader(true);
    this.setState({ activeImageIndex: index });
    const selectedImage = this.props.images[index];
    if (selectedImage) {
      this.imageData = await getImageData(
        this.props.api,
        selectedImage._id,
        selectedImage.page_no,
        this.props.inReview
      );
      this.textAnnotations = this.imageData.image_json
        ? this.imageData.image_json.text_annotations ||
          this.imageData.image_json.initial_model_data.text_annotations
        : [];
      this.setState({
        imageLabels: this.imageData.image_labels,
        imageMetadata: this.imageData.image_json.metadata,
        imageName: this.imageData.document_file_name,
      });
      this.initializeCanvas();
    } else {
      this.setLoader(false);
    }
  }

  saveImageData = (inReview) => {
    if(this.state.deleteAllAnnotation) {
      this.updateModelLabelsForAllAnnotations(DefaultLabel.label_value);
      this.canvasManager.deleteAllAnnotations();
    }
    const selectedImage = this.props.images[this.state.activeImageIndex];
    const annotatedData = this.canvasManager.getData();
    this.setLoader(true);
    this.updateModelLabelsForAllAnnotations();
    this.setWordsAccuracyInModel();
    saveAnnotationData(
      this.props.api,
      selectedImage._id,
      selectedImage.page_no,
      this.state.imageMetadata,
      this.textAnnotations,
      annotatedData,
      inReview
    )
      .then(() => {
        this.setLoader(false);
        this.canvasManager.dispatch(CustomEventType.NOTIFY_PROPOSAL_RESET);
        this.setState({
          deleteAllAnnotation: false,
          ajaxMessage: {
            error: false,
            text: "Annotation details saved successfully !!",
          },
        });
      })
      .catch((error) => {
        this.setLoader(false);
        if (error.response) {
          this.setState({
            ajaxMessage: {
              error: true,
              text: error.response.data.message,
            },
          });
        } else {
          console.error(error);
        }
      });
  };

  showProposals = (show) => {
    if (show) {
      this.canvasManager.setProposalTool(
        ToolType.Proposal,
        this.textAnnotations,
        this.state.imageLabels
      );
    } else {
      this.canvasManager.unsetProposalTool();
    }
  };

  createStructure = (otherData) => {
    const dataStructure = this.canvasManager.getDataStructure();
    let data = {
      ...otherData,
      'template': dataStructure
    };
    this.setState({createStructOpen: false});
    this.setLoader(true);
    saveStructure(
      this.props.api,data
    )
      .then(() => {
        this.setLoader(false);
        this.setState({
          ajaxMessage: {
            error: false,
            text: "Data structure saved successfully !!",
          },
        });
      })
      .catch((error) => {
        this.setLoader(false);
        if (error.response) {
          this.setState({
            ajaxMessage: {
              error: true,
              text: error.response.data.message,
            },
          });
        } else {
          console.error(error);
        }
      });
  }

  chooseStructure = (id) => {
    this.setState({chooseStructOpen: false});
    this.setLoader(true);
    getStructureTemplate(this.props.api, id)
      .then((resp) => {
        let data = {
          labels: resp.data.data
        }
        this.addAnnotations(data);
        this.setLoader(false);
        this.setState({
          ajaxMessage: {
            error: false,
            text: "Data structure loaded successfully !!",
          },
        });
      })
      .catch((error) => {
        this.setLoader(false);
        if (error.response) {
          this.setState({
            ajaxMessage: {
              error: true,
              text: error.response.data.message,
            },
          });
        } else {
          console.error(error);
        }
      });
  }

  setLoader(value) {
    this.setState({ loading: value });
  }

  fetchNextImage = () => {
    const nextIndex = this.state.activeImageIndex + 1;
    if (nextIndex < this.props.images.length) {
      this.fetchImageData(nextIndex);
    }
  };

  fetchPreviousImage = () => {
    const prevIndex = this.state.activeImageIndex - 1;
    if (prevIndex >= 0) {
      this.fetchImageData(prevIndex);
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    // Todo simplify logic
    // select first image
    if (nextProps && nextProps.images[this.state.activeImageIndex]) {
      const imageData = nextProps.images[this.state.activeImageIndex];
      const image = new Image();
      image.src = imageData.img_thumb_src;
      image.onload = () => {
        this.fetchImageData(0);
      };
      image.onerror = () => {
        this.setLoader(false);
      };
    } else {
      this.setLoader(false);
    }
  }

  preventZoom = (event) => {
		if ((event.ctrlKey===true || event.metaKey === true)
			&& (event.which === 61
				|| event.which === 107
				|| event.which === 173
				|| event.which === 109
				|| event.which === 187
				|| event.which === 189  ) ) {
			event.preventDefault();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.preventZoom)
	}

	componentDidMount() {
    this.setLoader(true);
    this.canvasManager = new CanvasManager(
      { appId },
      this.updateModelAnnotationData,
      this.updateModelAnnotationLabel,
      this.deleteProposalInModelData
    );
    window.addEventListener('keydown', this.preventZoom)
  }

  render() {
    const { images, onAnnotationToolClose } = this.props;
    const activeImage = images && images[this.state.activeImageIndex];
    return (
      <Box display="flex" style={{ height: "100%" }}>
        <LeftToolBar
          regions={activeImage ? activeImage.regions : []}
          undo={this.canvasManager && this.canvasManager.undo}
          redo={this.canvasManager && this.canvasManager.redo}
          fetchNextImage={this.fetchNextImage}
          fetchPreviousImage={this.fetchPreviousImage}
          save={this.saveImageData.bind(this)}
          clickZoomInOut={
            this.canvasManager && this.canvasManager.clickZoomInOut
          }
          inReview={this.props.inReview}
          deleteAllAnnotation = {this.state.deleteAllAnnotation}
        />
        <Box style={{ flexGrow: 1, overflow: "hidden", width: "75%" }}>
          <ToolBar
            setActiveTool={
              this.canvasManager &&
              this.canvasManager.setActiveTool.bind(
                this,
                ToolType.Rectangle,
                null,
                this.state.imageLabels
              )
            }
            unsetActiveTool={
              this.canvasManager && this.canvasManager.unsetActiveTool
            }
            onAnnotationToolClose={onAnnotationToolClose}
            showProposals={this.showProposals}
            blockAnnotationClick={
              this.canvasManager && this.canvasManager.blockAnnotationClick
            }
            setDeleteAllAnnotation = {(isDeleteAll= false)=> {this.setState({
              deleteAllAnnotation : isDeleteAll
            })}}
            setStageDraggable={
              this.canvasManager && this.canvasManager.setStageDraggable
            }
            showAnnotationLayer={
              this.canvasManager && this.canvasManager.showAnnotationLayer
            }
            reset={() => this.fetchImageData(this.state.activeImageIndex)}
            saveStructure={() => this.setState({createStructOpen: true})}
            chooseStructure={() => this.setState({chooseStructOpen: true})}
          />
          <Box style={{ backgroundColor: "#383838", height: "80%" }}>
            {this.state.loading && <Loader />}
            <CanvasWrapper id={appId} />
          </Box>
          <Box display="flex">
            {/*{this.state.selectedImage &&*/}
            {/*	<Typography style={{margin: 'auto'}}>*/}
            {/*		{images[this.state.selectedImage].document_file_name} {images[this.state.selectedImage].page_no})*/}
            {/*	</Typography>*/}
            {/*}*/}
            {activeImage && (
              <Typography style={{ margin: "auto" }}>
                {this.state.imageName || "Select an image...."}
              </Typography>
            )}
          </Box>
          <Thumbnails
            images={images}
            activeImageIndex={this.state.activeImageIndex}
            fetchImageData={this.fetchImageData.bind(this)}
          />
        </Box>
        <Box style={{ width: "25%", display: "flex", flexDirection: "column" }}>
          {this.canvasManager && (
            <LabelsContainer
              selectAnnotationById={this.canvasManager.selectAnnotationById}
              getAnnotations={this.canvasManager.getAnnotations}
              getAnnotationData={this.canvasManager.getAnnotationData}
              imageLabels={this.state.imageLabels}
              textAnnotations={this.textAnnotations}
              removeConnectingLine={this.canvasManager.removeConnectingLine}
              addConnectingLine={this.canvasManager.addConnectingLine}
              getProposals={this.canvasManager.getProposals}
              setAnnotationAccuracy={this.setAnnotationAccuracy}
              getAnnotationAccuracy={this.getAnnotationAccuracy}
            />
          )}
          {/*<Box style={{overflow: 'auto', flexGrow: 1}}>*/}
          {/*	{activeImage && */}
          {/*		<LabelValues */}
          {/*			activeImage={activeImage} */}
          {/*			labelsData={images[this.state.selectedImage].labels_data} */}
          {/*			setLabelsData={setLabelsData} */}
          {/*		/>}*/}
          {/*</Box>*/}
        </Box>
        {this.canvasManager && (
          <LabelSelector
            imageLabels={this.state.imageLabels}
            deSelectActiveAnnotation={
              this.canvasManager.deSelectActiveAnnotation
            }
            deleteAnnotation={() => {
              this.updateModelLabelsForDeletedAnnotation(this.canvasManager.getSelectedAnnotation().id);
              return this.canvasManager.deleteAnnotation(
                this.canvasManager.getSelectedAnnotation().id
              )
            }
            }
            getSelectedAnnotation={this.canvasManager.getSelectedAnnotation}
            setAnnotationLabel={this.canvasManager.setAnnotationLabel}
            // getActiveTool={this.canvasManager.getActiveTool}
            // unsetActiveTool={this.canvasManager.unsetActiveTool}
            getProposalTool={this.canvasManager.getProposalTool}
          />
        )}
        <CreateStructureDialog
          modalOpen={this.state.createStructOpen}
          onClose={()=>{this.setState({createStructOpen: false})}}
          createStructure = {this.createStructure}/>
        <ChooseStructureDialog
          api={this.props.api}
          modalOpen={this.state.chooseStructOpen}
          onClose={()=>{this.setState({chooseStructOpen: false})}}
          chooseStructure = {this.chooseStructure}/>
        <Snackbar
          open={Boolean(this.state.ajaxMessage)}
          autoHideDuration={6000}
        >
          {this.state.ajaxMessage && (
            <Alert
              onClose={() => this.setState({ ajaxMessage: null })}
              severity={this.state.ajaxMessage.error ? "error" : "success"}
            >
              {this.state.ajaxMessage.error ? "Error occurred: " : ""}
              {this.state.ajaxMessage.text}
            </Alert>
          )}
        </Snackbar>
      </Box>
    );
  }
}