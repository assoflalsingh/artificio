import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Grid, Link, Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import {getQueryParam} from '../others/utils';
import {getInstance, URL_MAP} from '../others/artificio_api.instance';

const api = getInstance();

const useStyles = makeStyles((theme) => ({
  content: {
    margin: 'auto',
  },
  root: {
    display: 'flex',
    height: '100%'
  },
  menucard: {
    marginRight: '0.75rem',
  }
}));

export default function Activate({location, history}) {
  const classes = useStyles();
  const [activating, setActivating] = useState(false);
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('Please wait... while we activate the user');

  useEffect(()=>{
    setActivating(true);
    let id = getQueryParam(location, '/activate', 'id');
    api.post(URL_MAP.ACTIVATE, {
      id: id
    }).then((resp)=>{
      setActive(true);
      setMessage('User is activated successfully !!');
    }).catch((err)=>{
      setMessage('Activation failed !!');
      if (err.response) {
        // client received an error response (5xx, 4xx)
        if(err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage(err.response.statusText + '. Activation failed.');
        }
      } else if (err.request) {
        // client never received a response, or request never left
      } else {
        // anything else
      }
    }).then(()=>{
      setActivating(false);
    });
  }, []);

  const onLoginClick = (e)=>{
    e.preventDefault();
    history.replace('/login');
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box className={classes.content}>
        <Typography variant="h4">{message}</Typography>
        {activating && <LinearProgress color="primary" />}
        {active && <Typography variant="h6">Click here to <Link href="#" onClick={onLoginClick}>log in</Link></Typography>}
      </Box>
    </Container>
  );
}