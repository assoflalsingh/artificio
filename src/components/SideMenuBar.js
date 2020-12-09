import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemLink from './ListItemLink';
import { Divider, ListItem } from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  main_selected: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    borderLeftWidth: '0.25rem',
    borderLeftStyle: 'solid',
    borderLeftColor: theme.palette.primary.main,
  },

  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function SideMenuBar({baseurl}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <List component="nav" className={classes.root}>
        <ListItemLink icon={<StorageIcon />} primary='Create Model' to={`${baseurl}/createModel`}/>
        <ListItemLink icon={<FormatShapesIcon />} primary='Annotation' to={`${baseurl}/annotation`}/>
        {/* <MenuItem button onClick={handleClick}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Annotation" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <MenuItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </MenuItem>
          </List>
        </Collapse> */}
        <Divider />
          <ListItemLink icon={<SettingsIcon />} primary='Admin' to={`${baseurl}/admin`}/>
        <Divider />
      </List>
    </>
  );
}