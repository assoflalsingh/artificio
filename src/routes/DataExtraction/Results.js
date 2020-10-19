import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

}));

export default function Results() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant='h4'>Results</Typography>
    </Box>
  )
}