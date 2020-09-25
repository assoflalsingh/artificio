import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Dialog, DialogTitle, Paper, DialogContent, LinearProgress, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles(()=>({
  root: {
    fontSize: '1.25rem',
  },
  fileroot: {
    display: 'flex',
    padding: '1rem',
    minWidth: '400px',
    marginBottom: '0.5rem',
  },
  filedetails: {
    flexGrow: 1,
  },
  rightAlign: {
    marginLeft: 'auto',
  }
}));

/* fileUploadInfo sample records
[
  {
    name: 'xyz', progress: '25', done: false, error: 'some error'
  },
  {
    name: 'abc.png', progress: '100', done: true, error: null
  }
]
*/

export default function FileUploadProgress({fileUploadInfo=[], ...props}) {
  const classes = useStyles();
  const SingleFile = ({name, progress, done, error}) => {
    const showProgress = error ? false : (!done ? true : false);
    return (
      <Paper className={classes.fileroot} elevation={2}>
        <Box className={classes.filedetails}>
          <Box display="flex">
            <Box>{name}</Box>
            {showProgress && <Box className={classes.rightAlign}>{progress}%</Box>}
          </Box>
          {showProgress && <LinearProgress variant="determinate" value={progress} />}
        </Box>
        {done && !error &&
          <Box className={classes.rightAlign}>
            <DoneIcon color="secondary" />
          </Box>
        }
        {error &&
          <Box className={classes.rightAlign}>
            <Tooltip title={error}>
              <ErrorIcon color="error" />
            </Tooltip>
          </Box>
        }
      </Paper>
    )
  }
  return (
    <Dialog {...props} className={classes.root}>
      <DialogTitle>Files upload progress</DialogTitle>
      <DialogContent>
        {fileUploadInfo.map((fileInfo)=>{
          return <SingleFile name={fileInfo.name} progress={fileInfo.progress} done={fileInfo.done} error={fileInfo.error}/>
        })}
      </DialogContent>
    </Dialog>
  );
}