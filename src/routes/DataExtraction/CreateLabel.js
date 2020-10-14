import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormInputColor, FormRow, FormRowItem, doValidation } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import {getEpochNow} from '../../others/utils';

export default function CreateLabel({onCancel, ...props}) {
  const account = 12345;
  const defaults = {
    name: '',
    desc: '',
    shape: '',
    data_type: '',
    color: '#FF6633',
  }
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const noneOpts = [
    {value: '', label: 'None'},
  ];
  const [assignShapeOpts, setAssignShapeOpts] = useState(noneOpts);
  const [dataTypeOpts, setDataTypeOpts] = useState(noneOpts);
  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    name: {
      validators: ['required'],
      messages: ['This field is required'],
    }
  }

  useEffect(()=>{
    const loadingOpts = [
      {value: '', label: 'Loading...'},
    ];
    setAssignShapeOpts(loadingOpts);
    setDataTypeOpts(loadingOpts);

    api.get(URL_MAP.GET_LABEL_PREQUISITE).then((resp)=>{
      let data = resp.data.data;
      setAssignShapeOpts([
        ...noneOpts,
        ...(data.shapes.map((shape)=>({value: shape, label: shape})))
      ]);
      setDataTypeOpts([
        ...noneOpts,
        ...(data.data_types.map((dt)=>({value: dt, label: dt})))
      ]);
    }).catch((err)=>{
      setAssignShapeOpts(noneOpts);
      setDataTypeOpts(noneOpts);
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

      let labelId = `label_${account}_${getEpochNow()}`;
      let data = {
        [labelId]: formData
      };

      api.post(URL_MAP.CREATE_LABEL, data).then((resp)=>{
        setFormSuccess('Label created sucessfully.');
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
    <Typography color="primary" variant="h6" gutterBottom>Create label</Typography>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Label Name" required name='name'
            value={formData.name} errorMsg={formDataErr.name} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Label Description" name='desc'
            value={formData.desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect label="Assign shape" name='shape' onChange={onTextChange}
            value={formData.shape} options={assignShapeOpts} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Data type" name='data_type' onChange={onTextChange}
            value={formData.data_type} options={dataTypeOpts} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputColor label="Assign color" name='color' value={formData.color}
            onChange={(value)=>{onTextChange(value, 'color')}} />
        </FormRowItem>
        <FormRowItem>
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