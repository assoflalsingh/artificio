import React from 'react';
import { Container, Box, Paper, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { BrowserRouter as Router } from 'react-router-dom';
import {withStore} from 'react-context-hook';

import Logo from '../assets/images/Logo-final.png';
import UserBar from '../components/UserBar';
import MainContent from '../components/MainContent';
import SideMenuBar from '../components/SideMenuBar';

const useStyles = makeStyles((theme)=>({
  root: {
    width: '100%',
    height: '100%',
  },
  container: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  leftSide: {
    minWidth: '250px',
    backgroundColor: theme.palette.common.white,
    borderRadius: 0,
  },
  rightSide: {
    width: '100%',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  },
  bottomSide: {
    flexGrow: 1,
  },
  content: {

  },
  logoContainer: {
    display: 'flex',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey[200]
  },
  logoImg: {
    margin: 'auto',
  },
  dflex: {
    display: 'flex'
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <Router basename='/dashboard'>
      <Box className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
          <Box display="flex" flexDirection="column" className={classes.container}>
            <Box display="flex">
                <Paper item className={clsx(classes.leftSide, classes.logoContainer)}>
                  <img src={Logo} className={classes.logoImg}></img>
                </Paper>
                <UserBar className={classes.rightSide} userDispName={'Paul Doe'}/>
            </Box>
            <Box display="flex" className={classes.bottomSide}>
                <Paper item className={classes.leftSide}><SideMenuBar /></Paper>
                <MainContent className={classes.rightSide} />
            </Box>
          </Box>
        </Container>
      </Box>
    </Router>
  )
}

export default withStore(Dashboard);