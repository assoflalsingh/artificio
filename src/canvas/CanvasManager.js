import { CanvasScene } from "./CanvasScene";
import Konva from "konva";
import {
  AnnotationType,
  CustomEventType,
  ToolTypeClassNameMap,
} from "./core/constants";
import { getScaledCoordinates, getUnScaledCoordinates } from "./core/utilities";
import Proposal from "./annotations/Proposal";
import {
  AnnotationProposalColor,
  AnnotationProposalLowConfidenceScoreColor,
} from "./annotations/Annotation";
import { UndoRedoStack } from "./core/UndoRedoStack";
import Rectangle from "./annotations/Rectangle";
import {
  getLabelValueFromProposals,
  generateAnnotationsFromData,
  checkIfIntersectionsWithTable,
} from "../components/ImageAnnotation/utilities";
import { ConnectingLine } from "./core/connectingLine";
import { DefaultLabel } from "../components/ImageAnnotation/label/LabelSelector";
import * as cloneDeep from "lodash.clonedeep";

export class CanvasManager extends CanvasScene {
  activeTool;
  proposalTool;
  annotations = [];
  tablesBoundries = [];
  allTableAnnotations = [];
  tableAnnProposal = [];
  edittedAnnotations = new Set();
  proposals = [];
  selectedAnnotation;
  undoRedoStack = new UndoRedoStack();
  eventListeners = [
    {
      event: "click",
      func: this.findAndSelectAnnotation.bind(this),
    },
  ];
  updateModelAnnotationData;
  updateModelAnnotationLabel;
  textAnnotations;
  blockAnnotationSelect = false;
  connectingLine;
  isTableAnnotation = false;
  // ApplicationConfig is of type {appId: string}
  constructor(
    appConfig,
    updateModelAnnotationData,
    updateModelAnnotationLabel,
    deleteProposalInModelData
  ) {
    super(
      appConfig.appId,
      updateModelAnnotationData,
      updateModelAnnotationLabel
    );
    this.addEventListeners(this.eventListeners);
    this.updateModelAnnotationData = updateModelAnnotationData;
    this.updateModelAnnotationLabel = updateModelAnnotationLabel;
    this.deleteProposalInModelData = deleteProposalInModelData;
    window.canvas = this;
  }

  blockAnnotationClick = (value) => {
    this.blockAnnotationSelect = value;
  };

  setTextAnnotations(textAnnotations) {
    this.textAnnotations = textAnnotations;
  }
  // Below logic related to Table annotations and changes in the table data
  setTablesBoundries(boundries) {
    this.tablesBoundries = [...boundries];
  }
  setAllTablesAnnotations = (tableAnnotations) => {
    this.allTableAnnotations = cloneDeep(tableAnnotations);
    this.allTableAnnotations_Initial = cloneDeep(tableAnnotations);
  };
  resetTableAnnotations = () => {
    this.allTableAnnotations = cloneDeep(this.allTableAnnotations_Initial);
  };
  getAllTablesAnnotations = () => {
    return this.allTableAnnotations;
  };
  updateTableAnnotation = (updatedValue, cellIndex, selectedTableIndex) => {
    const updateValArray = updatedValue.split(" ");
    let allExistingTableAnnotations = cloneDeep(this.allTableAnnotations);
    let existingTableAnnotationsForSelectedTable =
      allExistingTableAnnotations[selectedTableIndex].cell_details;
    let wordDetails =
      existingTableAnnotationsForSelectedTable[cellIndex]?.word_details;
    if (wordDetails?.length) {
      wordDetails.map((word, index, allWords) => {
        word.user_modified = 1;
        if (allWords[index + 1]) {
          word.word_description = updateValArray[index] || "";
        } else {
          word.word_description = updateValArray
            .slice(index, updatedValue.split(" ").length)
            .join(" ");
        }
        return word;
      });
    } else {
      wordDetails = [
        {
          entity_label: "arto_others",
          word_description: updatedValue,
          user_modified: 1,
        },
      ];
    }
    existingTableAnnotationsForSelectedTable[cellIndex].word_details = [
      ...wordDetails,
    ];
    allExistingTableAnnotations[
      selectedTableIndex
    ].cell_details = existingTableAnnotationsForSelectedTable;
    this.allTableAnnotations = cloneDeep(allExistingTableAnnotations);
  };
  getTablesBoundries() {
    return this.tablesBoundries;
  }
  // Show is of type boolean
  setLoader(show) {
    this.dispatch(CustomEventType.SHOW_LOADER, { loading: show });
  }

  // Return type Rectangle
  getAnnotationById = (id) => {
    return this.annotations.find((ann) => ann.id === id);
  };

  getIntersectedAnnotation(pointer, layer, annotations) {
    let minArea = Infinity;
    let finalAnnotation;
    const intersections = layer.getAllIntersections(
      getUnScaledCoordinates(pointer, this.stage)
    );
    intersections.forEach((intersection) => {
      const annotation = annotations.find((ann) => {
        return Boolean(intersection.findAncestor("#" + ann.getShape().id()));
      });
      if (annotation) {
        const area = annotation.getArea() || 0;
        if (area < minArea) {
          minArea = area;
          finalAnnotation = annotation;
        }
      }
    });
    return finalAnnotation;
  }

