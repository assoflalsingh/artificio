import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
  previewChip: {
    backgroundColor: theme.palette.default.main
  },
  previewChipIcon: {
    color: theme.palette.text.secondary,
  }
}));

export default function FileDropZone({filesLimit=10, ...props}) {
  const classes = useStyles();
  return (
      <DropzoneArea
        filesLimit={filesLimit}
        useChipsForPreview={true}
        previewChipProps={{
          classes: {
            root: classes.previewChip,
            deleteIcon: classes.previewChipIcon
          }
        }}
        maxFileSize={10485760}
        {...props}
      />
  )
}