import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import MenuTile from '../components/MenuTile';
import DataExtractionIcon from '../assets/images/data-extraction.svg';
// import TextDataIcon from '../assets/images/text-data.svg';
// import ImageDataIcon from '../assets/images/image-data.svg';
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
          <MenuTile to={match.url+'/dataExtraction'} icon={DataExtractionIcon} label="Data Extraction" buttonLabel="Open Data extraction" className={classes.menucard} toolTipDesc={<><em>Start Annotation and extract text for all types of PDFs and Images</em></>} toolTipLabel={"How it works"}/>
          {/* <MenuTile to={match.url+'/textData'} icon={TextDataIcon} label="Text data" buttonLabel="Open text data" className={classes.menucard}/>
          <MenuTile to={match.url+'/imageData'} icon={ImageDataIcon} label="Image data" buttonLabel="Open image data" className={classes.menucard}/> */}
        </Box>
      </Route>
    </RouterSwitch>
  );
}