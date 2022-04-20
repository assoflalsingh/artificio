import React from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
import { Route } from 'react-router-dom';
// import CreateModel from '../routes/CreateModel';
import Annotation from '../routes/Annotation';
import clsx from 'clsx';
import CopyrightIcon from '@material-ui/icons/Copyright';
import AppBreadCrumbs from './AppBreadCrumbs';
import Admin from '../routes/Admin';
import DataFlow from '../routes/DataFlow';

const useStylesContent = makeStyles((theme)=>({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  breadcrumbs: {
    width: '100%',
    padding: '1rem'
  },
  content: {
    marginTop: '1rem',
    height: '100%'
  },
  copyrights: {
    display: 'flex',
    margin: 'auto',
    padding: '1rem',
  }
}));

export default function MainContent({children, className, baseurl, ...props}) {
  const classes = useStylesContent();
  return (
    <Box className={clsx(classes.root, className)}>
      <AppBreadCrumbs />
      <Box className={classes.content}>
        {/* <Route path={`${baseurl}/createModel`} component={CreateModel} /> */}
        <Route path={`${baseurl}/dataFlow`} component={DataFlow} />
        <Route path={`${baseurl}/annotation`} component={Annotation} />
        <Route path={`${baseurl}/admin`} component={Admin} />
      </Box>
      <Box className={classes.copyrights}>
        <CopyrightIcon />&nbsp;<Typography>2020 Copyrights - Artificio</Typography>
      </Box>
    </Box>
  )
}