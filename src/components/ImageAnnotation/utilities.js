import Konva from "konva";
import * as uuid from "uuid";
import {generateRandomColor, getIntersectingRectangle} from "../../canvas/core/utilities";
export const scrollPadding = 5;
export const verticalScrollPadding = 8;
export const scrollBarWidth = 10;
export const scrollBarHeight = 10;

export function generateImagesData(images) {
  const tmpDataImages = {};
  const data_lists = {};
  images.forEach((img) => {
    tmpDataImages[`${img._id}:${img.page_no}`] = {
      _id: img._id,
      name: img.img_name,
      regions: [],
      model_regions: null,
      page_no: img.page_no,
      img_thumb: img.img_thumb,
      img_thumb_src: null,
      labels_data: [],
    };
    data_lists[img._id] = data_lists[img._id] || {};
    data_lists[img._id][img.page_no] = img.img_thumb;
  });
  return tmpDataImages;
}

export function getStageScaleCoordinates(
  scale,
  pos,
  containerWidth,
  containerHeight,
  initialScale = 1
) {
  const deltaX = containerWidth * (scale.x - initialScale);
  const deltaY = containerHeight * (scale.y - initialScale);
  const x = pos.x > 0 ? 0 : pos.x > -deltaX ? pos.x : -deltaX;
  const y = pos.y > 0 ? 0 : pos.y > -deltaY ? pos.y : -deltaY;
  return { x, y };
}

export function getStageBounds(
  pos,
  stage,
  initialScale,
  oldScale,
  containerWidth,
  containerHeight
) {
  const scale = stage.scale();
  /* This function is used to normalize the scale of the stage using its initialScale */
  const actualScale = initialScale === 1 ? scale.x : scale.x / initialScale,
    scaledStageWidth = stage.width() * actualScale,
    scaledStageHeight = stage.height() * actualScale,
    stageBottomRightPos = {
      x: pos.x + scaledStageWidth,
      y: pos.y + scaledStageHeight,
    };
  return scale.x < initialScale
    ? {
        x:
          stageBottomRightPos.x > stage.width()
            ? stage.width() - scaledStageWidth
            : pos.x <= 0
            ? 0
            : pos.x,
        y:
          stageBottomRightPos.y > stage.height()
            ? stage.height() - scaledStageHeight
            : pos.y <= 0
            ? 0
            : pos.y,
      }
    : getStageScaleCoordinates(
        scale,
        pos,
        containerWidth,
        containerHeight,
        initialScale
      );
}

export function getVerticalScrollBar(stage) {
  const stageWidth = stage.width(),
    stageHeight = stage.height();
  return new Konva.Rect({
    width: 0,
    height: 0,
    fill: "grey",
    opacity: 0.8,
    x: stageWidth - scrollPadding - 10,
    y: scrollPadding,
    cornerRadius: 4,
    draggable: true,
    dragBoundFunc: function (pos) {
      const scaleY = stage.scale().y;
      pos.x = stageWidth - scrollPadding - 10;
      pos.y = Math.max(
        Math.min(pos.y, stageHeight - scrollPadding - this.height() * scaleY),
        scrollPadding
      );
      return pos;
    },
  });
}

export function getHorizontalScrollbar(stage) {
  const stageWidth = stage.width(),
    stageHeight = stage.height();
  return new Konva.Rect({
    width: 0,
    height: 0,
    fill: "grey",
    opacity: 0.8,
    x: scrollPadding,
    y: stageHeight - scrollPadding - 10,
    draggable: true,
    cornerRadius: 4,
    dragBoundFunc: function (pos) {
      const scaleX = stage.scale().x;
      pos.x = Math.max(
        Math.min(pos.x, stageWidth - this.width() * scaleX - scrollPadding),
        scrollPadding
      );
      pos.y = stageHeight - scrollPadding - 10;

      return pos;
    },
  });
}

/**
 * @param words
 * {
 *  confidence_score: number,
		entity_label: string,
		word_description: string,
		vertices: {x: number, y: number}[]
 * }[]
 */
function sortWordsColumnWise(words) {
  words = words.sort((firstWord, lastWord) => {
    return firstWord.vertices[0].y - lastWord.vertices[0].y;
  });
  words = words.sort((firstWord, lastWord) => {
    return firstWord.vertices[0].x - lastWord.vertices[0].x;
  });
}

/**
 *
 * @param points: number[][]
 * @param textAnnotations
 * {
 * 		block_details: [],
			word_details: {
				word_description: string;
				entity_label: string;
				bounding_box: {
					vertices: {
						x: number;
						y: number
					}[]
				}
			}[]
		}[]
 */
export function findTextAnnotations(points, textAnnotations) {
  let words = [];
  const px1 = points[0][0];
  const py1 = points[0][1];
  const px2 = points[2][0];
  const py2 = points[2][1];
  textAnnotations &&
    textAnnotations.forEach((textAnnotation) => {
      textAnnotation.word_details.forEach((word) => {
        const vertices = word.bounding_box.vertices;
        const x1 = vertices[0].x;
        const y1 = vertices[0].y;
        const x2 = vertices[2].x;
        const y2 = vertices[2].y;

				if (x1 >= px1 && y1 >= py1 && x2 <= px2 && y2 <= py2) {
					words.push({
						confidence_score: word.confidence_score,
						entity_label: word.entity_label,
						word_description: word.word_description,
						vertices,
					});
				}

        const intersectingRectangle = getIntersectingRectangle(
        	{x1: px1, y1: py1, x2: px2, y2: py2},
					{x1, y1, x2, y2})
				if (intersectingRectangle) {
					const rectArea = (x2 - x1) * (y2 - y1)
					const intersectingRectArea =
						(intersectingRectangle.x2 - intersectingRectangle.x1) * (intersectingRectangle.y2 - intersectingRectangle.y1)
					const ratio = intersectingRectArea / rectArea
					if (ratio >= 0.5) {
						if (!words.find(w => w.word_description === word.word_description)) {
							words.push({
								confidence_score: word.confidence_score,
								entity_label: word.entity_label,
								word_description: word.word_description,
								vertices,
							});
						}
					}
				}
      });
    });
  // words = words.filter(w => w.confidence_score > 0.5)

  return words;
}

export function getLabelValueFromTextAnnotations(labelPoints, textAnnotations) {
  const words = findTextAnnotations(labelPoints, textAnnotations);
  let labelValue = "";
  words.forEach((w) => {
    labelValue = labelValue.concat(w.word_description + " ");
  });
  return labelValue;
}

export function generateAnnotationsFromData(
  data,
  stage,
  imageLabels,
  imageDimensions,
  imageWrapperPosition,
  imageWrapperDimensions
) {
  return data.labels.map((annotationData) => {
    const x = annotationData.label_points[0][0];
    const y = annotationData.label_points[0][1];
    let width =
      annotationData.label_points[2][0] - annotationData.label_points[0][0];
    let height =
      annotationData.label_points[2][1] - annotationData.label_points[0][1];
    width = (width / imageDimensions.width) * imageWrapperDimensions.width;
    height = (height / imageDimensions.height) * imageWrapperDimensions.height;

    const x1 =
      (x / imageDimensions.width) * imageWrapperDimensions.width +
      imageWrapperPosition.x;
    const y1 =
      (y / imageDimensions.height) * imageWrapperDimensions.height +
      imageWrapperPosition.y;

    return {
      coordinates: [x1, y1, x1 + width, y1 + height],
      label: annotationData.label_name,
      imageLabels,
      labelValue: annotationData.label_value,
      color: generateRandomColor(),
      id: uuid.v4(),
    };
  });
}
