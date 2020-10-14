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

export function Stacked({children, to}) {
  return (
    <>
      {React.Children.map(children, (item)=>React.cloneElement(item, {show: item.props.path === to}))}
    </>
  );
}

export function StackItem({path, hasBack, main, onBack, children, show=false}) {
  if(main || show) {
    return (
      <Box style={{display: show ? 'unset': 'none'}}>
        {hasBack && <Button startIcon={<ChevronLeftOutlinedIcon />} onClick={onBack}>Back</Button>}
        <Box>
        {children}
        </Box>
      </Box>
    );
  } else {
    return <></>;
  }
}