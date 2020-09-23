import React from 'react';
import { Box, Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import ButtonLink from './ButtonLink';

const useStyles = makeStyles((theme)=>({
  root: {
    padding: '0',
    width: '175px',
  },
  content: {
    padding: '2rem 1rem'
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '1rem auto',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    margin: 'auto',
    width: '35%'
  },
  buttonLabel: {
    marginTop: '1rem',
    width: '100%'
  }
}));

export default function MenuTile({icon, label, buttonLabel, className, to}) {
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Box className={classes.iconContainer}>
          <img src={icon} width='100%' height='100%'></img>
        </Box>
        <Typography className={classes.label}>{label}</Typography>
        <ButtonLink to={to} color="primary" variant="contained" className={classes.buttonLabel}>{buttonLabel}</ButtonLink>
      </CardContent>
    </Card>
  )
}