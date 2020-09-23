import React from 'react';
import { makeStyles, Box, InputAdornment, Badge, Avatar, Typography, IconButton } from '@material-ui/core';
import TextFieldRounded from './TextFieldRounded';
import SearchIcon from '@material-ui/icons/Search';
import MailOutline from '@material-ui/icons/MailOutline';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import clsx from 'clsx';

const useStylesUserBar = makeStyles((theme)=>({
  root: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
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

export default function UserBar({className}) {
  const classes = useStylesUserBar();
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
        <Box className={classes.rightItem}>
          <Avatar alt='Paul Deo' className={classes.avatar}>P</Avatar>
        </Box>
      </Box>
    </Box>
  );
}