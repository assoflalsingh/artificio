import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Box, Button, IconButton, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, withStyles } from '@material-ui/core';
import useEventCallback from 'react-image-annotate/hooks/use-event-callback';



const useStyles = makeStyles((theme)=>({
  leftBar: {
    backgroundColor: theme.palette.primary.main
  },
  toolbarBtnLabel: {
    flexDirection: 'column',
  }

}));

export function RegionLeftToolBar({dispatch}) {
  const classes = useStyles();

  const onClickItem = useEventCallback((event) => {
    dispatch({ type: "LEFT_TOOLBAR", button: event.currentTarget.dataset.name })
  });

  return(
    <Box className={classes.leftBar}>
      <IconButton data-name="save" onClick={onClickItem}><SaveIcon fontSize="large" /></IconButton>
    </Box>
  )
}


const ToolBarButton = withStyles({
  label: {
    flexDirection: 'column',
  }
})(({label, icon, classes, ...props})=>{
  return (
    <Button classes={{label: classes.label}} {...props}>
      {icon}
      {label}
    </Button>
  );
});

export function RegionTopToolBar({dispatch}) {
  const [shapesAnchor, setShapesAnchor] = React.useState(null);

  const onClickIconSidebarItem = useEventCallback((event) => {
    dispatch({ type: "SELECT_TOOL", selectedTool: event.currentTarget.dataset.name })
  });

  return(
    <Box>
      <ToolBarButton label='Select' icon={<CheckBoxOutlineBlankIcon />}
        data-name='select' onClick={(e)=>onClickIconSidebarItem(e)} />
      <ToolBarButton label='Drag/Pan' icon={<CheckBoxOutlineBlankIcon />}
        data-name='pan' onClick={(e)=>onClickIconSidebarItem(e)} />
      <ToolBarButton label='Shapes' icon={<CheckBoxOutlineBlankIcon />}
        onClick={(e)=>setShapesAnchor(e.target)} />
      <Menu open={Boolean(shapesAnchor)} anchorEl={shapesAnchor} onClose={(e)=>setShapesAnchor(null)}>
        <MenuItem data-name="create-box" onClick={(e)=>{ setShapesAnchor(null);onClickIconSidebarItem(e);}}>
          <ListItemIcon><CheckBoxOutlineBlankIcon /></ListItemIcon>
          <ListItemText primary="Box" />
        </MenuItem>
        <MenuItem data-name="create-polygon" onClick={(e)=>{ setShapesAnchor(null);onClickIconSidebarItem(e);}}>
          <ListItemIcon ><CheckBoxOutlineBlankIcon /></ListItemIcon>
          <ListItemText primary="Polygon" />
        </MenuItem>
      </Menu>
    </Box>
  )
}