import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Chip } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function SecondaryAddButton({className, label, onClick}) {
  return (
    <Button size="small" variant="contained" className={className}
      color="secondary" onClick={onClick} endIcon={<AddCircleIcon fontSize='large' />} style={{height: '2rem'}}>
        {label}
    </Button>
  )
}