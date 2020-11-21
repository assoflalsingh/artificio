import Konva from "konva";
import {paddingFactor} from "../CanvasScene";

export function getScaledImageCoordinates(
	containerWidth,
	containerHeight,
	width,
	height,
	// { x: number; y: number }
	padding
)
// return type { width: number; height: number }
{
	const widthRatio = ((1 - 2 * padding.x) * containerWidth) / width,
		heightRatio = ((1 - 2 * padding.y) * containerHeight) / height;
	const bestRatio = Math.min(widthRatio, heightRatio);
	const newWidth = width * bestRatio,
		newHeight = height * bestRatio;
	if (bestRatio === widthRatio) {
		padding.y = (containerHeight - newHeight) / 2 / containerHeight;
	} else {
		padding.x = (containerWidth - newWidth) / 2 / containerWidth;
	}
	return { width: newWidth, height: newHeight };
}

export const CursorPointerCrossHair = (
	// {
	// 	width: number
	// 	height: number
	// }
	dimensions,
	// number
	scale
) => {
	const group = new Konva.Group({})
	const horizontalLine = new Konva.Line({
		points: [0, 0, dimensions.width, 0],
		stroke: 'yellow',
		strokeWidth: 1 / scale,
		dash: [5 / scale, 5 / scale]
	})
	const verticalLine = new Konva.Line({
		points: [0, 0, 0, dimensions.height],
		stroke: 'yellow',
		strokeWidth: 1 / scale,
		dash: [5 / scale, 5 / scale]
	})
	group.add(horizontalLine, verticalLine)
	return group
}

export function getScaledCoordinates(
	point,
	stage
) {
	const imgCords = stage.position()
	let paddingX = stage.width() * paddingFactor
	let paddingY = stage.height() * paddingFactor
	const x = (point.x - imgCords.x) / stage.scale().x - paddingX
	const y = (point.y - imgCords.y) / stage.scale().y - paddingY
	return {x, y}
}
