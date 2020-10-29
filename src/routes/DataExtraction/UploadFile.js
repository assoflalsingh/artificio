import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography } from '@material-ui/core';
import FileDropZone from '../../components/FileDropZone';
import FileUploadProgress from '../../components/FileUploadProgress';
import seedrandom from 'seedrandom';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import {getEpochNow} from '../../others/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: 2.5,
  },
  previewChip: {
    backgroundColor: theme.palette.default.main
  },
  previewChipIcon: {
    color: theme.palette.text.secondary,
  },
  ml1: {
    marginLeft: '1rem',
  }
}));

export default function UploadFile() {
  const username = 'aditya';
  const prng = new seedrandom(username.length.toString());
  const randUploadNo = Math.abs(prng.int32()).toString().substr(0, 6);
  const MAX_FILES = 10;
  const api = getInstance(localStorage.getItem('token'));

  const classes = useStyles();
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
      <Typography color="primary" variant="h5" gutterBottom>Add files to start annotation.</Typography>
      <Typography>To start annotations for your project, import your files in single or multi-page formats. You can upload {MAX_FILES} files at a time.</Typography>
      <FileDropZone filesLimit={MAX_FILES} onChange={(files) => setFiles(files)} key={fileuploaderKey} />
      <Button variant="contained" color="secondary" onClick={onSubmitClick} disabled={files.length == 0 || !allProcessed}>{allProcessed ? 'Submit' : 'Uploading...'}</Button>
      <Button className={classes.ml1} variant="outlined" onClick={()=>{setProgressOpen(true)}}>Check progress</Button>
      <FileUploadProgress fileUploadInfo={progressFileInfo} open={progressOpen} onClose={()=>{setProgressOpen(false)}} />
    </Box>
  );
}