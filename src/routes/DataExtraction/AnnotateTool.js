import React from 'react';
import { Dialog } from "@material-ui/core";
// import ReactImageAnnotate from "react-image-annotate";

export function AnnotateTool({open, onClose}) {
  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={open}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown
      PaperProps={{style: {height: '100%'}}}>

      {/* <ReactImageAnnotate
        labelImages
        images={[
          {
            src: "https://placekitten.com/408/287",
            name: "Image 1",
            regions: []
          }
        ]}/> */}
    </Dialog>
  )
}