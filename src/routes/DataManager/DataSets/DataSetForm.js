import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';

export default function LabelForm({initFormData, ...props}) {
  const defaults = {    
    data_set_id: '',
    desc: '',
    app_usage: [],
    data_type: '',
  }
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const CURRENT_APP_ID = "10";
  const [opLoading, setOpLoading] = useState(false);

  const [appUsageOpts, setAppUsageOpts] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    data_set_id: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Text allowed with max length of 200.'],
    },
    desc: {
      validators: ['required', {type:'regex', param:'^[a-zA-Z0-9-@!%#$&()_ ]{1,200}$'}],
      messages: ['This field is required', 'Only alpha-numeric allowed with max length of 20.'],
    },
    app_usage: {
      validators: ['required'],
      messages: ['This field is required'],
    }
  }

  useEffect(()=>{
    setOpLoading(true);
    api.get(URL_MAP.GET_APP_USAGE).then((resp)=>{
      let data = resp.data.data;
      setAppUsageOpts(data);
      if(editMode) {
        let formAppUsage = data.filter((label)=>{
          return Object.keys(initFormData.app_usage).indexOf(label._id) > -1;
        });
        setFormData({
          ...initFormData,
          app_usage: formAppUsage,
        });
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
      let dataSetPayload = {
        "data_set_id":formData.data_set_id,
        "desc": formData.desc ,
        "app_usage": formData.app_usage.map((label)=>label._id),
        "app_id": CURRENT_APP_ID,
        "update":editMode || false,
        "_id": editMode ? formData._id : null
      };
      api.post(URL_MAP.CREATE_DATA_SETS, dataSetPayload).then((resp)=>{
        setFormSuccess('Dataset created sucessfully.');
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
    <Box display="flex">
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} label</Typography>
      {opLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
    </Box>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Data set ID" required name='data_set_id' placeholder="Data set ID here.."
            value={formData.data_set_id} errorMsg={formDataErr.data_set_id} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Description" required name='desc' placeholder="Description here.."
            value={formData.desc} errorMsg={formDataErr.desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect multiple label="App Usage" hasSearch required name='app_usage' onChange={(e, value)=>{onTextChange(value, 'app_usage')}}
            labelKey='app_usage' valueKey='_id' firstEmpty={true} loading={opLoading} errorMsg={formDataErr.app_usage} 
            value={formData.app_usage} options={appUsageOpts} 
          />
        </FormRowItem>
        <FormRowItem style={{visibility:"hidden"}}>
          <FormInputSelect label="Import Data" name='data_type' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.data_type} options={appUsageOpts} />
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