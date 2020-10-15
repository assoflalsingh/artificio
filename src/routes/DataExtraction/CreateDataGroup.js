import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';

export default function CreateDataGroup({onCancel, ...props}) {
  const defaults = {
    dg_name: '',
    dg_desc: '',
    assign_user: '',
    pre_trained_model: '',
    assign_label: [],
  }
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [opLoading, setOpLoading] = useState(false);
  const [userOpts, setUserOpts] = useState([]);
  const [ptmOpts, setPtmOpts] = useState([]);
  const [labelOpts, setLabelOpts] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    dg_name: {
      validators: ['required'],
      messages: ['This field is required'],
    }
  }

  useEffect(()=>{
    setOpLoading(true);

    api.get(URL_MAP.CREATE_DG_PREQUISITE).then((resp)=>{
      setUserOpts([]);
      setPtmOpts([]);
      setLabelOpts([]);
    }).catch((err)=>{
      setLabelOpts(['label1', 'label2', 'label3', 'label4']);
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
    /* Validate */
    Object.keys(formValidators).forEach(name => {
      if(Boolean(validateField(name, formData[name]))) {
        isFormValid = false;
      }
    });

    if(isFormValid) {
      setSaving(true);
      api.post(URL_MAP.CREATE_DATA_GROUP, formData).then((resp)=>{
        setFormSuccess('Data group created sucessfully.');
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
    <Typography color="primary" variant="h6" gutterBottom>Create data group</Typography>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Data group Name" required name='dg_name'
            value={formData.dg_name} errorMsg={formDataErr.dg_name} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Description" name='dg_desc'
            value={formData.dg_desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect label="Assign user" name='assign_user' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.assign_user} options={userOpts} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Pre-trained model" name='pre_trained_model' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.pre_trained_model} options={ptmOpts} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect multiple label="Assign label" name='assign_label' onChange={(e, value)=>{onTextChange(value, 'assign_label')}}
            loading={opLoading} value={formData.assign_label} options={labelOpts} />
        </FormRowItem>
        <FormRowItem></FormRowItem>
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