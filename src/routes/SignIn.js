import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Card, CardContent, CardHeader, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, IconButton, Input, InputAdornment, Link, Checkbox, Paper, TextField, Typography, Divider } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BusinessIcon from '@material-ui/icons/Business';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Logo from '../assets/images/logo.svg';
import {getInstance, URL_MAP, APP_WEBSITE} from '../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import { FormInputPhoneNo, FormInputText } from '../components/FormElements';
import SigninImg from '../assets/images/signin.png';

const api = getInstance();

const useStyles = makeStyles((theme) => ({
  home: {
    marginLeft: 'auto',
    padding: '1rem'
  },
  formRoot: {
    padding: '2rem 1rem'
  },
  formRow: {
    paddingTop: '1rem',
  },
  formLabel: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary
  },
  FormInputText: {
    marginTop: '0.5rem'
  },
  img: {
    maxWidth: '100%',
    padding: '0.5rem'
  },
  root: {
    marginTop: '1rem'
  },
  page: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.common.white
  }
}));


export default function SignIn({history, location}) {
  const classes = useStyles();
  const defaults = {
    username: '',
    password: '',
    remember: false,
  };
  const [fields, setFields] = useState({
    ...defaults,
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [authorizing, setAuthorizing] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const reqFields = ['username', 'password'];

  const validateForm = ()=>{
    let allValid = true;
    reqFields.forEach((fieldName)=>{
      let value = fields[fieldName];
      let err = '';
      if(value === '' || value === null) {
        err = 'This field is required.';
        allValid = false;
      } else {
        err = '';
      }
      setErrors((prevErrors)=>({
        ...prevErrors,
        [fieldName]: err
      }));
    });
    return allValid;
  }

  const fieldChanged = (name, value) => {
    setFields((prevFields)=>({
      ...prevFields,
      [name]: value
    }));
  }

  const onChange = (e)=>{
    let name = e.target.name,
      value = null;

    if(name == 'remember') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    let err = '';
    if((value === '' || value === null) && reqFields.indexOf(name) > -1) {
      err = 'This field is required.';
    }

    setErrors((prevErrors)=>({
      ...prevErrors,
      [name]: err
    }));

    fieldChanged(name, value);
  }

  const goToURL = (e, url)=>{
    e.preventDefault();
    history.push(url);
  }

  const onSubmitClick = (e)=>{
    setFormError('');
    setFormSuccess('');
    if(validateForm()) {
      setAuthorizing(true);
      api.post(URL_MAP.SIGN_IN, {
        'email': fields.username,
        'password': fields.password,
      }).then((resp)=>{
        localStorage.setItem('token', resp.data.data);
        if(location.state && location.state.from === 'signin') {
          history.push(location.state.from);
        } else {
          history.push('/dashboard/createModel');
        }
      }).catch((err)=>{
        if (err.response) {
          // client received an error response (5xx, 4xx)
          if(err.response.data.message) {
            setFormError(err.response.data.message);
          } else {
            setFormError(err.response.statusText + '. Contact administrator.');
          }
        } else if (err.request) {
          // client never received a response, or request never left
        } else {
          // anything else
        }
      }).then(()=>{
        setAuthorizing(false);
      });
    }
  }

  return (
    <Box className={classes.page}>
      <Paper display="flex" square>
        <Container maxWidth='lg'>
          <Link href={APP_WEBSITE}>
            <img style={{marginTop: '0.5rem', height: '2.5rem'}} src={Logo} className={classes.logoImg}></img>
          </Link>
        </Container>
      </Paper>
      <Container maxWidth='lg' style={{flexGrow: 1, display:'flex', alignItems: 'stretch'}}>
        <Grid container>
          <Grid item lg={7} md={6} sm={12} xs={12} style={{display:'flex'}}>
            <img src={SigninImg} className={classes.img} style={{alignSelf: 'center'}}/>
          </Grid>
          <Grid item item lg={5} md={6} sm={12} xs={12} style={{display: 'flex'}}>
            <Paper className={classes.formRoot} style={{margin: 'auto'}} elevation={3}>
              <Typography variant="h4" color="primary">Welcome to <strong>Artificio</strong></Typography>
              <Typography variant="h7">To keep connected with us, please log in</Typography>
              <form className={classes.root} noValidate autoComplete="off">
                <Box className={classes.formRow}>
                  <FormInputText name="username" value={fields.username} label="Email/Username"
                    InputIcon={MailOutlineIcon} onChange={onChange} errorMsg={errors.username} required/>
                </Box>
                <Box className={classes.formRow}>
                  <FormInputText name="password" value={fields.password} label="Password"
                    InputIcon={LockOutlinedIcon} type='password' onChange={onChange} errorMsg={errors.password} required />
                </Box>
                <Grid container spacing={2} className={classes.formRow}>
                  <Grid item md={6} xs={12}>
                    <FormControlLabel
                      control={<Checkbox name="remember" color='primary' checked={fields.remember} onChange={onChange} />}
                      label={'Remember me'}
                    />
                  </Grid>
                  <Grid item md={6} xs={12} style={{display: 'flex'}}>
                    <Link style={{margin: 'auto', marginRight: 0}} href="#" onClick={(e)=>goToURL(e, '/forgotpassword')}>Forgot password ?</Link>
                  </Grid>
                </Grid>
                {formSuccess &&
                <Box className={classes.formRow}>
                  <Alert severity="success">{formSuccess}</Alert>
                </Box>}
                {formError &&
                <Box className={classes.formRow}>
                  <Alert severity="error">{formError}</Alert>
                </Box>}
                <Box className={classes.formRow}>
                  <Button onClick={onSubmitClick} variant="contained" color="primary" disabled={authorizing}>{authorizing ? 'Authorizing...' : 'Login'}</Button>
                </Box>
                <Box className={classes.formRow}>
                  <Typography><Link href="#" onClick={(e)=>goToURL(e, '/signup')}>Register</Link> if you don't have an account ?</Typography>
                </Box>
              </form>
              <Divider variant="middle" style={{marginTop: '1rem'}}/>
              <Box style={{marginTop: '1rem'}}>
                <Typography color="primary" variant="h6">
                  Intelligent Enterprise AI/ML platform
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  <strong>Artificio</strong> is an AI/ML platform for extracting the data intelligently and accurately from any type of
                    document (PDF, JPG, tif, Fax, emails) using OCR AI/ML and Speech AI/ML techniques for various industries
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}