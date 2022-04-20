import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation, FormInputColor } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';

export default function LabelForm({initFormData, ...props}) {
  const defaults = {
    name: '',
    desc: '',
    shape: '',
    data_type: '',
    color: '#FF6633',
  }
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [opLoading, setOpLoading] = useState(false);
  const [assignShapeOpts, setAssignShapeOpts] = useState([]);
  const [dataTypeOpts, setDataTypeOpts] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    name: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    }
  }

  useEffect(()=>{
    setOpLoading(true);

    api.get(URL_MAP.GET_LABEL_PREQUISITE).then((resp)=>{
      let data = resp.data.data;
      setAssignShapeOpts(data.shapes);
      setDataTypeOpts(data.data_types);

      if(editMode) {
        setFormData(initFormData);
      }
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
        setFormError('Failed to fetch pre-requisites. Not able to send the request. Contact administrator.');
      } else {
        setFormError('Failed to fetch pre-requisites. Some error occurred. Contact administrator.');
      }
    }).then(()=>{
      setOpLoading(false);
    });
  }, [api, editMode, initFormData]);

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

      let url = editMode ? URL_MAP.UPDATE_LABEL : URL_MAP.CREATE_LABEL;
      api.post(url, formData).then((resp)=>{
        setFormSuccess('Label created sucessfully.');
        if(!editMode) setFormData(defaults);
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
          setFormError('Not able to send the request. Contact administrator.');
        } else {
          setFormError('Some error occurred. Contact administrator.');
        }
      }).then(()=>{
        setSaving(false);
      });
    }
  }

  return (
    <>
    <Box display="flex">
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} label</Typography>
      {opLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
    </Box>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Label ID" required name='name'
            value={formData.name} errorMsg={formDataErr.name} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Label Description" name='desc'
            value={formData.desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect label="Assign shape" name='shape' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.shape} options={assignShapeOpts} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Data type" name='data_type' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.data_type} options={dataTypeOpts} />
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
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}