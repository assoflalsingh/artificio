import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CommonTabs from '../../components/CommonTabs';
// import {getInstance} from '../../others/artificio_api.instance';
import UploadFile from './UploadFile';
import DataList from './DataList';
import Results from './Results';
import Downloads from './Downloads';

const useStyles = makeStyles((theme) => ({
  panelClasses: {
    padding: '1rem',
  }
}));

export default function DataExtraction() {
  const [uploadCounter, setUploadCounter] = React.useState(1);
  const updateUploadCounter = () => {
    setUploadCounter(uploadCounter+1);
  }
  const classes = useStyles();
  return (
    <CommonTabs tabs={
      {
        "Upload File": <UploadFile successCB={updateUploadCounter}/>,
        "Data List": <DataList uploadCounter={uploadCounter}/>,
        "Results": <Results uploadCounter={uploadCounter} />,
        "Download Reports": <Downloads />,
      }
    } panelClasses={classes.panelClasses}/>
  );
}