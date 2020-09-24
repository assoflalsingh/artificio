import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography, Dialog, DialogTitle, Paper, DialogContent, LinearProgress, IconButton, Link, Tooltip } from '@material-ui/core';
import CommonTabs from '../components/CommonTabs';
import FileDropZone from '../components/FileDropZone';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MUIDataTable from "mui-datatables";
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';

import seedrandom from 'seedrandom';
import axios from 'axios';

// const UPLOAD_URL = 'https://q4zw8vpl77.execute-api.us-west-2.amazonaws.com/upload-s3-final';
const UPLOAD_URL = 'http://54.187.136.177/upload-to-s3';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  panelClasses: {
    padding: '1.5rem',
  }
}));

const useStylesFU = makeStyles((theme) => ({
  root: {
    lineHeight: 2.5,
  },
  previewChip: {
    backgroundColor: theme.palette.default.main
  },
  previewChipIcon: {
    color: theme.palette.text.secondary,
  },
  marginLeft1: {
    marginLeft: '1rem',
  }
}));

function getEpochNow(){
  // d = javascript date obj
  // returns epoch timestamp
  let d = new Date();
  return (d.getTime()-d.getMilliseconds())/1000;
}

const useStylesFP = makeStyles(()=>({
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

function FileUploadProgress({fileUploadInfo=[], ...props}) {
  const classes = useStylesFP();
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

function QuickStart() {
  const username = 'test_user';
  const prng = new seedrandom(username.length.toString());
  const randUploadNo = Math.abs(prng.int32()).toString().substr(0, 6);
  const MAX_FILES = 10;

  const classes = useStylesFU();
  const [files, setFiles] = useState([]);
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressFileInfo, setProgressFileInfo] = useState([]);
  const [allProcessed, setAllProcessed] = useState(true);
  const [fileuploaderKey, setFileuploaderKey] = useState(0);

  /* progressFileInfo sample record
    {
      name: 'xyz', progress: '25', done: false, error: 'some error'
    }
  */

  useEffect(()=>{
    for(let i=0; i<progressFileInfo.length; i++) {
      if(!progressFileInfo[i]?.done) {
        return;
      }
    }
    setAllProcessed(true);
  }, [progressFileInfo]);

  const onSubmitClick = () => {
    let txnId = `${getEpochNow()}${randUploadNo}`;
    setFileuploaderKey(fileuploaderKey+1);
    setProgressFileInfo(files.map((files)=>{
      return {
        name: files.name, progress: 0,
      }
    }));

    const setProgressForFile = (i, data) => {
      setProgressFileInfo((prevProgressFileInfo)=>([
        ...prevProgressFileInfo.slice(0, i),
        {
          ...prevProgressFileInfo[i],
          ...data,
        },
        ...prevProgressFileInfo.slice(i+1)
      ]));
    };

    setProgressOpen(true);
    setAllProcessed(false);
    files.forEach((file, i) => {
      const formData = new FormData();
      formData.append('file',file);
      axios.post(UPLOAD_URL, formData,{
        headers :{
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
          'username': username,
          'txn_id': txnId,
          'file_name': file.name
        },
        onUploadProgress: (e)=>{
          let completed = Math.round((e.loaded * 100) / e.total);
          setProgressForFile(i, {
            progress: completed,
            done: completed == 100
          });
        }
      }).then((resp)=>{
        console.log(resp);
      })
      .catch((error) => {
        console.error(error);
        setProgressForFile(i, {
          progress: 0,
          done: true,
          error: 'Error occurred while uploading !!'
        });
      });
    });
  };

  return (
    <Box className={classes.root}>
      <Typography color="primary" variant="h5" gutterBottom>Quick add files to start annotation.</Typography>
      <Typography>To start annotations your project, import your files in single or multi-page formats. You can upload {MAX_FILES} files at a time.</Typography>
      <FileDropZone filesLimit={MAX_FILES} onChange={(files) => setFiles(files)} key={fileuploaderKey} />
      <Button variant="contained" color="secondary" onClick={onSubmitClick} disabled={files.length == 0 || !allProcessed}>{allProcessed ? 'Submit' : 'Uploading...'}</Button>
      <Button className={classes.marginLeft1} variant="outlined" onClick={()=>{setProgressOpen(true)}}>Check progress</Button>
      <FileUploadProgress fileUploadInfo={progressFileInfo} open={progressOpen} onClose={()=>{setProgressOpen(false)}} />
    </Box>
  );
}

const useStylesDS = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto'
  },
  marginLeft1: {
    marginLeft: '1rem',
  },
}));

function DataSet() {
  const classes = useStylesDS();
  const onCreateClick = () => {};

  const columns = [
    {
     name: "name",
     label: "Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "company",
     label: "Company",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "city",
     label: "City",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "state",
     label: "State",
     options: {
      filter: true,
      sort: false,
     }
    },
   ];


   const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
    { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
    { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
    { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
   ];


  const options = {
    filterType: 'checkbox',
    elevation: 0,
  };

  return (
    <>
    <Box display="flex">
      <Typography color="primary" variant="h6">Data List</Typography>
      <Chip className={classes.marginLeft1} color="secondary" label="Create data set" onClick={onCreateClick} onDelete={()=>{}} deleteIcon={<AddCircleIcon />}/>
      <Box className={classes.rightAlign}>
        <Button><PlayCircleFilledIcon color="primary" />&nbsp; Annotation</Button>
        <ButtonGroup className={classes.marginLeft1}>
          <Button>Date range</Button>
          <Button>Search data</Button>
        </ButtonGroup>
      </Box>
    </Box>
    <MUIDataTable
      title=''
      data={data}
      columns={columns}
      options={options}
    />
    </>
  )
}

export default function DataExtraction() {
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        "Quick start": <QuickStart />,
        "Datasets": <DataSet />,
        "Results": <Typography>tab3</Typography>
      }
    } panelClasses={classes.panelClasses}/>
  );
}