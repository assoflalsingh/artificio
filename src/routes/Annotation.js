import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import MenuTile from '../components/MenuTile';
import DataExtractionIcon from '../assets/images/data-extraction.svg';
import DataExtraction from './DataExtraction';
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

export default function Annotation({match}) {
  const classes = useStyles();

  return (
    <RouterSwitch>
      <Route path={match.url+'/dataExtraction'} component={DataExtraction} />
      <Route>
        <Box className={classes.self}>
          <MenuTile to={match.url+'/dataExtraction'} icon={DataExtractionIcon} label="Data Extraction" buttonLabel="Open Data" className={classes.menucard}/>
        </Box>
      </Route>
    </RouterSwitch>
  );
}