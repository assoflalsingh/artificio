import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import DataView from './DataView';

const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataValidation() {
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        // "Upload File(s)": <DataSetsList />,
        "Data View": <DataView/>,
      }
    } panelClasses={classes.panelClasses}/>
  );
}