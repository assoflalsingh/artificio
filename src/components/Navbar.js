import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    
  },
  button: {
    marginRight: '2%',
  },
  title: {
    flexGrow: 1,
    textAlign: 'left'
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className="position-sticky fixed-top">
      <AppBar position="static">
        <Toolbar>
      
   <Typography variant="h6" className={classes.title}>
        ARTIFICIO
    </Typography>

    <Button color="inherit" className={classes.button}>Help</Button>
    <Button color="inherit" className={classes.button}>Register</Button>
         
       </Toolbar>
      </AppBar>
    </div>
  );
}
