import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React from "react";

export const CreateModalDialog = ({modalOpen, onClose, createLabel}) => {
	return (
		<Dialog maxWidth={"xs"} onClose={onClose} aria-labelledby="customized-dialog-title" open={modalOpen}>
			<DialogTitle id="customized-dialog-title" onClose={onClose}>
				Create Label
			</DialogTitle>
			<DialogContent dividers>
				Here goes label creation
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={() => createLabel()} color="primary" variant="contained">
					Create Label
				</Button>
			</DialogActions>
		</Dialog>
	)
}
