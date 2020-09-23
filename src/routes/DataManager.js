import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menucard: {
    marginLeft: '0.75rem',
  }
}));

export default function DataManger() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      Data Manger
    </Box>
  );
}