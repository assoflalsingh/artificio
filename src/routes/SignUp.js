import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Card, CardContent, CardHeader, Container, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, IconButton, Input, InputAdornment, Link, Checkbox, Paper, TextField, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import BusinessIcon from '@material-ui/icons/Business';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import SignUpImg from '../assets/images/office-workspace.png';
import {getInstance, URL_MAP} from '../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import { FormInputPhoneNo, FormInputText } from '../components/FormElements';

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
    height: 'auto'
  }
}));


export default function SignUp({match, history}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
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
  const [fields, setFileds] = useState({
    ...defaults,
  });
  const [errors, setErrors] = useState({
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
  const reqFields = ['first_name', 'last_name', 'email', 'password', 'confirm_pass'];


  const onLoginClick = (e)=>{
    e.preventDefault();
    history.push('/login');
  }

  const validateForm = ()=>{
    let reqArgs = ['first_name', 'last_name', 'email', 'password', 'confirm_pass'];
    let allValid = true;
    reqArgs.forEach((fieldName)=>{
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
    setFileds((prevFields)=>({
      ...prevFields,
      [name]: value
    }));
  }

  const onChange = (e)=>{
    let name = e.target.name,
      value = null;

    if(name == 'accept') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    let err = '';
    if((value === '' || value === null) && reqFields.indexOf(name) > -1) {
      err = 'This field is required.';
    } else if(name == 'confirm_pass' && value != fields['password']) {
      err = 'This is not same as password';
    }

    setErrors((prevErrors)=>({
      ...prevErrors,
      [name]: err
    }));

    fieldChanged(name, value);
  }

  const onRegisterClick = (e)=>{
    setFormError('');
    setFormSuccess('');
    if(validateForm()) {
      setSaving(true);
      api.post(URL_MAP.SIGN_UP, {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        org: fields.org,
        phone_no: fields.phone_no,
        password: fields.password,
      }).then((resp)=>{
        console.log(resp);
        setFormSuccess('User registered sucessfully.');
        setFileds(defaults);
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
        setSaving(false);
      });
    }
  }

  return (
    <>
    <Box display="flex">
      <IconButton className={classes.home}><HomeIcon /></IconButton>
    </Box>
    <Container maxWidth='lg'>
      <Grid container>
        <Grid item lg={8} md={6} sm={12} xs={12}>
          <img src={SignUpImg} className={classes.img} />
        </Grid>
        <Grid item item lg={4} md={6} sm={12} xs={12}>
          <Paper className={classes.formRoot}>
            <Typography variant="h6">Sign up</Typography>
            <form className={classes.root} noValidate autoComplete="off">
              <Grid container spacing={2} className={classes.formRow}>
                <Grid item md={6} xs={12}>
                  <FormInputText name="first_name" value={fields.first_name} label="First name"
                    InputIcon={PersonOutlineIcon} onChange={onChange} errorMsg={errors.first_name} required/>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormInputText name="last_name" value={fields.last_name} label="Last name"
                    InputIcon={PersonOutlineIcon} onChange={onChange} errorMsg={errors.last_name} required/>
                </Grid>
              </Grid>
              <Box className={classes.formRow}>
                <FormInputText name="email" value={fields.email} label="Email id"
                  InputIcon={MailOutlineIcon} onChange={onChange} errorMsg={errors.email} required/>
              </Box>
              <Box className={classes.formRow}>
                <FormInputText name="org" value={fields.org} label="Organisation"
                  InputIcon={BusinessIcon} onChange={onChange} errorMsg={errors.org} />
              </Box>
              <Box className={classes.formRow}>
                <FormInputPhoneNo name="phone_no" value={fields.phone_no} label="Phone no"
                  defaultCountry={'us'} onChange={(value)=>{console.log(value); fieldChanged('phone_no', value)}} errorMsg={errors.phone_no} />
              </Box>
              <Box className={classes.formRow}>
                <FormInputText name="password" value={fields.password} label="Password"
                  InputIcon={LockOutlinedIcon} type='password' onChange={onChange} errorMsg={errors.password} required />
              </Box>
              <Box className={classes.formRow}>
                <FormInputText name="confirm_pass" value={fields.confirm_pass} label="Confirm password"
                  InputIcon={LockOutlinedIcon} type='password' onChange={onChange} errorMsg={errors.confirm_pass} required />
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
                  control={<Checkbox name="accept" color='primary' checked={fields.accept} onChange={onChange} />}
                  label={'I accept Terms and Conditions'}
                />
              </Box>
              <Box className={classes.formRow}>
                <Button onClick={onRegisterClick} variant="contained" color="primary" fullWidth disabled={!fields.accept || saving}>{saving ? 'Registering...' : 'Register'}</Button>
              </Box>
              <Box display="flex" className={classes.formRow}>
                <Typography style={{margin: 'auto'}}>Already have an account ? <Link href="#" onClick={onLoginClick}>Log in</Link></Typography>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}