  findAndSelectAnnotation(pointer) {
    if (this.annotationLayer.visible() && !this.blockAnnotationSelect) {
      const intersectedAnnotation = this.getIntersectedAnnotation(
        pointer,
        this.annotationLayer,
        this.annotations
      );
      intersectedAnnotation && this.selectAnnotation(intersectedAnnotation);
    }
  }

  selectAnnotation(annotation) {
    if (this.selectedAnnotation) {
      this.deSelectActiveAnnotation();
    }
    this.annotations.forEach((ann) => ann.deSelect());
    this.selectedAnnotation = annotation;
    annotation.select();
    this.addSelectedAnnotationEventListeners();
    this.annotationLayerDraw();
    !this.isTableAnnotation && this.addConnectingLine();
    this.showLabelSelectorDropdown("SELECTED");
    this.dispatch(CustomEventType.ON_ANNOTATION_SELECT, { id: annotation.id });
  }

  selectAnnotationById = (id) => {
    const annotation = this.getAnnotationById(id);
    if (annotation) {
      if (!this.selectedAnnotation) {
        this.selectAnnotation(annotation);
      } else if (this.selectedAnnotation.id !== annotation.id) {
        this.selectAnnotation(annotation);
      }
    }
  };

  getSelectedAnnotation = () => {
    return this.selectedAnnotation;
  };

  addSelectedAnnotationEventListeners() {
    this.selectedAnnotation.getShape().on("dragstart.select", () => {
      this.removeConnectingLine();
      // Hide label selector dropdown
      this.hideLabelSelectorDropdown();
    });
    this.selectedAnnotation.getShape().on("dragend.select", () => {
      const isTableInterSection = this.checkIFAnnotationIntersectingWithTables();
      const source = isTableInterSection
        ? this.tableAnnProposal
        : this.proposals;
      const labelValue = getLabelValueFromProposals(
        this.selectedAnnotation,
        source
      );
      this.selectedAnnotation.setLabelValue(labelValue?.value);
      this.showLabelSelectorDropdown("UPDATED");
      this.notifyLabelCreation();
      this.updateUndoStack();
    });
  }

