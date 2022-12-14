import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import {
  Box,
  IconButton,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ReplayIcon from "@material-ui/icons/Replay";
import RefreshIcon from "@material-ui/icons/Refresh";

const useStyles = makeStyles((theme) => ({
  leftBar: {
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    flexDirection: "column",
  },
  icon: {
    color: "white",
  },
  leftBarButton: {
    color: theme.palette.primary.contrastText,
  },
  toolbarBtnLabel: {
    flexDirection: "column",
  },
}));

export function LeftToolBar({
  inReview,
  undo,
  redo,
  fetchNextImage,
  fetchPreviousImage,
  save,
  clickZoomInOut,
  isSaved,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.leftBar}>
      <Tooltip title="Save progress">
        <IconButton
          data-name="save"
          disabled={isSaved}
          onClick={() => save()}
          className={classes.leftBarButton}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom In">
        <IconButton
          data-name="zoom in"
          onClick={() => clickZoomInOut(5)}
          className={classes.leftBarButton}
        >
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton
          data-name="zoom out"
          onClick={() => clickZoomInOut(-5)}
          className={classes.leftBarButton}
        >
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Undo">
        <IconButton
          data-name="undo"
          onClick={undo}
          className={classes.leftBarButton}
        >
          <ReplayIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton
          data-name="redo"
          onClick={redo}
          className={classes.leftBarButton}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Next Image">
        <IconButton
          data-name="next image"
          onClick={fetchNextImage}
          className={classes.leftBarButton}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Previous Image">
        <IconButton
          data-name="previous Image"
          onClick={fetchPreviousImage}
          className={classes.leftBarButton}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      {inReview && (
        <Tooltip title="Push to Reviewed">
          <IconButton
            data-name="done-save"
            onClick={() => save(true)}
            className={classes.leftBarButton}
          >
            <AssignmentTurnedInIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
