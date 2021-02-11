import React, { forwardRef, useMemo } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function ListItemLink({icon, primary, to, onClick}) {
  const CustomLink = useMemo(
    () =>
        forwardRef((linkProps, ref) => (
            <Link ref={ref} to={to} {...linkProps} />
        )),
    [to],
  );

  return (
    <ListItem button component={CustomLink} onClick={onClick}>
      <img src={icon} alt={primary} width= {40} height= {30}></img>
      <ListItemText primary={primary} disableTypography/>
    </ListItem>
  );
}