  updateTableAnnotationAndSelectedValue(
    annId,
    updatedValue,
    cellIndex,
    selectedTableIndex
  ) {
    const selectedAnnotation = this.getAnnotationById(annId);
    selectedAnnotation.setLabelValue(updatedValue);
    this.updateTableAnnotation(updatedValue, cellIndex, selectedTableIndex);
  }
  hideLabelSelectorDropdown = () => {
    this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN);
  };

  showLabelSelectorDropdown = (action) => {
    if (this.selectedAnnotation) {
      // Show label selector dropdown
      this.dispatch(CustomEventType.ON_ANNOTATION_VALUE_CHANGE, {
        labelValue: this.selectedAnnotation.getLabelValue(),
        action: action,
      });
      this.dispatch(CustomEventType.SHOW_LABEL_DROPDOWN, {
        position: this.getLabelSelectorPosition(),
      });
    }
  };

  removeAnnotationEventListeners() {
    this.selectedAnnotation.getShape().off("dragstart.select");
    this.selectedAnnotation.getShape().off("dragend.select");
  }

  deSelectActiveAnnotation = () => {
    if (this.selectedAnnotation) {
      this.selectedAnnotation.deSelect();
      this.removeAnnotationEventListeners();
      this.selectedAnnotation = undefined;
      this.annotationLayerDraw();
      this.removeConnectingLine();
      this.hideLabelSelectorDropdown();
    }
  };

  /**
	 * {
			points: number[];
			id: string;
			color: string;
			label: string;
		}
	 * @param annotation
	 */
  addAnnotation = (annotation, select = true) => {
    this.edittedAnnotations.add(annotation.id);
    this.annotationLayer.add(annotation.getShape());
    this.annotationLayerDraw();
    this.annotations.push(annotation);
    if (select) {
      this.selectAnnotation(annotation);
      this.updateUndoStack();
    } else {
      annotation.deSelect();
    }
  };

  checkIFAnnotationIntersectingWithTables = (
    annotation = this.selectedAnnotation
  ) =>
    checkIfIntersectionsWithTable(
      annotation,
      this.tablesBoundries,
      this.konvaImage,
      this.imageDimensions
    );
  getEdittedAnnotationCount = () => this.edittedAnnotations.size;

  deleteAnnotation(id) {
    const index = this.annotations.findIndex((ann) => ann.id === id);
    const annotation = this.annotations[index];
    this.selectedAnnotation && this.deSelectActiveAnnotation();
    annotation.getShape().destroy();
    this.annotationLayer.batchDraw();
    this.annotations.splice(index, 1);
    this.hideLabelSelectorDropdown();
    this.notifyLabelCreation();
    this.updateUndoStack();
    if (this.edittedAnnotations.has(id)) {
      this.edittedAnnotations.delete(id);
    } else {
      this.edittedAnnotations.add(id);
    }
  }

  deleteAllAnnotations = () => {
    this.annotations.map((ann) => {
      const index = this.annotations.findIndex((anns) => anns.id === ann.id);
      const annotation = this.annotations[index];
      this.selectedAnnotation && this.deSelectActiveAnnotation();
      annotation.getShape().destroy();
      return ann;
    });
    this.annotations.splice(0, this.annotations.length);
    this.annotationLayer.batchDraw();
    this.hideLabelSelectorDropdown();
    this.notifyLabelCreation();
    this.updateUndoStack();
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
    annotation && annotation.focus();
    this.annotationLayer.batchDraw();
  }

  blurAnnotation(id) {
    const annotation = this.getAnnotationById(id);
    annotation && annotation.blur();
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

  resetCanvas(resetProposals = true) {
    this.unsetActiveTool();
    this.edittedAnnotations.clear();
    this.deSelectActiveAnnotation();
    this.annotationLayer.destroyChildren();
    this.annotations = [];
    this.annotationLayer.show();
    this.annotationLayer.batchDraw();
    if (resetProposals) {
      this.proposalLayer.destroyChildren();
      this.proposals = [];
      this.proposalLayer.batchDraw();
    }
    this.toolLayer.destroyChildren();
    this.toolLayerDraw();
    this.blockAnnotationSelect = false;
    this.setStageDraggable(true);
  }

  transformEventDataForTool = (event, eventData) => {
    switch (event) {
      case "click":
      case "mousemove":
      case "mousedown":
      case "mouseup":
        let cord = this.stage.getPointerPosition();
        cord = getScaledCoordinates(cord, this.stage);
        return cord;
      default:
        return eventData;
    }
  };

  on = (eventType, callback) => {
    if (this.activeTool) {
      eventType += "." + this.activeTool.toolType || "default";
    }
    this.stage.on(eventType, callback);
  };

  addEventListeners(eventListenerObjects) {
    eventListenerObjects.forEach((el) => {
      if (el.element) {
        el.element.addEventListener(el.event, el.func);
      } else {
        this.on(el.event, (evt) => {
          el.func(this.transformEventDataForTool(el.event, evt));
        });
      }
    });
  }

  removeEventListeners(eventListenerObjects) {
    eventListenerObjects.forEach((el) => {
      if (el.element) {
        el.element.removeEventListener(el.event, el.func);
      } else {
        let eventType = el.event;
        if (this.activeTool) {
          eventType += "." + this.activeTool.toolType;
        }
        this.stage && this.stage.off(eventType);
      }
    });
  }

  addToolShape = (figure) => {
    this.toolLayer.add(figure);
    figure.draw();
  };

  removeToolShape = (figure) => {
    if (figure) {
      figure.destroy();
      this.toolLayer.batchDraw();
    }
  };

  getActiveTool = () => {
    return this.activeTool;
  };

  getProposals = () => {
    return this.proposals;
  };

  getProposalTool = () => {
    return this.proposalTool;
  };

  checkIfTableAnnotation = () => {
    return this.isTableAnnotation;
  };
  setTableAnnotationInProgress = (status) => {
    this.deSelectActiveAnnotation();
    this.isTableAnnotation = status;
  };
  setActiveTool = (toolType, data, imageLabels) => {
    const tool = ToolTypeClassNameMap[toolType];
    this.activeTool = new tool(this, data, imageLabels);
    this.addEventListeners(this.activeTool.eventListeners);
    this.deSelectActiveAnnotation();
    this.dispatch(CustomEventType.SET_ACTIVE_TOOL, {
      toolType: this.activeTool.toolType,
    });
  };

  setProposalTool = (toolType, data, imageLabels) => {
    const tool = ToolTypeClassNameMap[toolType];
    this.proposalTool = new tool(this, data, imageLabels);
    this.addEventListeners(this.proposalTool.eventListeners);
    this.deSelectActiveAnnotation();
  };

  unsetProposalTool = () => {
    if (this.proposalTool) {
      this.removeEventListeners(this.proposalTool.eventListeners);
      this.proposalTool.exitTool();
      this.proposalTool = null;
      // Add click event listener to capture stage click events
      this.addEventListeners(this.eventListeners);
    }
  };

  unsetActiveTool = () => {
    if (this.activeTool) {
      this.removeEventListeners(this.activeTool.eventListeners);
      this.activeTool.exitTool();
      this.activeTool = null;
      this.dispatch(CustomEventType.SET_ACTIVE_TOOL, { toolType: null });
    }
  };

  toolLayerDraw() {
    this.toolLayer.batchDraw();
  }

  annotationLayerDraw() {
    this.annotationLayer.batchDraw();
  }

  resizeCanvasStroke = (scale) => {
    if (this.activeTool) {
      this.activeTool.resizeCanvasStroke(scale);
      this.toolLayerDraw();
    }
    if (this.proposalTool) {
      this.proposalTool.resizeCanvasStroke(scale);
      this.proposalLayer.batchDraw();
    }
    this.annotations.forEach((ann) => {
      ann.resizeCanvasStroke(this.stage.scaleX());
    });
    this.annotationLayerDraw();
  };
  // This logic is for showing and hiding of highlighted border on the table.
  removeHighlights = (elementName) => {
    this.annotationLayer.find(`.${elementName}`).destroy();
    // this.isTableAnnotation = false;
    this.edittedAnnotations.clear();
    this.annotationLayer.draw();
  };

  highlightTableToggle = (tableName, mode, boundingDetails) => {
    if (mode === "REMOVE") {
      // this.isTableAnnotation = false;
      if (this.annotations.length) {
        this.annotations.map((annotation) => {
          if (annotation.getLabel().indexOf("TABLE_ANN_") > -1) {
            return this.deleteAnnotation(annotation.id);
          }
          return annotation;
        });
      }
      return setTimeout(() => {
        // this.isTableAnnotation = false;
        this.removeHighlights(tableName);
      }, 500);
    }
    const coordinates = boundingDetails.vertices;
    const imagePosition = this.konvaImage.position();
    const topLeft = coordinates[0];
    const bottomRight = coordinates[2];
    const width =
      ((bottomRight.x - topLeft.x) / this.imageDimensions.width) *
      this.konvaImage.width();
    const height =
      ((bottomRight.y - topLeft.y) / this.imageDimensions.height) *
      this.konvaImage.height();
    const xPos =
      (topLeft.x / this.imageDimensions.width) * this.konvaImage.width() +
      imagePosition.x -
      1;
    const yPos =
      (topLeft.y / this.imageDimensions.height) * this.konvaImage.height() +
      imagePosition.y -
      1;
    this.updateImagePostion(this.konvaImage.position().x, yPos);
    let rect = new Konva.Rect({
      x: xPos,
      y: yPos,
      stroke: "#b71a3b",
      strokeWidth: 1,
      width: width + 1,
      height: height + 1,
      name: tableName,
      cornerRadius: 2,
      dash: [10, 10, 0.001, 5],
    });
    this.annotationLayer.add(rect);
    this.annotationLayer.draw();
    if (mode === "DISPLAY") {
      setTimeout(() => {
        this.removeHighlights(tableName);
      }, 1000);
    }
  };

  toggleHighlightCell = (cellToHighlight, cellDetails, annIDToDelete) => {
    if (annIDToDelete) {
      const ann = this.getAnnotationById(annIDToDelete);
      if (ann.getLabel().indexOf("TABLE_ANN_") > -1) {
        this.deleteAnnotation(ann.id);
      }
    }
    this.edittedAnnotations.clear();
    if (cellToHighlight) {
      const userAnnotatedData = {
        labels: [
          {
            label_name: `TABLE_ANN_${cellDetails.row_index}${cellDetails.column_index}${DefaultLabel.label_name}`,
            label_value: cellDetails.cellValue,
            label_color: "blue",
            label_points: cellDetails.bounding_box.vertices.map((a) => [
              a.x,
              a.y,
            ]),
            label_shape: "box",
          },
        ],
      };
      const annotations = generateAnnotationsFromData(
        userAnnotatedData,
        this.stage,
        [
          {
            label_name: `TABLE_ANN_${cellDetails.row_index}${cellDetails.column_index}${DefaultLabel.label_name}`,
            label_color: "blue",
          },
        ],
        this.imageDimensions,
        this.konvaImage.position(),
        {
          width: this.konvaImage.width(),
          height: this.konvaImage.height(),
        }
      );
      // this.isTableAnnotation = true;
      this.addAnnotationsFromData(annotations);
      return annotations;
    }
    return null;
  };
  getLabelSelectorPosition = () => {
    const annotation = this.selectedAnnotation;
    if (annotation) {
      const canvas = document.getElementById(this.appId);
      const canvasBoundingRect = canvas.getBoundingClientRect();
      const args = annotation.getLabelSelectorPosition();
      args.x *= this.stage.scale().x;
      args.y *= this.stage.scale().y;
      const stage = {
        x: this.annotationLayer.x() * this.stage.scale().x + this.stage.x(),
        y: this.annotationLayer.y() * this.stage.scale().y + this.stage.y(),
      };
      const position = {
        x: args.x + stage.x,
        y: args.y + stage.y,
      };
      const padding = 20;
      return {
        x: canvasBoundingRect.x + position.x,
        y: canvasBoundingRect.y + position.y + padding,
      };
    }
  };

  getSelectedAnnotation = () => {
    return this.selectedAnnotation;
  };

  setAnnotationLabel = (label) => {
    this.selectedAnnotation.setLabel(label.value);
    this.selectedAnnotation.setColor(label.color);
    this.selectedAnnotation.setRule(label.rule);
    this.selectedAnnotation.draw();
    this.removeConnectingLine();
    this.notifyLabelCreation();
    setTimeout(() =>
      this.dispatch(CustomEventType.ON_ANNOTATION_SELECT, {
        id: this.selectedAnnotation.id,
      })
    );
    this.updateUndoStack();
  };

  getAnnotations = () => {
    return this.annotations;
  };

  addProposalEventListeners(proposal) {
    // Add proposal event listeners
    proposal.getShape().on("mouseover", () => {
      if (!this.activeTool) {
        proposal.showCircles();
        this.proposalLayer.batchDraw();
      }
    });
    proposal.getShape().on("mouseout", () => {
      if (!this.activeTool) {
        proposal.hideCircles();
        this.proposalLayer.batchDraw();
      }
    });
    proposal.getShape().on("click", () => {
      // logic to get the word description
      let proposalLayer = this.proposalLayer;
      let allAnnotations = this.textAnnotations;
      const ids = proposal.id.split("-");
      const proposalIndex = parseInt(ids[0]);
      const wordIndex = parseInt(ids[1]);
      const textToDisplay =
        allAnnotations[proposalIndex]?.word_details[wordIndex].word_description;
      if (proposal.isSelected) {
        this.proposalLayer
          .find(
            `.T${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
              proposal.getShape().attrs.id
            }`
          )
          .remove();
        this.proposalLayer
          .find(
            `.R${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
              proposal.getShape().attrs.id
            }`
          )
          .remove();
        this.proposalLayer
          .find(
            `.TR${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
              proposal.getShape().attrs.id
            }`
          )
          .remove();
        proposal.deSelect();
        proposalLayer.draw();
      } else {
        proposal.select();
        let text = new Konva.Text({
          x: proposal.annotationData.dimensions.x,
          y: proposal.annotationData.dimensions.y - 12,
          text: textToDisplay,
          fontSize: 5,
          name: `T${textToDisplay.replace(/[\s, ,]/g, "")}-${
            proposal.getShape().attrs.id
          }`,
          padding: 4,
          fill: "black",
          fontStyle: "bold",
          fontFamily: "Nunito",
        });
        let rect = new Konva.Rect({
          x: proposal.annotationData.dimensions.x + 2,
          y: proposal.annotationData.dimensions.y - 10,
          stroke: proposal.word.user_modified === 1 ? "#e73cd0" : "#ffb600",
          fill: proposal.word.user_modified === 1 ? "#e73cd0" : "#ffb600",
          strokeWidth: 1,
          width: text.width(),
          height: text.height() - 4,
          name: `R${textToDisplay.replace(/[\s, ,]/g, "")}-${
            proposal.getShape().attrs.id
          }`,
          cornerRadius: 10,
        });
        proposalLayer.add(rect);
        proposalLayer.add(text);

        let transformer = new Konva.Transformer({
          nodes: [rect],
          enabledAnchors: ["middle-left", "middle-right"],
          width: 75,
          name: `TR${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
            proposal.getShape().attrs.id
          }`,
          // set minimum width of text
          boundBoxFunc: function(oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          },
        });
        text.on("transform", function() {
          // reset scale, so only with is changing by transformer
          text.setAttrs({
            width: text.width() * text.scaleX(),
            scaleX: 1,
          });
        });

        proposalLayer.add(transformer);
        proposalLayer.draw();

        text.on("dblclick", () => {
          // hide text node and transformer:
          text.hide();
          rect.hide();
          transformer.hide();
          proposalLayer.draw();
          // create textarea over canvas with absolute position
          // first we need to find position for textarea
          // how to find it?
          // at first lets find position of text node relative to the stage:
          let textPosition = text.absolutePosition();
          // then lets find position of stage container on the page:
          let stageBox = this.stage.container().getBoundingClientRect();
          // so position of textarea will be the sum of positions above:
          let areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y - 10,
          };
          // create textarea and style it
          let textarea = document.createElement("textarea");
          document.body.appendChild(textarea);
          // apply many styles to match text on canvas as close as possible
          // remember that text rendering on canvas and on the textarea can be different
          // and sometimes it is hard to make it 100% the same. But we will try...
          textarea.value = text.text();
          document
            .getElementsByClassName(
              "MuiDialog-container MuiDialog-scrollPaper"
            )[0]
            .setAttribute("tabindex", "inherit");
          textarea.name = "ediable-" + text.text();
          textarea.maxLength = 200;
          textarea.cols = 2;
          textarea.rows = 2;
          textarea.style.position = "absolute";
          textarea.style.top = areaPosition.y + "px";
          textarea.style.left = areaPosition.x + "px";
          textarea.style.border = "2px dashed blueviolet";
          textarea.style.background = "whitesmoke";
          textarea.style.height = text.height() - text.padding() * 2 + 5 + "px";
          textarea.style.width = "100px";
          textarea.style.fontSize = "16px";
          textarea.style.padding = "2px";
          textarea.style.margin = "0px";
          textarea.style.overflow = "hidden";
          textarea.style.outline = "none";
          textarea.style.resize = "none";
          textarea.style.lineHeight = text.lineHeight();
          textarea.style.fontFamily = text.fontFamily();
          textarea.style.transformOrigin = "left top";
          textarea.style.textAlign = text.align();
          textarea.style.zIndex = 99999;
          textarea.style.color = "blueviolet";
          // reset height
          textarea.style.height = "auto";
          // after browsers resized it we can set actual value
          textarea.style.height = textarea.scrollHeight + 3 + "px";
          textarea.focus();
          function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener("click", handleOutsideClick);
            document
              .getElementsByClassName(
                "MuiDialog-container MuiDialog-scrollPaper"
              )[0]
              .setAttribute("tabindex", "-1");
            text.show();
            text.width(150);
            transformer.width(70);
            rect.width(70);
            rect.show();
            transformer.show();
            transformer.forceUpdate();
            proposalLayer.draw();
          }

          function setTextareaWidth(newWidth) {
            if (!newWidth) {
              // set width for placeholder
              newWidth = text.placeholder.length * text.fontSize();
            }
            // some extra fixes on different browsers
            let isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            );
            let isFirefox =
              navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (isSafari || isFirefox) {
              newWidth = Math.ceil(newWidth);
            }

            let isEdge =
              document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
              newWidth += 1;
            }
            textarea.style.width = newWidth + "px";
          }

          // textarea.addEventListener('keydown', function (e) {
          //   // hide on enter
          //   // but don't hide on shift + enter
          //   if (e.keyCode === 13 && !e.shiftKey) {
          //     text.text(textarea.value);
          //     removeTextarea.call(this);
          //   }
          //   // on esc do not set value back to node
          //   if (e.keyCode === 27) {
          //     removeTextarea.call(this);
          //   }
          // });

          textarea.addEventListener("keydown", function(e) {
            if (e.which === 13) {
              handleOutsideClick(e);
            } else if (e.which === 27) {
              removeTextarea.call(this);
            } else {
              let scale = rect.getAbsoluteScale().x;
              setTextareaWidth(rect.width() * scale);
              textarea.style.height = "auto";
              textarea.style.height =
                textarea.scrollHeight + text.fontSize() + "px";
            }
          });

          function handleOutsideClick(e) {
            if (
              e.target !== textarea ||
              (e.target === textarea && e.which === 13)
            ) {
              const ids = proposal.id.split("-");
              const proposalIndex = parseInt(ids[0]);
              const wordIndex = parseInt(ids[1]);
              if (
                allAnnotations[proposalIndex] &&
                text.text() !== textarea.value
              ) {
                allAnnotations[proposalIndex].word_details[
                  wordIndex
                ].word_description = textarea.value;
                allAnnotations[proposalIndex].word_details[wordIndex][
                  "user_modified"
                ] = 1;
                // update existing text, rect and transformer name
                text.name(
                  `T${textarea.value.replace(/[\s, ,]/g, "")}-${
                    proposal.getShape().attrs.id
                  }`
                );
                rect.name(
                  `R${textarea.value.replace(/[\s, ,]/g, "")}-${
                    proposal.getShape().attrs.id
                  }`
                );
                rect.stroke("#e73cd0");
                rect.fill("#e73cd0");
                transformer.name(
                  `TR${textarea.value.replace(/[\s, ,]/g, "")}-${
                    proposal.getShape().attrs.id
                  }`
                );
              }
              text.text(textarea.value);
              removeTextarea.call(this);
              if (textarea.value.length > 5) {
                rect.width(textarea.value.length * 3);
              } else {
                rect.width(25);
              }
              proposalLayer.draw();
            }
          }
          setTimeout(() => {
            window.addEventListener("click", handleOutsideClick);
          });
        });

        // this.proposalLayer.add(rect);
        // this.proposalLayer.add(text);
      }

      // proposal.draw();
      // this.proposalLayer.draw();
    });
    proposal.getShape().on("dragend", () => {
      this.updateModelAnnotationData(proposal);
    });
  }

  /**
	 * @param proposals
		 {
		 		block_details: {},
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
  addOrResetProposals(proposals, showProposals = true) {
    if (this.proposals.length === 0 && proposals) {
      const imagePosition = this.konvaImage.position();
      proposals.forEach((proposal, proposalIndex) => {
        proposal.word_details.forEach((word, wordIndex) => {
          if (word) {
            const coordinates = word.bounding_box.vertices;
            const topLeft = coordinates[0];
            const bottomRight = coordinates[2];
            const width =
              ((bottomRight.x - topLeft.x) / this.imageDimensions.width) *
              this.konvaImage.width();
            const height =
              ((bottomRight.y - topLeft.y) / this.imageDimensions.height) *
              this.konvaImage.height();
            const annotationData = {
              dimensions: {
                x:
                  (topLeft.x / this.imageDimensions.width) *
                    this.konvaImage.width() +
                  imagePosition.x,
                y:
                  (topLeft.y / this.imageDimensions.height) *
                    this.konvaImage.height() +
                  imagePosition.y,
                w: width,
                h: height,
              },
              id: `${proposalIndex}-${wordIndex}`,
              label: word.bounding_box.entity_label,
              color:
                word?.confidence_score > 0.5
                  ? AnnotationProposalColor
                  : AnnotationProposalLowConfidenceScoreColor,
            };
            const proposal = new Proposal(
              annotationData,
              this.stage.scaleX(),
              word
            );
            this.addProposalEventListeners(proposal);
            this.proposals.push(proposal);
            this.proposalLayer.add(proposal.getShape());
          }
        });
      });
    } else {
      this.proposals.forEach((p) => {
        this.proposalLayer
          .find(
            `.T${p.word.word_description.replace(/[\s, ,]/g, "")}-${
              p.getShape().attrs.id
            }`
          )
          .remove();
        this.proposalLayer
          .find(
            `.R${p.word.word_description.replace(/[\s, ,]/g, "")}-${
              p.getShape().attrs.id
            }`
          )
          .remove();
        this.proposalLayer
          .find(
            `.TR${p.word.word_description.replace(/[\s, ,]/g, "")}-${
              p.getShape().attrs.id
            }`
          )
          .remove();
        p.deSelect();
      });
    }
    if (showProposals) {
      this.proposalLayer.show();
      this.proposalLayer.batchDraw();
    }
  }

  // Logic for consuming the tableAnnotations on load and create proposal instances of it.
  addOrResetTableAnnotationProposals(tableAnnotations) {
    this.tableAnnProposal = []; // Reset Table anotations as new will be created after re-fetch.
    const imagePosition = this.konvaImage.position();
    tableAnnotations.forEach((tableAnnotations, selectedTableIndex) => {
      tableAnnotations.cell_details.map((cell, cellIndex) => {
        return (
          cell.word_details &&
          cell.word_details.forEach((word, wordIndex) => {
            if (word) {
              const coordinates =
                word?.bounding_box?.vertices || cell.bounding_box?.vertices;
              const topLeft = coordinates[0];
              const bottomRight = coordinates[2];
              const width =
                ((bottomRight.x - topLeft.x) / this.imageDimensions.width) *
                this.konvaImage.width();
              const height =
                ((bottomRight.y - topLeft.y) / this.imageDimensions.height) *
                this.konvaImage.height();
              const annotationData = {
                dimensions: {
                  x:
                    (topLeft.x / this.imageDimensions.width) *
                      this.konvaImage.width() +
                    imagePosition.x,
                  y:
                    (topLeft.y / this.imageDimensions.height) *
                      this.konvaImage.height() +
                    imagePosition.y,
                  w: width,
                  h: height,
                },
                selectedTableIndex: selectedTableIndex,
              };
              const proposal = new Proposal(
                annotationData,
                this.stage.scaleX(),
                word
              );
              this.tableAnnProposal.push(proposal);
            }
          })
        );
      });
    });
  }

  getAllTableAnnProposals = () => {
    return this.tableAnnProposal;
  };
  hideProposals() {
    this.proposalLayer.hide();
    this.proposalLayer.batchDraw();
  }

  deleteProposal(proposal) {
    this.proposalLayer
      .find(
        `.T${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
          proposal.getShape().attrs.id
        }`
      )
      .remove();
    this.proposalLayer
      .find(
        `.R${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
          proposal.getShape().attrs.id
        }`
      )
      .remove();
    this.proposalLayer
      .find(
        `.TR${proposal.word.word_description.replace(/[\s, ,]/g, "")}-${
          proposal.getShape().attrs.id
        }`
      )
      .remove();
    const id = proposal.id;
    const index = this.proposals.find((p) => p.id === id);
    this.proposals.splice(index, 1);
    proposal.getShape().destroy();
    proposal.getShape().destroyChildren();
    this.proposalLayer.batchDraw();
  }

  convertCoorToPoints = (coordinates, realXY = true, scaled = false) => {
    const imagePosition = this.konvaImage.position();
    coordinates = Object.assign([], coordinates);

    // x1
    coordinates[0] = coordinates[0] - imagePosition.x;
    // y1
    coordinates[1] = coordinates[1] - imagePosition.y;
    // x2
    coordinates[2] = coordinates[2] - imagePosition.x;
    // y2
    coordinates[3] = coordinates[3] - imagePosition.y;

    if (scaled) {
      // x1
      coordinates[0] = coordinates[0] / this.konvaImage.width();
      // y1
      coordinates[1] = coordinates[1] / this.konvaImage.height();
      // x2
      coordinates[2] = coordinates[2] / this.konvaImage.width();
      // y2
      coordinates[3] = coordinates[3] / this.konvaImage.height();
    } else {
      // x1
      coordinates[0] = (coordinates[0] / this.konvaImage.width()) * this.imageDimensions.width;
      // y1
      coordinates[1] = (coordinates[1] / this.konvaImage.height()) * this.imageDimensions.height;
      // x2
      coordinates[2] = (coordinates[2] / this.konvaImage.width()) * this.imageDimensions.width;
      // y2
      coordinates[3] = (coordinates[3] / this.konvaImage.height()) * this.imageDimensions.height;
    }

    if(realXY){
      return [[coordinates[0], coordinates[1]], [coordinates[2], coordinates[3]]];
    }

    const width = coordinates[2] - coordinates[0];
    const height = coordinates[3] - coordinates[1];
    return [
        [coordinates[0], coordinates[1]],
        [coordinates[0] + width, coordinates[1]],
        [coordinates[2], coordinates[3]],
        [coordinates[0], coordinates[1] + height],
      ];
  }

  getAnnotationData = (annotation, scaled) => {
    const imagePosition = this.konvaImage.position();
    const annotationData = annotation.getData();
    const coordinates = Object.assign(
      [],
      annotation.type === AnnotationType.Proposal
        ? annotationData
        : annotationData.coordinates
    );

    // x1
    coordinates[0] = coordinates[0] - imagePosition.x;
    // y1
    coordinates[1] = coordinates[1] - imagePosition.y;
    // x2
    coordinates[2] = coordinates[2] - imagePosition.x;
    // y2
    coordinates[3] = coordinates[3] - imagePosition.y;

    if (scaled) {
      // x1
      coordinates[0] = coordinates[0] / this.konvaImage.width();
      // y1
      coordinates[1] = coordinates[1] / this.konvaImage.height();
      // x2
      coordinates[2] = coordinates[2] / this.konvaImage.width();
      // y2
      coordinates[3] = coordinates[3] / this.konvaImage.height();
    } else {
      // x1
      coordinates[0] =
        (coordinates[0] / this.konvaImage.width()) * this.imageDimensions.width;
      // y1
      coordinates[1] =
        (coordinates[1] / this.konvaImage.height()) *
        this.imageDimensions.height;
      // x2
      coordinates[2] =
        (coordinates[2] / this.konvaImage.width()) * this.imageDimensions.width;
      // y2
      coordinates[3] =
        (coordinates[3] / this.konvaImage.height()) *
        this.imageDimensions.height;
    }
    const width = coordinates[2] - coordinates[0];
    const height = coordinates[3] - coordinates[1];
    return {
      label_name: annotationData.label,
      label_value: annotationData.labelValue,
      label_rule: annotation.getRule(),
      label_shape: annotation.type.toLowerCase(),
      label_points: [
        [coordinates[0], coordinates[1]],
        [coordinates[0] + width, coordinates[1]],
        [coordinates[2], coordinates[3]],
        [coordinates[0], coordinates[1] + height],
      ],
    };
  };

  /**
	 *
	 * @param scaled
	 * @returns
	 * {
	 *   "image": {
					"w": number,
					"h": number
				},
				labels: {
					"label_name": number,
					"label_value": number,
					"label_shape": number,
					"label_points": number[][]
				}[]
	 * }
	 */
  getData = (scaled = false) => {
    const labels = [];
    this.annotations.forEach((ann) => {
      labels.push(this.getAnnotationData(ann, scaled));
    });
    return {
      image: {
        w: this.imageDimensions.width,
        h: this.imageDimensions.height,
      },
      labels,
    };
  };

  getDataStructure = (scaled = false) => {
    const data = this.getData(scaled);
    const ds = [];
    data.labels.forEach((label) => {
      delete label["label_value"];
      ds.push(label);
    });
    return ds;
  };

  updateUndoStack() {
    this.undoRedoStack.push(
      this.annotations.map((annotation) => {
        const data = annotation.getData();
        return {
          ...data,
          imageLabels: annotation.imageLabels,
          color: annotation.annotationData.color,
        };
      })
    );
  }

  addAnnotationsFromData(annotations) {
    annotations.forEach((annotation) => {
      const x1 = annotation.coordinates[0];
      const y1 = annotation.coordinates[1];
      const x2 = annotation.coordinates[2];
      const y2 = annotation.coordinates[3];
      const width = x2 - x1;
      const height = y2 - y1;
      const annotationData = {
        dimensions: { x: x1, y: y1, w: width, h: height },
        id: annotation.id,
        color: annotation.color,
        label: annotation.label,
        labelValue: annotation.labelValue,
      };
      const ann = new Rectangle(
        annotationData,
        this.stage.scaleX(),
        annotation.imageLabels
      );
      ann.deSelect();
      this.annotationLayer.add(ann.getShape());
      this.annotations.push(ann);
    });
    this.annotationLayerDraw();
  }

  undo = () => {
    this.resetCanvas(false);
    const annotations = this.undoRedoStack.undo();
    if (annotations && annotations.length > 0) {
      this.addAnnotationsFromData(annotations);
      this.notifyLabelCreation();
    }
  };

  redo = () => {
    const annotations = this.undoRedoStack.redo();
    if (annotations && annotations.length > 0) {
      this.resetCanvas(false);
      this.addAnnotationsFromData(annotations);
      this.notifyLabelCreation();
    }
  };

  resetUndoRedoStack = () => {
    this.undoRedoStack.reset();
  };

  removeConnectingLine = () => {
    const connectingLineArray = this.toolLayer.find("#connectingLine");
    if (this.connectingLine && connectingLineArray.length > 0) {
      connectingLineArray.getChildren().forEach((c) => {
        c.destroy();
        c.destroyChildren();
      });
      this.connectingLine = null;
      this.toolLayerDraw();
    }
  };

  addConnectingLine = () => {
    const selectedAnnotation = this.getSelectedAnnotation();
    if (selectedAnnotation && !this.isTableAnnotation) {
      this.connectingLine = new ConnectingLine(this);
      const line = this.connectingLine.getShape();
      if (line) {
        this.toolLayer.add(line);
        this.toolLayerDraw();
      }
    }
  };

  notifyLabelCreation(addConnectingLine = true) {
    if (!this.isTableAnnotation) {
      this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION);
      // setTimeout is required to make the label elements appear as it depends on async setState in LabelContainer
      setTimeout(() => {
        addConnectingLine && this.addConnectingLine();
      });
    }
  }

  handleScrollZoomStart = () => {
    this.hideLabelSelectorDropdown();
    this.removeConnectingLine();
  };

  handleScrollZoomEnd = () => {
    this.showLabelSelectorDropdown("ZOOMEND");
    this.addConnectingLine();
  };

  showAnnotationLayer = (value) => {
    this.unsetActiveTool();
    this.deSelectActiveAnnotation();
    value ? this.annotationLayer.show() : this.annotationLayer.hide();
    this.annotationLayerDraw();
  };

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

  destroy() {
    this.removeEventListeners(this.eventListeners);
    this.stage.destroyChildren();
    this.stage.destroy();
  }
}
