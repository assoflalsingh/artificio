import {RectangleTool} from "../tools/RectangleTool";

export const CustomEventType = {
	SHOW_LOADER: 'SHOW_LOADER',
};

export const ToolType = {
	Rectangle: 'Rectangle'
}

export const KeyMappings = {
	Escape: 27
}

export const ToolTypeClassNameMap = {
	[ToolType.Rectangle]: RectangleTool
}
