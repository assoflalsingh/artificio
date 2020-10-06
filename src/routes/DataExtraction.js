import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography, Dialog, DialogTitle, Paper, DialogContent, LinearProgress, IconButton, Link, Tooltip } from '@material-ui/core';
import CommonTabs from '../components/CommonTabs';
import FileDropZone from '../components/FileDropZone';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MUIDataTable from "mui-datatables";
import FileUploadProgress from '../components/FileUploadProgress';
import seedrandom from 'seedrandom';
import {getInstance, URL_MAP} from '../others/artificio_api.instance';

// const UPLOAD_URL = 'https://q4zw8vpl77.execute-api.us-west-2.amazonaws.com/upload-s3-final';
const UPLOAD_URL = 'http://54.187.136.177/upload-to-s3';

const api = getInstance(localStorage.getItem('token'));

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

function QuickStart() {
  const username = 'sharat';
  const prng = new seedrandom(username.length.toString());
  const randUploadNo = Math.abs(prng.int32()).toString().substr(0, 6);
  const MAX_FILES = 10;

  const classes = useStylesFU();
  const [files, setFiles] = useState([]);
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressFileInfo, setProgressFileInfo] = useState([]);
  const [allProcessed, setAllProcessed] = useState(true);
  const [fileuploaderKey, setFileuploaderKey] = useState(0);

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
      api.post(URL_MAP.UPLOAD_TO_S3, formData,{
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
            done: false
          });
        }
      }).then(()=>{
        setProgressForFile(i, {
          done: true
        });
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
      name: "filename",
      label: "Filename",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "datasetId",
      label: "Data Set ID",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "createdBy",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "systemStatus",
      label: "System Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          if(value == 'N') {
            return <Chip label="New" color="primary" />;
          } else{
            return <Chip label="Processed" color="secondary" />;
          }
        }
      },
    },
    {
      name: "assinedUser",
      label: "Assigned User",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "dateTime",
      label: "Date time",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        draggable: false,
      }
    },
  ];

   const data = [
    { filename: "Demo_001", datasetId: "IN-003", createdBy: "Yonkers", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "Demo_002", datasetId: "IN-003", createdBy: "Hartford", systemStatus: "P", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "a_long_file_name_is_possible", datasetId: "IN-003", createdBy: "Tampa", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "Demo_001", datasetId: "IN-003", createdBy: "Dallas", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
   ];


  const options = {
    filterType: 'checkbox',
    filterType: 'dropdown',
    elevation: 0,
    draggableColumns: {enabled: true}
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