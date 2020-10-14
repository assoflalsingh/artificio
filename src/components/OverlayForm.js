import { Box, Button, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';

const useStyles = makeStyles((theme)=>({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: theme.palette.default.main,
    zIndex: theme.zIndex.drawer
  }
}));

/* NOTE: the parent need to have position relative for this component */

export default function OverlayForm({open, onClose, children}) {
  const classes = useStyles();
  if(open) {
    return (
      <Box className={classes.root}>
        <Button startIcon={<ChevronLeftOutlinedIcon />} onClick={onClose}>Back</Button>
        <Box>
          {children}
        </Box>
      </Box>
    );
  }
  return <></>;
}