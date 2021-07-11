import * as React from "react";
import { Box, Snackbar, Typography } from "@material-ui/core";
import CanvasWrapper from "./canvas/CanvasWrapper";
import { CanvasManager } from "../../canvas/CanvasManager";
import Thumbnails from "./helpers/Thumbnails";
import Loader from "./helpers/Loader";
import { ToolBar } from "./helpers/ToolBar";
import { LabelSelector } from "./label/LabelSelector";
import { LabelsContainer } from "./label/LabelsContainer";
import { CustomEventType, ToolType } from "../../canvas/core/constants";
import {
  getImageData,
  getStructureTemplate,
  saveAnnotationData,
  saveStructure,
  assignData,
} from "./apiMethods";
import Alert from "@material-ui/lab/Alert";
import { findTextAnnotations, generateAnnotationsFromData } from "./utilities";
import exportToCSV from "./csvHelper";
import { LeftToolBar } from "./helpers/LeftToolBar";
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
  tableAnnotations;
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
    isSaved: false,
  };

  deleteProposalInModelData = (proposal) => {
    const ids = proposal.id.split("-");
    const proposalIndex = parseInt(ids[0]);
    const wordIndex = parseInt(ids[1]);
    if (this.textAnnotations[proposalIndex]) {
      this.textAnnotations[proposalIndex].word_details[wordIndex] = null;
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
          if (this.textAnnotations[proposalIndex].word_details[wordIndex]) {
            this.textAnnotations[proposalIndex].word_details[
              wordIndex
            ].entity_label = labelValue || label;
          }
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
        this.canvasManager.proposalLayer
          .find(
            `.T${w.word_description?.replace(/[\s, ,]/g, "")}-${
              proposals[index].getShape().attrs.id
            }`
          )
          .remove();
        this.canvasManager.proposalLayer
          .find(
            `.R${w.word_description?.replace(/[\s, ,]/g, "")}-${
              proposals[index].getShape().attrs.id
            }`
          )
          .remove();
        this.canvasManager.proposalLayer
          .find(
            `.TR${w.word_description?.replace(/[\s, ,]/g, "")}-${
              proposals[index].getShape().attrs.id
            }`
          )
          .remove();
        this.canvasManager.proposalLayer.draw();
        const ids = proposal.id.split("-");
        const proposalIndex = parseInt(ids[0]);
        const wordIndex = parseInt(ids[1]);
        if (this.textAnnotations[proposalIndex].word_details[wordIndex]) {
          this.textAnnotations[proposalIndex].word_details[
            wordIndex
          ].entity_label = DefaultLabel.label_value;
        }
      }
    });
  };

  updateModelAnnotationLabel = (proposals, labelName) => {
    if (proposals && proposals.length > 0) {
      proposals.forEach((proposal) => {
        const ids = proposal.id.split("-");
        const proposalIndex = parseInt(ids[0]);
        const wordIndex = parseInt(ids[1]);
        if (this.textAnnotations[proposalIndex].word_details[wordIndex]) {
          this.textAnnotations[proposalIndex].word_details[
            wordIndex
          ].entity_label = labelName;
        }
      });
    }
  };

  updateModelAnnotationData = (proposal) => {
    if (proposal) {
      const ids = proposal.id.split("-");
      const proposalIndex = parseInt(ids[0]);
      const wordIndex = parseInt(ids[1]);
      const data = this.canvasManager.getAnnotationData(proposal);
      const word = this.textAnnotations[proposalIndex]?.word_details[wordIndex];
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
      if (words.some((w) => w?.confidence_score < 0.5) && confidence === 1) {
        words.forEach((w) => {
          const index = w.index;
          const proposal = proposals[index];
          if (proposal) {
            const ids = proposal.id.split("-");
            const proposalIndex = parseInt(ids[0]);
            const wordIndex = parseInt(ids[1]);
            if (this.textAnnotations[proposalIndex].word_details[wordIndex]) {
              this.textAnnotations[proposalIndex].word_details[
                wordIndex
              ].confidence_score = 1.0;
            }
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

  setTableEdditingInPrgressTrigerRender(...arr) {
    this.canvasManager.setTableAnnotationInProgress(...arr);
    this.setState({
      toggleCell: true,
    });
  }

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
    const tableAnnotations = this.tableAnnotations;
    // Clear canvas
    this.canvasManager.resetCanvas();
    // Reset undo redo stack
    this.canvasManager.resetUndoRedoStack();
    // set text annotations in canvas manager
    this.canvasManager.setTextAnnotations(this.textAnnotations);
    // Set canvas image
    this.canvasManager.setImage(imageData?.image_url, () => {
      // Fit image to screen
      this.canvasManager.fitImageToScreen();
      this.addAnnotations(
        imageData.image_json ? imageData?.image_json.user_annotate_data : {}
      );
      this.canvasManager.addOrResetProposals(proposals, false);
      if (tableAnnotations?.length > 0) {
        this.canvasManager.addOrResetTableAnnotationProposals(tableAnnotations);
      }
      this.canvasManager.notifyLabelCreation();
      if (imageData.struct_id && !this.props.inReview) {
        this.chooseStructure(imageData?.struct_id);
      } else {
        this.setLoader(false);
      }
    });
    this.canvasManager.unsetProposalTool();
    this.canvasManager.hideLabelSelectorDropdown();
    this.canvasManager.dispatch(CustomEventType.NOTIFY_PROPOSAL_RESET);
  };

  async fetchImageData(index, isSaved = false, afterSave) {
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
      this.textAnnotations = this.imageData?.image_json
        ? this.imageData?.image_json?.text_annotations ||
          this.imageData?.image_json?.initial_model_data?.text_annotations
        : [];
      this.tableAnnotations = this.imageData?.image_json
        ? this.imageData?.image_json?.table_annotations ||
          this.imageData?.image_json?.initial_model_data?.table_annotations
        : [];
      if (this.tableAnnotations?.length > 0) {
        this.canvasManager.setTablesBoundries(
          this.tableAnnotations.map((el) => el.bounding_box)
        );
        this.canvasManager.setAllTablesAnnotations(this.tableAnnotations);
      }
      this.setState({
        imageLabels: this.imageData?.image_labels,
        imageMetadata: this.imageData?.image_json.metadata,
        imageName: this.imageData?.document_file_name,
        isSaved: isSaved,
      });
      // donot call after save
      if (!afterSave) this.initializeCanvas();
      else this.setLoader(false);
    } else {
      this.setLoader(false);
    }
  }

  downloadCsv(csvType, selectedTableIndex = 0) {
    this.setLoader(true);
    const selectedImage = this.props.images[this.state.activeImageIndex];
    const tableAnnotations = this.canvasManager.getAllTablesAnnotations();
    let csvName = `${this.state.imageName}-${selectedImage.page_no}.csv`;
    const annotatedData = this.canvasManager.getData();
    if (annotatedData["labels"].length === 0 && tableAnnotations.length <= 0) {
      this.setState({
        ajaxMessage: {
          error: true,
          text: "No data available  !!",
        },
      });
    } else {
      exportToCSV(
        csvName,
        annotatedData,
        tableAnnotations,
        csvType,
        selectedTableIndex
      );
    }
    this.setLoader(false);
  }

  saveImageData = (
    inReview = false,
    updatedTableAnnotation = this.canvasManager.getAllTablesAnnotations()
  ) => {
    if (this.state.deleteAllAnnotation) {
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
      inReview,
      updatedTableAnnotation
    )
      .then(() => {
        this.setLoader(false);
        this.canvasManager.dispatch(CustomEventType.NOTIFY_PROPOSAL_RESET);
        this.fetchImageData(this.state.activeImageIndex, !!inReview, true);
        this.setState({
          deleteAllAnnotation: false,
          isSaved: !!inReview,
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

  createStructure = (otherData, assign = false) => {
    const dataStructure = this.canvasManager.getDataStructure();
    let data = {
      ...otherData,
      template: dataStructure,
    };
    this.setState({ createStructOpen: false });
    this.setLoader(true);
    saveStructure(this.props.api, data)
      .then((res) => {
        if (assign) {
          const selectedImage = this.props.images[this.state.activeImageIndex];
          assignData(this.props.api, {
            type: "structure",
            datum: res.data.data.id,
            data_lists: {
              [selectedImage._id]: [selectedImage.page_no],
            },
          })
            .then(() => {
              this.setLoader(false);
              this.setState({
                ajaxMessage: {
                  error: false,
                  text: "Data structure saved and assigned successfully !!",
                },
              });
            })
            .catch((error) => {
              this.setLoader(false);
              console.error(error);
              let message = "Unknow error occurred. Check console.";
              if (error.response) {
                message = error.response.data.message;
              }
              this.setState({
                ajaxMessage: {
                  error: true,
                  text: message,
                },
              });
            });
        } else {
          this.setLoader(false);
          this.setState({
            ajaxMessage: {
              error: false,
              text: "Data structure saved successfully !!",
            },
          });
        }
      })
      .catch((error) => {
        this.setLoader(false);
        console.error(error);
        let message = "Unknow error occurred. Check console.";
        if (error.response) {
          message = error.response.data.message;
        }
        this.setState({
          ajaxMessage: {
            error: true,
            text: message,
          },
        });
      });
  };

  chooseStructure = (id) => {
    this.setState({ chooseStructOpen: false });
    this.setLoader(true);
    getStructureTemplate(this.props.api, id)
      .then((resp) => {
        let data = {
          labels: resp.data.data,
        };
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
  };

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
    if (
      (event.ctrlKey === true || event.metaKey === true) &&
      (event.which === 61 ||
        event.which === 107 ||
        event.which === 173 ||
        event.which === 109 ||
        event.which === 187 ||
        event.which === 189)
    ) {
      event.preventDefault();
    }
  };

  componentWillUnmount() {
    window.removeEventListener("keydown", this.preventZoom);
  }

  componentDidMount() {
    this.setLoader(true);
    this.canvasManager = new CanvasManager(
      { appId },
      this.updateModelAnnotationData,
      this.updateModelAnnotationLabel,
      this.deleteProposalInModelData
    );
    window.addEventListener("keydown", this.preventZoom);
  }

  render() {
    const { images, onAnnotationToolClose } = this.props;
    const activeImage = images && images[this.state.activeImageIndex];
    return (
      <Box display="flex" style={{ height: "100%" }}>
        <LeftToolBar
          isSaved={this.state.isSaved}
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
          deleteAllAnnotation={this.state.deleteAllAnnotation}
        />
        <Box style={{ flexGrow: 1, overflow: "hidden", width: "70%" }}>
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
            checkIfTableAnnotation={() =>
              this.canvasManager && this.canvasManager.checkIfTableAnnotation()
            }
            onAnnotationToolClose={onAnnotationToolClose.bind(
              this,
              this.state.isSaved
            )}
            showProposals={this.showProposals}
            blockAnnotationClick={
              this.canvasManager && this.canvasManager.blockAnnotationClick
            }
            setDeleteAllAnnotation={(isDeleteAll = false) => {
              this.setState({
                deleteAllAnnotation: isDeleteAll,
              });
            }}
            setStageDraggable={
              this.canvasManager && this.canvasManager.setStageDraggable
            }
            showAnnotationLayer={
              this.canvasManager && this.canvasManager.showAnnotationLayer
            }
            reset={() => this.fetchImageData(this.state.activeImageIndex)}
            saveStructure={() => this.setState({ createStructOpen: true })}
            chooseStructure={() => this.setState({ chooseStructOpen: true })}
            downloadCsv={() => this.downloadCsv()}
          />
          <Box style={{ backgroundColor: "#383838", height: "80%" }}>
            {this.state.loading && <Loader />}
            <CanvasWrapper id={appId} />
          </Box>
          <Box display="flex">
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
        <Box style={{ width: "30%", display: "flex", flexDirection: "column" }}>
          {this.canvasManager && (
            <LabelsContainer
              updateTableAnnotationAndSelectedValue={(
                annID,
                updatedValue,
                cellIndex,
                selectedTableIndex
              ) =>
                this.canvasManager.updateTableAnnotationAndSelectedValue(
                  annID,
                  updatedValue,
                  cellIndex,
                  selectedTableIndex
                )
              }
              checkIFAnnotationIntersectingWithTables={
                this.canvasManager.checkIFAnnotationIntersectingWithTables
              }
              getAllTableAnnProposals={
                this.canvasManager.getAllTableAnnProposals
              }
              downloadCsv={(csvType) => this.downloadCsv(csvType)}
              highlightTableToggle={this.canvasManager.highlightTableToggle}
              resetTableAnnotations={this.canvasManager.resetTableAnnotations}
              getAllTablesAnnotations={
                this.canvasManager.getAllTablesAnnotations
              }
              toggleHighlightCell={this.canvasManager.toggleHighlightCell}
              setTableAnnotationInProgress={this.setTableEdditingInPrgressTrigerRender.bind(
                this
              )}
              selectAnnotationById={this.canvasManager.selectAnnotationById}
              getAnnotations={this.canvasManager.getAnnotations}
              getAnnotationData={this.canvasManager.getAnnotationData}
              imageLabels={this.state.imageLabels}
              textAnnotations={this.textAnnotations}
              tableAnnotations={this.tableAnnotations}
              removeConnectingLine={this.canvasManager.removeConnectingLine}
              addConnectingLine={this.canvasManager.addConnectingLine}
              getProposals={this.canvasManager.getProposals}
              setAnnotationAccuracy={this.setAnnotationAccuracy}
              getAnnotationAccuracy={this.getAnnotationAccuracy}
              saveImageData={this.saveImageData.bind(this)}
              resetImageData={() =>
                this.fetchImageData(this.state.activeImageIndex)
              }
              getEdittedAnnotationCount={
                this.canvasManager.getEdittedAnnotationCount
              }
            />
          )}
        </Box>
        {this.canvasManager && (
          <LabelSelector
            imageLabels={this.state.imageLabels}
            deSelectActiveAnnotation={
              this.canvasManager.deSelectActiveAnnotation
            }
            checkIfTableAnnotation={() =>
              this.canvasManager && this.canvasManager.checkIfTableAnnotation()
            }
            deleteAnnotation={() => {
              this.updateModelLabelsForDeletedAnnotation(
                this.canvasManager.getSelectedAnnotation().id
              );
              return this.canvasManager.deleteAnnotation(
                this.canvasManager.getSelectedAnnotation().id
              );
            }}
            getSelectedAnnotation={this.canvasManager.getSelectedAnnotation}
            setAnnotationLabel={this.canvasManager.setAnnotationLabel}
            getProposalTool={this.canvasManager.getProposalTool}
            // isIntersectingWithTable={
            //   this.canvasManager.checkIFAnnotationIntersectingWithTables
            // }
            // saveImageData={this.saveImageData.bind(this)}
            // resetImageData={() =>
            //   this.fetchImageData(this.state.activeImageIndex)
            // }
            // getEdittedAnnotationCount={
            //   this.canvasManager.getEdittedAnnotationCount
            // }
          />
        )}
        <CreateStructureDialog
          modalOpen={this.state.createStructOpen}
          onClose={() => {
            this.setState({ createStructOpen: false });
          }}
          createStructure={this.createStructure}
        />
        <ChooseStructureDialog
          api={this.props.api}
          modalOpen={this.state.chooseStructOpen}
          onClose={() => {
            this.setState({ chooseStructOpen: false });
          }}
          chooseStructure={this.chooseStructure}
        />
        <Snackbar
          open={Boolean(this.state.ajaxMessage)}
          autoHideDuration={6000}
          onClose={() => this.setState({ ajaxMessage: null })}
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
