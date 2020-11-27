import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormInputColor, FormRow, FormRowItem, doValidation } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import {getEpochNow, titleCase} from '../../others/utils';

export default function CreateUser({onCancel, ...props}) {
  const defaults = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_pass: '',
    role_id: null
  }
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [opLoading, setOpLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

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
    role_id: {
      validators: ['required'],
      messages: ['This field is required'],
    },
  }

  useEffect(()=>{
    setOpLoading(true);

    api.get(URL_MAP.USER_PREQUISITE).then((resp)=>{
      let data = resp.data.data;

      let roles = data.roles;
      roles.forEach((role)=>{
        role.role_name = titleCase(role.role_name.replace('_', ' '));
      });
      setRoles(data.roles);
    }).catch((err)=>{
      setOpLoading(false);
      if (err.response) {
        // client received an error response (5xx, 4xx)
        if(err.response.data.message) {
          setFormError(err.response.data.message);
        } else {
          setFormError(err.response.statusText + '. Contact administrator.');
        }
      } else if (err.request) {
        // client never received a response, or request never left
        setFormError('Failed to fetch pre-requisites. Not able to send the request' + '. Contact administrator.');
      } else {
        setFormError('Failed to fetch pre-requisites. Some error occurred' + '. Contact administrator.');
      }
    }).then(()=>{
      setOpLoading(false);
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

      api.post(URL_MAP.ADD_USER, formData).then((resp)=>{
        setFormSuccess('User added sucessfully.');
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
    <Typography color="primary" variant="h6" gutterBottom>Add user</Typography>
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
          <FormInputText label="Email" required name='email'
            value={formData.email} errorMsg={formDataErr.email} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Role" required name='role_id' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.role_id} errorMsg={formDataErr.role_id}
            options={roles} labelKey='role_name' valueKey='role_id' />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Password" required name='password'
            value={formData.password} errorMsg={formDataErr.password} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Confirm password" required name='confirm_pass'
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
          <Button style={{marginLeft: '1rem'}} variant="outlined" onClick={onCancel}>Cancel</Button>
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}