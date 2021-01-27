import React, { forwardRef, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Chip, IconButton, Tooltip, withStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CachedIcon from '@material-ui/icons/Cached';
import { Link } from 'react-router-dom';


const YellowButton = withStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    backgroundColor: '#ffb600',
    '&:hover': {
      backgroundColor: '#dea414',
    }
  },
}))(Button);

export function CompactButton({className, label, onClick, ...props}) {
  return (
    <Button size="small" className={className}
      onClick={onClick} {...props} style={{
          height: '2rem'
        }}>
        {label}
    </Button>
  )
}

export function CompactAddButton({className, label, onClick, ...props}) {
  return <CompactButton className={className} onClick={onClick}
    endIcon={<AddCircleIcon fontSize='large' />} label={label} variant="contained" {...props}/>;
}

export function ButtonLink({children, to, ...props}) {
  const CustomLink = useMemo(
    () =>
        forwardRef((linkProps, ref) => (
            <Link ref={ref} to={to} {...linkProps} />
        )),
    [to],
  );

  return (
    <Button component={CustomLink} {...props}>{children}</Button>
  );
}

export function RefreshIconButton({onClick, className, label="Refresh"}) {
  return (
    <YellowButton size="small" className={className} startIcon={<CachedIcon />} variant="contained"
      onClick={onClick} style={{height: '2rem'}}>
        {label}
    </YellowButton>
  );
}