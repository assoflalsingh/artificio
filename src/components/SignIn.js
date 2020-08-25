import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Auth from '@aws-amplify/auth';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  marginTop: {
    marginTop: theme.spacing(3),
  },
  marginTopSmall: {
    marginTop: theme.spacing(1.5),
  },
  divider: {
  marginTop: theme.spacing(3),
  borderTop: 'solid #bbb',
  borderRadius: '2px',
  
  
  }
}));
export default function SignIn() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    password: '',
    email:'',
    showPassword: false
  });


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try{
      const user = await Auth.signIn(values.email,values.password);
      console.log(user);

    }catch(error){
        console.log(error);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <Grid container>
            <Grid item xs>
            <Typography style={{color:'#2a9fd8'}} component="h1" variant="h5">
                  Welcome to Artificio
             </Typography>
             <Typography className={classes.marginTopSmall} style={{color:'grey'}} variant="subtitle2" gutterBottom>
              To keep connected with us please login with your personal information by email address and password
            </Typography>
            </Grid>
          </Grid>
        
          <form className={classes.form} noValidate>
       
          <FormControl className={classes.marginTop} fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">Email</InputLabel>
          <OutlinedInput
            id="outlined-adornment-email"
            value={values.amount}
            onChange={handleChange('email')}
            startAdornment={<InputAdornment position="start"><ExitToAppIcon/></InputAdornment>}
            labelWidth={60}
          />
        </FormControl>
          <FormControl className={classes.marginTop}  fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            startAdornment={<InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
      
        
           <Grid container>
            <Grid item xs>
             <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
            </Grid>
            <Grid className={classes.marginTopSmall} item>
              <Link href="#" variant="body2" >
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        <br/>
     
       
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}>
            Submit
          </Button>
          <br/>
          <div className={classes.marginTop}>
          <Link  href="#" variant="body2" >
                {"Don't have an account? Register"}
          </Link>
          </div>
          <div className={classes.marginTop}>
          <a href="#" className="fa fa-facebook"></a>
          <a href="#" className="fa fa-twitter"></a>
          <a href="#" className="fa fa-google"></a>
          </div>   
          <div>
          <Divider className={classes.divider} variant="middle" />
          </div>
          <Grid container className={classes.marginTop}>
            <Grid item xs>
            <Typography style={{color:'#2a9fd8'}} component="h2" variant="h5">
                  Intelligent Enterprise AI/ML platform
             </Typography>
             <Typography className={classes.marginTopSmall} style={{color:'grey'}} variant="subtitle2" gutterBottom>
               Artificio is an AI/ML platform for extracting the data intelligently and accurately from any type of document (PDF,JPG,tif,Fax,emails) using OCR AI/ML and Speech AI/ML techniques for various industries
            </Typography>
            </Grid>
          </Grid>
     
        </form>
      </div>
    </Container>
  );
}