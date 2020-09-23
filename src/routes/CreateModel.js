import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import MenuTile from '../components/MenuTile';
import DataMangerIcon from '../assets/images/data-manager.svg';
import Classifier from '../assets/images/Classifier.svg';
import {Switch as RouterSwitch, Route} from 'react-router-dom';
import DataManger from './DataManager';

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
  const [open, setOpen] = React.useState(true);
  const baseUrl = match.url;

  return (
    <RouterSwitch>
      <Route path={match.url+'/dataManager'} component={DataManger} />
      <Route>
        <Box className={classes.root}>
          <MenuTile to={match.url+'/dataManager'} icon={DataMangerIcon} label="Data Manager" buttonLabel="Create Data Set" baseUrl={baseUrl}/>
          <MenuTile to={match.url+'/classifier'} icon={Classifier} label="Classifier" buttonLabel="Create Model" className={classes.menucard} baseUrl={baseUrl}/>
        </Box>
      </Route>
    </RouterSwitch>
  );
}