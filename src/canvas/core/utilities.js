import Konva from "konva";

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
		stroke: '#0e61a2',
		strokeWidth: 1 / scale,
		dash: [5 / scale, 5 / scale]
	})
	const verticalLine = new Konva.Line({
		points: [0, 0, 0, dimensions.height],
		stroke: '#0e61a2',
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
	const x = (point.x - imgCords.x) / stage.scale().x
	const y = (point.y - imgCords.y) / stage.scale().y
	return {x, y}
}


export const TempRectangle = (scale) => {
	return new Konva.Rect({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		stroke: '#000000',
		dash: [5 / scale, 5 / scale],
		strokeWidth: 2 / scale
	})
}

export function generateRandomColor() {
	return (
		'rgb(' +
		Math.floor(Math.random() * 256) +
		',' +
		Math.floor(Math.random() * 256) +
		',' +
		Math.floor(Math.random() * 256) +
		')'
	)
}

export function createCircle(params) {
	const circle = new Konva.Circle(params)
	circle.on('mouseover', () => {
		document.body.style.cursor = 'crosshair'
	})
	circle.on('mouseout', () => {
		document.body.style.cursor = 'default'
	})
	return circle
}
