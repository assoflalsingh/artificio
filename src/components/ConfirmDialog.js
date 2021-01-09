import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export default function ConfirmDialog({onCancel, onConfirm, open, title, content, ...props}) {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...props}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        {content}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button autoFocus onClick={onConfirm} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
