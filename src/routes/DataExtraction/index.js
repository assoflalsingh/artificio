import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography } from '@material-ui/core';
import CommonTabs from '../../components/CommonTabs';
import FileDropZone from '../../components/FileDropZone';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MUIDataTable from "mui-datatables";
import FileUploadProgress from '../../components/FileUploadProgress';
import seedrandom from 'seedrandom';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import SecondaryAddButton from '../../components/SecondaryAddButton';
import OverlayForm from '../../components/OverlayForm';
import { Form, FormInputText, FormInputSelect, FormInputColor, FormRow, FormRowItem, doValidation } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import CreateLabel from './CreateLabel';
import CreateDataGroup from './CreateDataGroup';
import UploadFile from './UploadFile';
import DataSet from './DataSet';
import Results from './Results';

const api = getInstance(localStorage.getItem('token'));

const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataExtraction() {
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        "Upload file": <UploadFile />,
        "Datasets": <DataSet />,
        "Results": <Results />,
      }
    } panelClasses={classes.panelClasses}/>
  );
}