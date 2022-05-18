import React from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import ListItemLink from './ListItemLink';
import FormatShapesIcon from '../assets/images/annotation.svg';
import StorageIcon from '../assets/images/create-model.svg';
import SettingsIcon from '../assets/images/admin.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    // marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    borderTopRightRadius: '5px',
    boxShadow: '0px 2px 1px -1px rgb(57 63 77 / 20%), 0px 1px 1px 0px rgb(57 63 77 / 14%), 0px 1px 3px 0px rgb(57 63 77 / 12%)',
  },
  main_selected: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    borderLeftWidth: '0.25rem',
    borderLeftStyle: 'solid',
    borderLeftColor: theme.palette.primary.main,
  },
  navlinks: {
    // marginLeft: theme.spacing(10),
    display: "flex",
  },
 logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    // fontSize: "20px",
    marginLeft: theme.spacing(20),
    "&:hover": {
      // color: "yellow",
      borderBottom: "1px solid white",
    },
  },
}));

const Navbar = ({baseurl}) => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="inherit" className={classes.root}>
      {/* <CssBaseline /> */}
      <Toolbar>
        {/* <Typography variant="h4" className={classes.logo}>Navbar</Typography> */}
          <div className={classes.navlinks} >
            <ListItemLink icon={StorageIcon} primary='Data Modelling' to={`${baseurl}/data_model`}/>
            <ListItemLink icon={FormatShapesIcon} primary='Automation' to={`${baseurl}/automation`}/>
          </div>
          <div className={classes.navlinks} style={{marginLeft: 'auto'}} >
            <ListItemLink icon={SettingsIcon} primary='Admin' to={`${baseurl}/admin`} />
          </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;