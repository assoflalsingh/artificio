import React from 'react';
import clsx from 'clsx';
import { FormControl, OutlinedInput, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(()=>({
  root: {

  },
  o_input:{
    borderRadius: '2rem',
  },
  input:{
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  }
}));

export default function TextFieldRounded({className, ...props}) {
  const classes = useStyles();
  return (
    <FormControl className={classes.root} variant="outlined">
      <OutlinedInput
        {...props}
        className={clsx(classes.o_input, className)}
        inputProps={{className: classes.input}}
      />
    </FormControl>
  )
}