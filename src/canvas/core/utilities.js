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
