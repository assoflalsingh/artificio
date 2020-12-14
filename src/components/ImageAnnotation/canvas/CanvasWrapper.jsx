import React, { useEffect, useRef } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export const verticalScrollbarId = "vertical-scrollbar";
export const horizontalScrollbarId = "horizontal-scrollbar";
const styles = {
  verticalScrollbar: {
    height: "100%",
    position: "absolute",
    width: 15,
  },
  horizontalScrollbar: {
    width: "100%",
    position: "absolute",
    height: 15,
  },
};

const useStyles = makeStyles(styles);

const CanvasWrapper = ({ id }) => {
  const classes = useStyles();
  const canvasContainer = useRef(null);
  const [verticalScrollStyle, setVerticalScrollStyle] = React.useState({});
  const [horizontalScrollStyle, setHorizontalScrollStyle] = React.useState({});
  useEffect(() => {
    console.log(canvasContainer);
    const bounds = canvasContainer.current.getBoundingClientRect();
    setVerticalScrollStyle({
      left: bounds.x + bounds.width - 20,
      top: bounds.y,
      height: bounds.height,
    });
    setHorizontalScrollStyle({
      left: bounds.x,
      top: bounds.y + bounds.height - 20,
      width: bounds.width,
    });
  }, []);
  return (
    <>
      <Box
        ref={canvasContainer}
        className={"konva-canvas-container"}
        style={{ height: "100%" }}
      >
        <div id={id} style={{ height: "100%" }} />
      </Box>
      <div
        id={verticalScrollbarId}
        className={classes.verticalScrollbar}
        style={verticalScrollStyle}
      />
      <div
        id={horizontalScrollbarId}
        className={classes.horizontalScrollbar}
        style={horizontalScrollStyle}
      />
    </>
  );
};

export default CanvasWrapper;
