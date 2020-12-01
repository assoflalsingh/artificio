import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormInputColor, FormRow, FormRowItem, doValidation, FormHeader, FormInputPhoneNo } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import {getEpochNow, titleCase} from '../../others/utils';
import { connect } from 'react-redux';
import { setUser } from '../../store/reducers/user';

function Basic({user, setUser, api}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role_name: '',
    org: '',
    phone_number: ''
  });
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const formValidators = {
    first_name: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    last_name: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    org: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    phone_number: {
      validators: [{type:'regex', param:'^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$'}],
      messages: ['Invalid phone number'],
    },
  }

  useEffect(()=>{
    if(user.user_set) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_name: user.role_name,
        org: user.org,
        phone_number: user.phone_number
      });
    }
  }, [user.user_set])

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
      value = e.target.value;
    }
    setFormData((prevData)=>({
      ...prevData,
      [name]: value
    }));

    setFormError('');
    setFormSuccess('');

    validateField(name, value);
  }

  const onSave = () =>{
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

      api.post(URL_MAP.UPDATE_USER, formData).then((resp)=>{
        setFormSuccess('User details updated sucessfully.');
        setUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role_name: formData.role_name,
          org: formData.org,
          phone_number: formData.phone_number
        });
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
          setFormError('Not able to send the request' + '. Contact administrator.');
        } else {
          setFormError('Some error occurred' + '. Contact administrator.');
        }
      }).then(()=>{
        setSaving(false);
      });
    }
  }

  return (
    <>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="First name" required name='first_name'
            value={formData.first_name} errorMsg={formDataErr.first_name} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Last name" required name='last_name'
            value={formData.last_name} errorMsg={formDataErr.last_name} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Email" name='email'
            value={formData.email} errorMsg={formDataErr.email} readOnly/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Role" name='role_name'
            value={formData.role_name} errorMsg={formDataErr.role_name} readOnly/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Organisation" required name='org'
            value={formData.org} errorMsg={formDataErr.org} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputPhoneNo name="phone_number" value={formData.phone_number} label="Phone no" required
            defaultCountry={'us'} onChange={(value)=>{onTextChange(value, 'phone_number')}} errorMsg={formDataErr.phone_number} />
        </FormRowItem>
      </FormRow>
      {(formError || formSuccess) &&
      <FormRow>
        <FormRowItem>
          {formError && <Alert severity="error">{formError}</Alert>}
          {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
        </FormRowItem>
      </FormRow>}
      <FormRow>
        <FormRowItem>
          <Button color="secondary" variant="contained" onClick={onSave} disabled={saving || !user.user_set}>{saving ? 'Saving...' : 'Save'}</Button>
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}

function Auth({api}) {
  const defaults = {
    current_pass: '',
    password: '',
    confirm_pass: '',
  }
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const formValidators = {
    current_pass: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    password: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    confirm_pass: {
      validators: ['required', function(value) { return formData.password == value}],
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
      value = e.target.value;
    }
    setFormData((prevData)=>({
      ...prevData,
      [name]: value
    }));

    validateField(name, value);
  }

  const onSave = () =>{
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

      api.post(URL_MAP.UPDATE_PASSWORD, formData).then((resp)=>{
        setFormSuccess('Password changed sucessfully.');
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
          setFormError('Not able to send the request' + '. Contact administrator.');
        } else {
          setFormError('Some error occurred' + '. Contact administrator.');
        }
      }).then(()=>{
        setSaving(false);
      });
    }
  }

  return (
    <>
    <Form>
      <FormRow>
        <FormRowItem>
        <FormInputText label="Current password" required name='current_pass' type='password'
            value={formData.current_pass} errorMsg={formDataErr.current_pass} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Password" required name='password' type='password'
            value={formData.password} errorMsg={formDataErr.password} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Confirm password" required name='confirm_pass' type='password'
            value={formData.confirm_pass} errorMsg={formDataErr.confirm_pass} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      {(formError || formSuccess) &&
      <FormRow>
        <FormRowItem>
          {formError && <Alert severity="error">{formError}</Alert>}
          {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
        </FormRowItem>
      </FormRow>}
      <FormRow>
        <FormRowItem>
          <Button color="secondary" variant="contained" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}

function Account({user, setUser}) {
  const api = getInstance(localStorage.getItem('token'));
  return (
    <>
      <FormHeader title="Basic details" loadingText={user.user_set ? null : 'Loading user details...'}/>
      <Basic user={user} setUser={setUser} api={api}/>
      <FormHeader title="Change password" hasTopDivider />
      <Auth api={api}/>
    </>
  )
}

export default connect((state)=>({user: state.user}), (dispatch)=>({
  setUser: (user)=>dispatch(setUser(user)),
}))(Account);