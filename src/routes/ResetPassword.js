import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Container, Grid, Link, Paper, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {getInstance, URL_MAP, APP_WEBSITE} from '../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import { doValidation, FormHeader, FormInputText, PasswordPolicy } from '../components/FormElements';
import Logo from '../assets/images/logo.svg';
import {getQueryParam} from '../others/utils';

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


export default function ResetPassword({location, history}) {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);
  const defaults = {
    password: '',
    confirm_pass: '',
    id: '',
  }
  const [formData, setFormData] = useState({
    ...defaults,
  });
  const [formDataErr, setFormDataErr] = useState({
    password: '',
    confirm_pass: '',
  })
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const onSigninClick = (e)=>{
    e.preventDefault();
    history.push('/signin');
  }

  const formValidators = {
    password: {
      validators: ['required', 'password'],
      messages: ['This field is required', 'Does not meet password policy'],
    },
    confirm_pass: {
      validators: ['required', function(value) { return formData.password === value}],
      messages: ['This field is required', 'Does not match with the password'],
    },
  }

  useEffect(()=>{
    let id = getQueryParam(location, '/resetpassword', 'id');
    setFormData({
      id: id,
    });
  }, []);

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

  const onSubmitClick = (e)=>{
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
      setSubmitting(true);
      api.post(URL_MAP.RESET_PASSWORD, formData).then((resp)=>{
        setFormSuccess('Password reset successfully');
        setFormData(defaults);
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
        setSubmitting(false);
      });
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
        <Grid container style={{marginTop: '2rem'}}>
          <Grid item xs={0} sm={0} md={3}></Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormHeader title="Reset password" />
            <Box className={classes.formRow}>
              <FormInputText name="password" value={formData.password} label="Password" info={<PasswordPolicy />}
                InputIcon={LockOutlinedIcon} type='password' onChange={onTextChange} errorMsg={formDataErr.password} required />
            </Box>
            <Box className={classes.formRow}>
              <FormInputText name="confirm_pass" value={formData.confirm_pass} label="Confirm password"
                InputIcon={LockOutlinedIcon} type='password' onChange={onTextChange} errorMsg={formDataErr.confirm_pass} required />
            </Box>
            <Box className={classes.formRow}>
              <Button onClick={onSubmitClick} variant="contained" color="primary" disabled={submitting}>{submitting ? 'Please wait...' : 'Reset password'}</Button>
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
              <Typography>
                If you have an active account, you will get an email with password reset instructions. Please check your spam as well in case you do not receive the email in next 2-5 mins.
              </Typography>
            </Box>
            <Box className={classes.formRow}>
              <Typography style={{margin: 'auto'}}>Go to <Link href="#" onClick={onSigninClick}>Sign in</Link></Typography>
            </Box>
          </Grid>
          <Grid item xs={0} sm={0} md={3}></Grid>
        </Grid>
      </Container>
    </Box>
  );
}