import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogText: {
    color: theme.palette.blue,
  },
});

function ConfirmDialog({
  onCancel,
  onConfirm,
  open,
  title,
  cancelText,
  onExtraAction,
  okText,
  content,
  extraAction,
  classes,
  ...props
}) {
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
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          {cancelText || "Cancel"}
        </Button>
        <Button
          autoFocus
          onClick={onConfirm}
          color="primary"
          variant="contained"
        >
          {okText || "OK"}
        </Button>
        {extraAction && (
          <Button
            autoFocus
            onClick={onExtraAction}
            color="primary"
            variant="outlined"
          >
            {extraAction || "Continue Editing"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
export default withStyles(styles)(ConfirmDialog);
