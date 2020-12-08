import { RectangleTool } from "../tools/RectangleTool";
import { ProposalTool } from "../tools/ProposalTool";

export const CustomEventType = {
  SHOW_LOADER: "SHOW_LOADER",
  SHOW_LABEL_DROPDOWN: "SHOW_LABEL_DROPDOWN",
  HIDE_LABEL_DROPDOWN: "HIDE_LABEL_DROPDOWN",
  NOTIFY_LABEL_CREATION: "NOTIFY_LABEL_CREATION",
  SET_ACTIVE_TOOL: "SET_ACTIVE_TOOL",
	NOTIFY_PROPOSAL_RESET: "NOTIFY_PROPOSAL_RESET"
};

export const ToolType = {
  Rectangle: "Rectangle",
  Proposal: "Proposal",
};

export const ToolBarItemType = {
  Proposals: "Proposals",
  Shape: "Shape",
  Select: "Select",
  Drag: "Drag",
};

export const AnnotationType = {
  Rectangle: "Box",
  Proposal: "Proposal",
};

export const KeyMappings = {
  Escape: 27,
};

export const ToolTypeClassNameMap = {
  [ToolType.Rectangle]: RectangleTool,
  [ToolType.Proposal]: ProposalTool,
};
