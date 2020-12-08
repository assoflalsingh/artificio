import React from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {Box, Button, ListItemText, makeStyles, Menu, MenuItem, withStyles,} from "@material-ui/core";
import PanToolIcon from "@material-ui/icons/PanTool";
import FormatShapesIcon from "@material-ui/icons/FormatShapes";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {ToolBarItemType} from "../../../canvas/core/constants";
import AppsIcon from "@material-ui/icons/Apps";

const useClasses = makeStyles(() => ({
  button: {
    borderRadius: 0,
		margin: '0 0 0 0.2rem'
  },
  active: {
    background: "#0575ce",
    color: "#ffffff",
    borderRadius: 0,
    "&:hover": {
      background: "#0575ce",
      color: "#ffffff",
    },
  },
}));

const ToolBarButton = withStyles({
  label: {
    flexDirection: "column",
  },
})(({ label, icon, active, disabled, ...props }) => {
  const classes = useClasses();
  return (
    <Button
      className={[active ? classes.active : undefined, classes.button]}
      disabled={disabled}
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
});


export function ToolBar(props) {
  const [shapesAnchor, setShapesAnchor] = React.useState(null);
	const [selectMode, setSelectMode] = React.useState(true);
	const [dragMode, setDragMode] = React.useState(true);
  const [activeTool, setActiveTool] = React.useState(undefined);
  const [showProposals, setProposals] = React.useState(false);
  const {blockAnnotationClick, setStageDraggable} = props

  const onSelectTool = (e) => {
    props.setActiveTool();
  };

  return (
    <Box>
      <ToolBarButton
        label="Select"
				active={selectMode}
        icon={<CheckBoxOutlineBlankIcon />}
        data-name="select"
        onClick={() => {
					const selected = !selectMode
					setSelectMode(selected)
					blockAnnotationClick(!selected)
				}}
      />
      <ToolBarButton
				active={dragMode}
        label="Drag/Pan"
        icon={<PanToolIcon />}
        data-name="pan"
        onClick={() => {
        	const dragAllowed = !dragMode
					setDragMode(dragAllowed)
					setStageDraggable(dragAllowed)
				}}
      />
      <ToolBarButton
        active={activeTool === ToolBarItemType.Shape}
        label="Shapes"
        icon={<FormatShapesIcon />}
        onClick={(e) => setShapesAnchor(e.target)}
      />
      <Menu
        open={Boolean(shapesAnchor)}
        anchorEl={shapesAnchor}
        onClose={(e) => setShapesAnchor(null)}
      >
        <MenuItem
          data-name="create-box"
          onClick={(e) => {
            setShapesAnchor(null);
            onSelectTool(e);
            setActiveTool(ToolBarItemType.Shape);
          }}
        >
          <ListItemText primary="Bounding Box" />
        </MenuItem>
        {/*<MenuItem data-name="create-polygon" onClick={(e)=>{ setShapesAnchor(null);onClickIconSidebarItem(e);}}>*/}
        {/*	<ListItemText primary="Polygon" />*/}
        {/*</MenuItem>*/}
      </Menu>
      <ToolBarButton
        active={showProposals}
        label="Proposals"
        icon={<AppsIcon />}
        onClick={() => {
          const show = !showProposals;
          setProposals(show);
          props.showProposals(show);
        }}
      />
      <ToolBarButton
        style={{ float: "right" }}
        label="Exit"
        icon={<ExitToAppIcon />}
        onClick={props.onAnnotationToolClose}
      />
    </Box>
  );
}
