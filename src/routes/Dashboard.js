import React, { useEffect } from 'react';
import { Container, Box, Paper, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
// import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from "react-redux";
import {setUser, setUserLoading} from "../store/reducers/user";

import { getInstance, URL_MAP } from '../others/artificio_api.instance';
import Logo from '../assets/images/logo.svg';
import UserBar from '../components/UserBar';
import MainContent from '../components/MainContent';
import { titleCase } from '../others/utils';
import Navbar from '../components/Navbar';

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
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  rightSide: {
    width: '100%',
    minWidth: 0,
  },
  bottomSide: {
    flexGrow: 1,
  },
  content: {

  },
  logoContainer: {
    // borderBottomColor: theme.palette.grey[200]
    boxShadow: 'none',
    position: 'relative',
    top: '6px',
  },
  logoImg: {
    margin: 'auto',
  },
  dflex: {
    display: 'flex'
  },
}));

const Dashboard = ({match, ...props}) => {
  const classes = useStyles();

  useEffect(()=>{
    const api = getInstance(localStorage.getItem('token'));
    props.setUserLoading();
    api.get(URL_MAP.USER_INFO)
      .then((res)=>{
        let data = res.data.data;
        data.role_name = titleCase(data.role_name.replace('_', ' '))
        props.setUser(data);
      })
      .catch((err)=>{
        console.error(err);
      });
  }, [props]);

  return (
      <Box className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
          <Box display="flex" flexDirection="column" className={classes.container}>
            <Box display="flex">
                <Paper item className={clsx(classes.leftSide, classes.logoContainer)} style={{marginRight: '0.8rem'}}>
                  <Box style={{padding: '0.25rem 0.5rem'}}>
                    <img src={Logo} alt="" className={classes.logoImg}></img>
                  </Box>
                </Paper>
                <UserBar className={classes.rightSide}/>
            </Box>
            <Box display="flex"><Navbar baseurl={match.url} /></Box>
            <Box display="flex" className={classes.bottomSide}>
                <MainContent className={classes.rightSide} baseurl={match.url} />
            </Box>
          </Box>
        </Container>
      </Box>
  )
}

export default connect(()=>({}), (dispatch)=>({
  setUser: (user)=>dispatch(setUser(user)),
  setUserLoading: ()=>dispatch(setUserLoading()),
}))(Dashboard);