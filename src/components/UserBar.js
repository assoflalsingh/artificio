import React from 'react';
import { makeStyles, Box, InputAdornment, Badge, Avatar, Typography, IconButton, Menu, MenuItem, Popover } from '@material-ui/core';
import TextFieldRounded from './TextFieldRounded';
import SearchIcon from '@material-ui/icons/Search';
import MailOutline from '@material-ui/icons/MailOutline';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';

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

function UserBar({className, history}) {
  const classes = useStylesUserBar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const onSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = () => {
    localStorage.removeItem('token', null);
    window.location.reload();
  };
  return (
    <Box className={clsx(className, classes.root)}>
      {/* <Box><MoreHoriz /><Typography>Menu</Typography></Box> */}
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
          <Badge badgeContent={9} max={99} color="primary">
            <MailOutline />
          </Badge>
        </IconButton>
        <IconButton>
          <Badge badgeContent={3} max={99} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        <Typography color="textSecondary" className={classes.rightItem}>Hi, Paul Deo</Typography>
        <IconButton onClick={onSettingsClick}>
          <SettingsIcon />
        </IconButton>
        <Popover
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        </Popover>
      </Box>
    </Box>
  );
}

export default withRouter(UserBar);