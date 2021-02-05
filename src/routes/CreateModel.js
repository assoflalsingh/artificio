import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import MenuTile from '../components/MenuTile';
import DataMangerIcon from '../assets/images/data-manager.svg';
import DataExtractionIcon from '../assets/images/data-extraction.svg';
import Classifier from '../assets/images/classifier.svg';
import {Switch as RouterSwitch, Route} from 'react-router-dom';
import DataManger from './DataManager';
import DataExtraction from './DataExtraction';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menucard: {
    marginLeft: '0.75rem',
  }
}));

export default function CreateModel({match}) {
  const classes = useStyles();
  const baseUrl = match.url;

  return (
    <RouterSwitch>
      <Route path={match.url+'/dataExtraction'} component={DataExtraction} />
      <Route>
        <Box className={classes.root}>
          <MenuTile to={match.url+'/dataExtraction'} icon={DataExtractionIcon} label="Data Extraction" buttonLabel="Open Data extraction" className={classes.menucard}/>
          <MenuTile to={match.url+'/dataManager'} icon={DataMangerIcon} label="Data Manager" buttonLabel="Create Data Set" baseUrl={baseUrl}/>
          <MenuTile to={match.url+'/classifier'} icon={Classifier} label="Classifier" buttonLabel="Create Model" className={classes.menucard} baseUrl={baseUrl}/>
        </Box>
      </Route>
    </RouterSwitch>
  );
}