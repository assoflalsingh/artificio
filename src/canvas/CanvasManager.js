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
  AnnotationEventType,
  AnnotationProposalColor,
  AnnotationProposalLowConfidenceScoreColor,
} from "./annotations/Annotation";
import { UndoRedoStack } from "./core/UndoRedoStack";
import Rectangle from "./annotations/Rectangle";
import { getLabelValueFromProposals } from "../components/ImageAnnotation/utilities";
import { ConnectingLine } from "./core/connectingLine";

export class CanvasManager extends CanvasScene {
  activeTool;
  proposalTool;
  annotations = [];
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
    this.addConnectingLine();
    this.showLabelSelectorDropdown();
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
      // set label value
      const labelValue = getLabelValueFromProposals(
        this.selectedAnnotation,
        this.proposals
      );
      this.selectedAnnotation.setLabelValue(labelValue?.value);
      this.showLabelSelectorDropdown();
      this.notifyLabelCreation();
      this.updateUndoStack();
    });
  }

  hideLabelSelectorDropdown = () => {
    this.dispatch(CustomEventType.HIDE_LABEL_DROPDOWN);
  };

  showLabelSelectorDropdown = () => {
    if (this.selectedAnnotation) {
      // Show label selector dropdown
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
  }

  deleteAllAnnotations() {
    this.annotations.map((ann)=> { 
      const index = this.annotations.findIndex((anns) => anns.id === ann.id);
      const annotation = this.annotations[index];
      this.selectedAnnotation && this.deSelectActiveAnnotation();
      annotation.getShape().destroy();
    })
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
       const textToDisplay = allAnnotations[proposalIndex]?.word_details[wordIndex].word_description;
      if (proposal.isSelected) {
        this.proposalLayer.find(`.T${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
        this.proposalLayer.find(`.R${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
        this.proposalLayer.find(`.TR${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
        proposal.deSelect();
        proposalLayer.draw();
      } else {
        proposal.select();
        let text = new Konva.Text({
          x: proposal.annotationData.dimensions.x,
          y: proposal.annotationData.dimensions.y-12,
          text: textToDisplay,
          fontSize: 5,
          name:`T${textToDisplay.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`,
          padding: 4,
          fill: "black",
          fontStyle: "bold",
          fontFamily: 'Nunito'
        });
        let rect = new Konva.Rect({
          x: proposal.annotationData.dimensions.x+2,
          y: proposal.annotationData.dimensions.y-10,
          stroke: proposal.word.user_modified===1 ? "#e73cd0" : "#ffb600",
          fill:  proposal.word.user_modified===1 ? "#e73cd0" : "#ffb600",
          strokeWidth: 1,
          width: text.width(),
          height: text.height() - 4,
          name:`R${textToDisplay.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`,
          cornerRadius: 10,
        });
        proposalLayer.add(rect);
        proposalLayer.add(text);
        
        let transformer = new Konva.Transformer({
          nodes: [rect],
          enabledAnchors: ['middle-left', 'middle-right'],
          width: 75,
          name:`TR${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`,
          // set minimum width of text
          boundBoxFunc: function (oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          },
        });
        text.on('transform', function () {
          // reset scale, so only with is changing by transformer
          text.setAttrs({
            width: text.width() * text.scaleX(),
            scaleX: 1,
          });
        });


        proposalLayer.add(transformer);
        proposalLayer.draw();


        text.on('dblclick', () => {
          // hide text node and transformer:
          text.hide();
          rect.hide()
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
          let textarea = document.createElement('textarea');
          document.body.appendChild(textarea);
          // apply many styles to match text on canvas as close as possible
          // remember that text rendering on canvas and on the textarea can be different
          // and sometimes it is hard to make it 100% the same. But we will try...
          textarea.value = text.text();
          document.getElementsByClassName("MuiDialog-container MuiDialog-scrollPaper")[0].setAttribute("tabindex", "inherit");
          textarea.name="ediable-"+text.text();
          textarea.maxLength=200;
          textarea.cols=2;
          textarea.rows=2;
          textarea.style.position = 'absolute';
          textarea.style.top = areaPosition.y + 'px';
          textarea.style.left = areaPosition.x + 'px';
          textarea.style.border = "2px dashed blueviolet";
          textarea.style.background = "whitesmoke"
          textarea.style.height = text.height() - text.padding() * 2 + 5 + 'px';
          textarea.style.width = "100px";
          textarea.style.fontSize = '16px';
          textarea.style.padding = '2px';
          textarea.style.margin = '0px';
          textarea.style.overflow = 'hidden';
          textarea.style.outline = 'none';
          textarea.style.resize = 'none';
          textarea.style.lineHeight = text.lineHeight();
          textarea.style.fontFamily = text.fontFamily();
          textarea.style.transformOrigin = 'left top';
          textarea.style.textAlign = text.align();
          textarea.style.zIndex = 99999;
          textarea.style.color = "blueviolet";
          // reset height
          textarea.style.height = 'auto';
          // after browsers resized it we can set actual value
          textarea.style.height = textarea.scrollHeight + 3 + 'px';
          textarea.focus();
          function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            document.getElementsByClassName("MuiDialog-container MuiDialog-scrollPaper")[0].setAttribute("tabindex", "-1");
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
              navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
              newWidth = Math.ceil(newWidth);
            }
  
            let isEdge =
              document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
              newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
          }
  
          textarea.addEventListener('keydown', function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
              text.text(textarea.value);
              removeTextarea.call(this);
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
              removeTextarea.call(this);
            }
          });
  
          textarea.addEventListener('keydown', function (e) {
            let scale = rect.getAbsoluteScale().x;
            setTextareaWidth(rect.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height =
              textarea.scrollHeight + text.fontSize() + 'px';
          });
  
          function handleOutsideClick(e) {
            if (e.target !== textarea) {
              const ids = proposal.id.split("-");
              const proposalIndex = parseInt(ids[0]);
              const wordIndex = parseInt(ids[1]);
              if (allAnnotations[proposalIndex] && text.text() !== textarea.value) {
                allAnnotations[proposalIndex].word_details[wordIndex].word_description = textarea.value;
                allAnnotations[proposalIndex].word_details[wordIndex].["user_modified"] = 1;
                // update existing text, rect and transformer name
                text.name(`T${textarea.value.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`)
                rect.name(`R${textarea.value.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`)
                rect.stroke("#e73cd0");
                rect.fill("#e73cd0");
                transformer.name(`TR${textarea.value.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`);
              }
              text.text(textarea.value);
              removeTextarea.call(this);
              if(textarea.value.length > 5) {
                rect.width(textarea.value.length*3)
              }
              else
                {
                  rect.width(25)  
                }
              proposalLayer.draw();
            }
          }
          setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
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
        if(word)
          {
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
              word.confidence_score > 0.5
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
        this.proposalLayer.find(`.T${p.word.word_description.replace(/[\s, ,]/g, '')}-${p.getShape().attrs.id}`).remove();
        this.proposalLayer.find(`.R${p.word.word_description.replace(/[\s, ,]/g, '')}-${p.getShape().attrs.id}`).remove();
        this.proposalLayer.find(`.TR${p.word.word_description.replace(/[\s, ,]/g, '')}-${p.getShape().attrs.id}`).remove();
        p.deSelect()
      });
    }
    if (showProposals) {
      this.proposalLayer.show();
      this.proposalLayer.batchDraw();
    }
  }

  hideProposals() {
    this.proposalLayer.hide();
    this.proposalLayer.batchDraw();
  }

  deleteProposal(proposal) {
    this.proposalLayer.find(`.T${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
    this.proposalLayer.find(`.R${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
    this.proposalLayer.find(`.TR${proposal.word.word_description.replace(/[\s, ,]/g, '')}-${proposal.getShape().attrs.id}`).remove();
    const id = proposal.id;
    const index = this.proposals.find((p) => p.id === id);
    this.proposals.splice(index, 1);
    proposal.getShape().destroy();
    proposal.getShape().destroyChildren();
    this.proposalLayer.batchDraw();
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
    data.labels.forEach((label)=>{
      delete label['label_value'];
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
    if (selectedAnnotation) {
      this.connectingLine = new ConnectingLine(this);
      const line = this.connectingLine.getShape();
      if (line) {
        this.toolLayer.add(line);
        this.toolLayerDraw();
      }
    }
  };

  notifyLabelCreation(addConnectingLine = true) {
    this.dispatch(CustomEventType.NOTIFY_LABEL_CREATION);
    // setTimeout is required to make the label elements appear as it depends on async setState in LabelContainer
    setTimeout(() => {
      addConnectingLine && this.addConnectingLine();
    });
  }

  handleScrollZoomStart = () => {
    this.hideLabelSelectorDropdown();
    this.removeConnectingLine();
  };

  handleScrollZoomEnd = () => {
    this.showLabelSelectorDropdown();
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
