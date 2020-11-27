import React from 'react';
import { makeStyles, Box, InputAdornment, Badge, Avatar, Typography, IconButton, Menu, MenuItem, Popover, CircularProgress, Tooltip } from '@material-ui/core';
import TextFieldRounded from './TextFieldRounded';
import SearchIcon from '@material-ui/icons/Search';
import MailOutline from '@material-ui/icons/MailOutline';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { titleCase } from '../others/utils';

const useStylesUserBar = makeStyles((theme)=>({
  root: {
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  right: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  },
  rightItem: {
    marginLeft: '1rem',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main.contrastText
  }
}));

function UserBar({className, user, history}) {
  const classes = useStylesUserBar();

  const onLogoutClick = () => {
    localStorage.removeItem('token', null);
    window.location.reload();
  };

  return (
    <Box className={clsx(className, classes.root)}>
      {/* <Box><MoreHoriz /><Typography>Menu</Typography></Box> */}
      {user && <Typography>
        Role: <strong>{titleCase(user.role_name.replace('_', ' '))} </strong>
        | Account: <strong>{user.account_number}</strong></Typography>}
      <Box className={classes.right}>
        <Box className={classes.rightItem}>
          <TextFieldRounded
            startAdornment={
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
            }
            placeholder='Search'
          />
        </Box>
        <IconButton>
          <Badge badgeContent={0} max={99} color="primary">
            <MailOutline />
          </Badge>
        </IconButton>
        <IconButton>
          <Badge badgeContent={0} max={99} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        {user &&
          <Typography className={classes.rightItem}>Hi, {user.first_name} {user.last_name}</Typography>}
        {!user &&
          <CircularProgress size="1.5rem" />}
        <Tooltip title="Logout">
          <IconButton onClick={onLogoutClick}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default connect((state)=>({user: state.user}))(withRouter(UserBar));