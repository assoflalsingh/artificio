import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import MenuTile from '../components/MenuTile';
import DataExtractionIcon from '../assets/images/data-extraction.svg';
import StorageIcon from '../assets/images/create-model.svg';
// import TextDataIcon from '../assets/images/text-data.svg';
// import ImageDataIcon from '../assets/images/image-data.svg';
import DataExtraction from './DataExtraction';
// import DataManger from './DataManager/DataManager';
import DataValidation from './DataValidation';
import {Switch as RouterSwitch, Route} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  self: {
    display: 'flex',
  },
  menucard: {
    marginRight: '0.75rem',
  }
}));

export default function DataModel({match}) {
  const classes = useStyles();

  return (
    <RouterSwitch>
      <Route path={match.url+'/dataExtraction'} component={DataExtraction} />
      <Route path={match.url+'/data_validation'} component={DataValidation} />
      <Route>
        <Box className={classes.self}>
          <MenuTile to={match.url+'/dataExtraction'} icon={StorageIcon} label="Train Model" buttonLabel="Start Training" className={classes.menucard} toolTipDesc={<><em>Start Annotation and extract text for all types of PDFs and Images</em></>} toolTipLabel={"How it works"}/>
          <MenuTile to={match.url+'/data_validation'} icon={DataExtractionIcon} label="Data Validation" buttonLabel="Open Data Validation" className={classes.menucard}/>
        </Box>
      </Route>
    </RouterSwitch>
  );
}