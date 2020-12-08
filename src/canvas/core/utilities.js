import Konva from "konva";

export function getScaledImageCoordinates(
  containerWidth,
  containerHeight,
  width,
  height,
  // { x: number; y: number }
  padding
) {
  // return type { width: number; height: number }
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
  const group = new Konva.Group({});
  const horizontalLine = new Konva.Line({
    points: [0, 0, dimensions.width, 0],
    stroke: "#0e61a2",
    strokeWidth: 1 / scale,
    dash: [5 / scale, 5 / scale],
  });
  const verticalLine = new Konva.Line({
    points: [0, 0, 0, dimensions.height],
    stroke: "#0e61a2",
    strokeWidth: 1 / scale,
    dash: [5 / scale, 5 / scale],
  });
  group.add(horizontalLine, verticalLine);
  return group;
};

export function getScaledCoordinates(point, stage) {
  const stagePosition = stage.position();
  const x = (point.x - stagePosition.x) / stage.scale().x;
  const y = (point.y - stagePosition.y) / stage.scale().y;
  return { x, y };
}

export function getUnScaledCoordinates(point, stage) {
  const stagePosition = stage.position();
  const x = point.x * stage.scale().x + stagePosition.x;
  const y = point.y * stage.scale().y + stagePosition.y;
  return { x, y };
}

export const TempRectangle = (scale) => {
  return new Konva.Rect({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    stroke: "#000000",
    dash: [5 / scale, 5 / scale],
    strokeWidth: 2 / scale,
  });
};

export function generateRandomColor() {
  return (
    "rgb(" +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    "," +
    Math.floor(Math.random() * 256) +
    ")"
  );
}

export function createCircle(params) {
  const circle = new Konva.Circle(params);
  circle.on("mouseover", () => {
    document.body.style.cursor = "crosshair";
  });
  circle.on("mouseout", () => {
    document.body.style.cursor = "default";
  });
  return circle;
}

export function cloneNestedObject(object, level) {
  if (object) {
    object = Object.assign(object instanceof Array ? [] : {}, object);
    for (const key in object) {
      if (typeof object[key] === "object" && level !== 0) {
        const value = object[key];
        // Carrying out recursion till defined level in the method
        object[key] = cloneNestedObject(value, level - 1);
      }
    }
    return object;
  }
}

export const getIntersectingRectangle = (r1, r2) => {
	[r1, r2] = [r1, r2].map(r => {
		return {x: [r.x1, r.x2].sort(), y: [r.y1, r.y2].sort()};
	});

	const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
		r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];

	return noIntersect ? false : {
		x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
		y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
		x2: Math.min(r1.x[1], r2.x[1]),
		y2: Math.min(r1.y[1], r2.y[1])
	};
};
