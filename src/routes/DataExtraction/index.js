import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import {getInstance} from '../../others/artificio_api.instance';
import UploadFile from './UploadFile';
import DataList from './DataList';
import Results from './Results';



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
        "Data list": <DataList />,
        "Results": <Results />,
      }
    } panelClasses={classes.panelClasses}/>
  );
}