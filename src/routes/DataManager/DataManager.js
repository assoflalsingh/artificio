import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
import DataSetsList from './DataSetList';
import DataSetsResults from './DataSetResults'

const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataSetsManager() {
  const [uploadCounter, setUploadCounter] = React.useState(1);
  // const updateUploadCounter = () => {
  //   setUploadCounter(uploadCounter+1);
  // }
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        "Upload File(s)": <DataSetsList />,
        "Data Flow Result": <DataSetsResults uploadCounter={uploadCounter}/>,
      }
    } panelClasses={classes.panelClasses}/>
  );
}