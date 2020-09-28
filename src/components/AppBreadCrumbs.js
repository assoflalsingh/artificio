import React from 'react';
import { makeStyles, Box, Paper, Breadcrumbs, Typography } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useLocation } from 'react-router-dom';


const useStylesContent = makeStyles((theme)=>({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  breadcrumbs: {
    width: '100%',
    padding: '0.5rem 1rem'
  },
  breadcrumbsDashboard: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
  content: {
    marginTop: '1.5rem',
    height: '100%'
  },
  copyrights: {
    display: 'flex',
    margin: 'auto',
    padding: '1rem',
  }
}));

const breadcrumbNameMap = {
  'createModel': 'Create Model',
  'dataManager': 'Data Manager',
  'annotation': 'Annotation',
  'dataExtraction': 'Data extraction',
}

function AppBreadCrumbs({children, className, ...props}) {
  const classes = useStylesContent();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x)=>x);

  return (
      <Paper className={classes.breadcrumbs}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb">
          <Box className={classes.breadcrumbsDashboard}>
            Dashboard
          </Box>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return last ? (
              <Typography key={to}>
                {breadcrumbNameMap[value]}
              </Typography>
            ) : (
              <Typography color="primary" to={to} key={to}>
                {breadcrumbNameMap[value]}
              </Typography>
            );
          })}
        </Breadcrumbs>
      </Paper>
  )
}

// const AppBreadCrumbs = withRouter(AppBreadCrumbsComp);

export default AppBreadCrumbs;