import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemLink from './ListItemLink';
import { Divider } from '@material-ui/core';
import StorageIcon from '../assets/images/create-model.svg';
import FormatShapesIcon from '../assets/images/annotation.svg';
import SettingsIcon from '../assets/images/admin.svg';

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
  // const [open, setOpen] = React.useState(true);

  return (
    <>
      <List component="nav" className={classes.root}>
        <ListItemLink icon={FormatShapesIcon} primary='Data Flow' to={`${baseurl}/dataFlow`}/>
        <Divider />
        <ListItemLink icon={StorageIcon} primary='Annotation' to={`${baseurl}/annotation`}/>
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
          <ListItemLink icon={SettingsIcon} primary='Admin' to={`${baseurl}/admin`}/>
        <Divider />
      </List>
    </>
  );
}