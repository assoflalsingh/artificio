import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import DataGroupList from '../DataExtraction/DataGroup/DataGroupList';

const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataValidation() {
  const classes = useStyles();
  return (
  // <DataGroupList/>
    <CommonTabs tabs={
      {
        // "Upload File(s)": <DataSetsList />,
        "Data Group": <DataGroupList/>,
      }
    } panelClasses={classes.panelClasses}/>
  );
}