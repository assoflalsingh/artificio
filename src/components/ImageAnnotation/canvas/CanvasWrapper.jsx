import React from "react";
import { Box } from "@material-ui/core";

export default class CanvasWrapper extends React.Component {
  render() {
    return (
      <Box className={"konva-canvas-container"} style={{ height: "100%" }}>
        <div id={this.props.id} style={{ height: "100%" }} />
      </Box>
    );
  }
}
