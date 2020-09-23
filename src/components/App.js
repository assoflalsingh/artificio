import React from 'react';
import { Container, makeStyles, Box, Paper, CssBaseline } from '@material-ui/core';
import clsx from 'clsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import Logo from '../assets/images/Logo-final.png';
import Theme from './Theme';
import UserBar from './UserBar';
import MainContent from './MainContent';
import SideMenuBar from './SideMenuBar';
import SignIn from './SignIn';

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
    paddingLeft: '1rem',
    paddingRight: '1rem',
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

function AppForTheme() {
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
                <UserBar className={classes.rightSide}/>
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

export default function App() {
  return (
    <>
    <Theme>
      <CssBaseline />
      {/* <AppForTheme /> */}
      <Router>
        <Route path='/dashboard' component={AppForTheme} />
        <Route path='/login' component={SignIn} />
      </Router>
    </Theme>
    </>
  )
}