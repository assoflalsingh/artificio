import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import Users from './Users';
import Account from './Account';
import { connect } from 'react-redux';

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

function Admin({match, user}) {
  const classes = useStyles();
  // const baseUrl = match.url;

  const tabs = {
    "Account settings": <Account />,
  }

  if(user.user_set) {
    if(user.role_name === 'Admin') {
      tabs["Users"] = <Users />;
    }
  }

  return (
    <CommonTabs tabs={tabs} panelClasses={classes.panelClasses}/>
  );
}

export default connect((state)=>({user: state.user}))(Admin);