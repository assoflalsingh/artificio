import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import DataSetsList from './DataSetList';


const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataSetsManager() {
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        "Data sets list": <DataSetsList />
      }
    } panelClasses={classes.panelClasses}/>
  );
}