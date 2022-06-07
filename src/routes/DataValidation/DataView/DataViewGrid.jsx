import React from "react";
import { Dialog } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import DemoAgGrid from "./DemoAgGrid";

const DataViewGrid = (props) => {
  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      // disableBackdropClick
      disableEscapeKeyDown
    >
      <DemoAgGrid />
      <IconButton
        variant="outlined"
        onClick={props.onClose}
        style={{ zIndex: 9, top: 0, right: 0, position: "absolute" }}
      >
        <DeleteIcon style={{ fontSize: "1.2rem" }} />
      </IconButton>
    </Dialog>
  );
};

export default DataViewGrid;
