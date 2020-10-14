import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';

const api = getInstance(localStorage.getItem('token'));

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