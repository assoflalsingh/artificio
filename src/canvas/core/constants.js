import {RectangleTool} from "../tools/RectangleTool";

export const CustomEventType = {
	SHOW_LOADER: 'SHOW_LOADER',
	SHOW_LABEL_DROPDOWN: 'SHOW_LABEL_DROPDOWN',
	HIDE_LABEL_DROPDOWN: 'HIDE_LABEL_DROPDOWN'
};

export const ToolType = {
	Rectangle: 'Rectangle'
}

export const AnnotationType = {
	Rectangle: 'rectangle'
}

export const KeyMappings = {
	Escape: 27
}

export const ToolTypeClassNameMap = {
	[ToolType.Rectangle]: RectangleTool
}
