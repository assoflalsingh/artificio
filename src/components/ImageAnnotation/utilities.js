export function generateImagesData(images) {
	const tmpDataImages = {};
	const data_lists = {};
	images.forEach((img)=>{
		tmpDataImages[`${img._id}:${img.page_no}`] = {
			_id: img._id,
			name: img.img_name,
			regions: [],
			model_regions: null,
			page_no: img.page_no,
			img_thumb: img.img_thumb,
			img_thumb_src: null,
			labels_data: [],
		}
		data_lists[img._id] = data_lists[img._id] || {};
		data_lists[img._id][img.page_no] = img.img_thumb;
	});
	return tmpDataImages
}

export function getStageScaleCoordinates(
	scale,
	pos,
	containerWidth,
	containerHeight,
	initialScale = 1
) {
	const deltaX = containerWidth * (scale.x - initialScale)
	const deltaY = containerHeight * (scale.y - initialScale)
	const x = pos.x > 0 ? 0 : pos.x > -deltaX ? pos.x : -deltaX
	const y = pos.y > 0 ? 0 : pos.y > -deltaY ? pos.y : -deltaY
	return {x, y}
}

export function getStageBounds(
	pos,
	stage,
	initialScale,
	oldScale,
	containerWidth,
	containerHeight
) {
	const scale = stage.scale()
	/* This function is used to normalize the scale of the stage using its initialScale */
	const actualScale = initialScale === 1 ? scale.x : scale.x / initialScale,
		scaledStageWidth = stage.width() * actualScale,
		scaledStageHeight = stage.height() * actualScale,
		stageBottomRightPos = {
			x: pos.x + scaledStageWidth,
			y: pos.y + scaledStageHeight
		}
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
					: pos.y
		}
		: getStageScaleCoordinates(scale, pos, containerWidth, containerHeight, initialScale)
}
