import React from 'react';
import { makeStyles, Paper, Breadcrumbs, Typography, Link } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

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
  'dataFlow': 'Data Flow',
  'createModel': 'Create Model',
  'dataManager': 'Data Manager',
  'annotation': 'Annotation',
  'dataExtraction': 'Data Extraction',
  'admin': 'Admin',
  'dashboard': 'Dashboard',
}

function AppBreadCrumbs({children, className, ...props}) {
  const classes = useStylesContent();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x)=>x);

  return (
      <Paper className={classes.breadcrumbs}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>} aria-label="breadcrumb">
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return last ? (
              <Typography key={to} >
                {breadcrumbNameMap[value]}
              </Typography>
            ) : (
              <Typography color="primary"  key={to}>
                <Link component={RouterLink} to={to}>{breadcrumbNameMap[value]}</Link>
              </Typography>
            );
          })}
        </Breadcrumbs>
      </Paper>
  )
}

// const AppBreadCrumbs = withRouter(AppBreadCrumbsComp);

export default AppBreadCrumbs;