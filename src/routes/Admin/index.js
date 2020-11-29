import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import Users from './Users';
import Account from './Account';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menucard: {
    marginLeft: '0.75rem',
  },
  panelClasses: {
    padding: '1rem',
  }
}));

export default function Admin({match}) {
  const classes = useStyles();
  const baseUrl = match.url;

  return (
    <CommonTabs tabs={
      {
        "Users": <Users />,
        "Account settings": <Account />,
      }
    } panelClasses={classes.panelClasses}/>
  );
}