import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import TextField from "@material-ui/core/TextField";

export const CreateModalDialog = ({ modalOpen, onClose, createLabel }) => {
  const [labelName, setLabelName] = React.useState();
  return (
    <Dialog
      maxWidth={"xs"}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Create Label
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          id="outlined-basic"
          label="Please enter label name"
          variant="outlined"
          style={{
            padding: 5,
          }}
          onChange={(e) => {
          	const value = e.target.value
            setLabelName({value, label: value, color: 'blue'});
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => createLabel(labelName)}
          color="primary"
          variant="contained"
        >
          Create Label
        </Button>
      </DialogActions>
    </Dialog>
  );
};
