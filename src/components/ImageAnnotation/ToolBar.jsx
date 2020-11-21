import React from 'react';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import {Box, Button, ListItemText, Menu, MenuItem, withStyles} from '@material-ui/core';
import useEventCallback from 'react-image-annotate/hooks/use-event-callback';
import PanToolIcon from '@material-ui/icons/PanTool';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import {ToolType} from "../../canvas/core/constants";

const ToolBarButton = withStyles({
	label: {
		flexDirection: 'column',
	}
})(({label, icon, classes, active, ...props})=>{
	return (
		<Button classes={{label: classes.label}} {...props} color={active ? "primary" : ""}>
			{icon}
			{label}
		</Button>
	);
});

export function ToolBar(props) {
	const [shapesAnchor, setShapesAnchor] = React.useState(null);

	const onClickIconSidebarItem = useEventCallback((event) => {

	});

	const onSelectTool = (e) => {
		props.setActiveTool(ToolType.Rectangle)
	}

	return(
		<Box>
			<ToolBarButton label='Select' icon={<CheckBoxOutlineBlankIcon />}
										 data-name='select' onClick={(e)=>onClickIconSidebarItem(e)} />
			<ToolBarButton label='Drag/Pan' icon={<PanToolIcon />} data-name='pan' onClick={(e)=>onClickIconSidebarItem(e)} />
			<ToolBarButton label='Shapes' icon={<FormatShapesIcon />} onClick={(e)=>setShapesAnchor(e.target)} />
			<Menu open={Boolean(shapesAnchor)} anchorEl={shapesAnchor} onClose={(e)=>setShapesAnchor(null)}>
				<MenuItem data-name="create-box" onClick={(e)=>{ setShapesAnchor(null);onSelectTool(e);}}>
					<ListItemText primary="Bounding Box" />
				</MenuItem>
				{/*<MenuItem data-name="create-polygon" onClick={(e)=>{ setShapesAnchor(null);onClickIconSidebarItem(e);}}>*/}
				{/*	<ListItemText primary="Polygon" />*/}
				{/*</MenuItem>*/}
			</Menu>
		</Box>
	)
}
