import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Container, FormControlLabel, Grid, Link, Checkbox, Paper, Typography } from '@material-ui/core';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BusinessIcon from '@material-ui/icons/Business';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import SignUpImg from '../assets/images/signup.png';
import {getInstance, URL_MAP, APP_WEBSITE} from '../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import { doValidation, FormInputPhoneNo, FormInputText, PasswordPolicy } from '../components/FormElements';
import Logo from '../assets/images/logo.svg';
import APP_CONFIGS from '../app-config.js';

const api = getInstance();

const useStyles = makeStyles((theme) => ({
  home: {
    marginLeft: 'auto',
    padding: '1rem'
  },
  formRoot: {
    padding: '1rem'
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
  page: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.common.white
  }
}));


export default function SignUp({match, history}) {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);
  const defaults = {
    first_name: '',
    last_name: '',
    email: '',
    org: '',
    phone_no: '',
    password: '',
    confirm_pass: '',
    accept: false,
  }
  const [formData, setFormData] = useState({
    ...defaults,
  });
  const [formDataErr, setFormDataErr] = useState({
    first_name: '',
    last_name: '',
    email: '',
    org: '',
    phone_no: '',
    password: '',
    confirm_pass: '',
  })
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  // const reqFields = ['first_name', 'last_name', 'email', 'password', 'confirm_pass'];

  useEffect(() => {
    // Initialize Recaptcha here..
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);
      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }
   
      if (isScriptExist && callback) callback();
    }
    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", URL_MAP.RECAPTCHA_API , function () {
      console.log("Captcha Script loaded!");
    });
  }, [])

  const onSigninClick = (e)=>{
    e.preventDefault();
    history.push('/signin');
  }

  const formValidators = {
    first_name: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    last_name: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    email: {
      validators: ['required', 'email'],
      messages: ['This field is required', 'Invalid email id'],
    },
    password: {
      validators: ['required', 'password'],
      messages: ['This field is required', 'Does not meet password policy'],
    },
    confirm_pass: {
      validators: ['required', function(value) { return formData.password === value}],
      messages: ['This field is required', 'Does not match with the password'],
    },
  }

  const validateField = (name, value) => {
    let errMsg = '';
    let fieldValidators = formValidators[name];
    if(fieldValidators) {
      errMsg = doValidation(value, fieldValidators.validators, fieldValidators.messages);
      setFormDataErr((prevErr)=>({
        ...prevErr,
        [name]: errMsg,
      }));
    }
    return errMsg;
  }

  const onTextChange = (e, name) => {
    let value = e;
    if(e.target) {
      name = e.target.name;
      if(name === 'accept') {
        value = e.target.checked;
      } else {
        value = e.target.value;
      }
    }
    setFormData((prevData)=>({
      ...prevData,
      [name]: value
    }));

    validateField(name, value);
  }

  const onRegisterClick = (e)=>{
    let isFormValid = true;
    setFormError('');
    setFormSuccess('');

    /* Validate */
    Object.keys(formValidators).forEach(name => {
      if(Boolean(validateField(name, formData[name]))) {
        isFormValid = false;
      }
    });

    if(isFormValid) {
      setSaving(true);
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(APP_CONFIGS.CAPTCHA_SITE_KEY, { action: 'submit' }).then(token => {
          api.post(URL_MAP.SIGN_UP, {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email.toLowerCase(),
            org: formData.org,
            phone_no: formData.phone_no,
            password: formData.password,
            recaptcha_code: token
          }).then((resp)=>{
            setFormSuccess('User registered sucessfully. Please check your email to activate your account.');
            setFormData(defaults);
          }).catch((err)=>{
            if (err.response) {
              // client received an error response (5xx, 4xx)
              if(err.response.data.message || err.response.data.message) {
                setFormError(err.response.data.message?.msg || err.response.data.message);
              } else {
                setFormError(err.response.statusText + '. Contact administrator.');
              }
            } else if (err.request) {
              // client never received a response, or request never left
            } else {
              // anything else
            }
          }).then(()=>{
            setSaving(false);
          });
        })
      })
    }
  }

  return (
    <Box className={classes.page}>
      <Paper display="flex" square>
        <Container maxWidth='lg'>
          <Link href={APP_WEBSITE}>
            <img style={{marginTop: '0.5rem', height: '2.5rem'}} alt="" src={Logo} className={classes.logoImg}></img>
          </Link>
        </Container>
      </Paper>
      <Container maxWidth='lg' style={{flexGrow: 1, display:'flex', alignItems: 'stretch'}}>
        <Grid container>
          <Grid item lg={7} md={6} sm={12} xs={12} style={{display:'flex'}}>
            <img src={SignUpImg} className={classes.img} alt="" style={{alignSelf: 'center'}}/>
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12} style={{display: 'flex'}}>
            <Paper className={classes.formRoot} style={{margin: 'auto'}} elevation={3}>
              <Typography variant="h6">Sign up</Typography>
              <form className={classes.root} noValidate autoComplete="off">
                <Grid container spacing={2} className={classes.formRow}>
                  <Grid item md={6} xs={12}>
                    <FormInputText name="first_name" value={formData.first_name} label="First name"
                      InputIcon={PersonOutlineIcon} onChange={onTextChange} errorMsg={formDataErr.first_name} required/>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormInputText name="last_name" value={formData.last_name} label="Last name"
                      InputIcon={PersonOutlineIcon} onChange={onTextChange} errorMsg={formDataErr.last_name} required/>
                  </Grid>
                </Grid>
                <Box className={classes.formRow}>
                  <FormInputText name="email" value={formData.email} label="Email id"
                    InputIcon={MailOutlineIcon} onChange={onTextChange} errorMsg={formDataErr.email} required/>
                </Box>
                <Box className={classes.formRow}>
                  <FormInputText name="org" value={formData.org} label="Organisation"
                    InputIcon={BusinessIcon} onChange={onTextChange} errorMsg={formDataErr.org} />
                </Box>
                <Box className={classes.formRow}>
                  <FormInputPhoneNo name="phone_no" value={formData.phone_no} label="Phone no"
                    defaultCountry={'us'} onChange={(value)=>{onTextChange(value, 'phone_no')}} errorMsg={formDataErr.phone_no} />
                </Box>
                <Box className={classes.formRow}>
                  <FormInputText name="password" value={formData.password} label="Password" info={<PasswordPolicy />}
                    InputIcon={LockOutlinedIcon} type='password' onChange={onTextChange} errorMsg={formDataErr.password} required />
                </Box>
                <Box className={classes.formRow}>
                  <FormInputText name="confirm_pass" value={formData.confirm_pass} label="Confirm password"
                    InputIcon={LockOutlinedIcon} type='password' onChange={onTextChange} errorMsg={formDataErr.confirm_pass} required />
                </Box>
                {formSuccess &&
                <Box className={classes.formRow}>
                  <Alert severity="success">{formSuccess}</Alert>
                </Box>}
                {formError &&
                <Box className={classes.formRow}>
                  <Alert severity="error">{formError}</Alert>
                </Box>}
                <Box className={classes.formRow}>
                  <FormControlLabel
                    control={<Checkbox name="accept" color='primary' checked={formData.accept} onChange={onTextChange} />}
                    label={
                      <Typography>
                      I accept <Link href="https://artificio.ai/web/terms-services" target="_blank" rel="noopener">Terms of Services</Link> and <Link href=" https://artificio.ai/web/privacy-policy" target="_blank" rel="noopener">Privacy Policy</Link>
                      </Typography>}
                  />
                </Box>
                <Box className={classes.formRow}>
                  <Button onClick={onRegisterClick} variant="contained" color="primary" fullWidth disabled={!formData.accept || saving}>{saving ? 'Registering...' : 'Register'}</Button>
                </Box>
                <Box display="flex" className={classes.formRow}>
                  <Typography style={{margin: 'auto'}}>Already have an account ? <Link href="#" onClick={onSigninClick}>Sign in</Link></Typography>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
