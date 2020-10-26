import React from 'react';
import { Dialog } from "@material-ui/core";
// import ReactImageAnnotate from "react-image-annotate/ImageCanvas";
import Annotator from '../../annotator';

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

      <Annotator
        regionClsList={['label1', 'label2']}
        images={[
          {
            "src": "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
            "name": "car-image-1",
            regions: []
          }
        ]}/>
    </Dialog>
  )
}