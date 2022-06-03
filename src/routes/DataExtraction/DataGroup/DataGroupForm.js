import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation, FormInputCheck } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';

const dataAnalyticsOptions = [{label: "", name: 'data_analytics', value: true}];
const defaults = {
  name: '',
  desc: '',
  assign_user: '',
  ptm: '',
  assign_label: [],
  data_struct: '',
  data_analytics: '',
}

export default function DataGroupForm({initFormData, ...props}) {
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [opLoading, setOpLoading] = useState(false);
  const [userOpts, setUserOpts] = useState([]);
  const [ptmOpts, setPtmOpts] = useState([]);
  const [labelOpts, setLabelOpts] = useState([]);
  const [dataStructOpts, setDataStructOpts] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    name: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    }
  }

  useEffect(()=>{
    setOpLoading(true);

    // {
    //   users: [
    //     {id: 1, name: ‘the name’},
    //     {id: 2, name: ‘another name’}
    //     …
    //   ],
    //   ptms : [‘pertained mode 1’, ‘some other model’]
    //   labels: [
    //     {id: ‘label_12345_LABEL1’, name: ‘LABEL1’},
    //     {id: ‘label_12345_LABEL2’, name: ‘LABEL2’}
    //   ],
    //   data_structs: [‘001’, ‘002’]
    // }
    api.get(URL_MAP.GET_DATAGROUP_PREQUISITES).then((resp)=>{
      let data = resp.data.data;
      setUserOpts(data.users);
      setPtmOpts(data.ptms);
      setLabelOpts(data.labels);
      setDataStructOpts(data.data_structs);

      if(editMode) {
        let formLabels = data.labels.filter((label)=>{
          return initFormData.assign_label.indexOf(label._id) > -1;
        });
        setFormData({
          ...initFormData,
          assign_label: formLabels,
        });
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
        setFormError('Failed to fetch pre-requisites. Not able to send the request. Contact administrator.');
      } else {
        setFormError('Failed to fetch pre-requisites. Some error occurred. Contact administrator.');
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
      value = e.target.type === 'checkbox'? e.target.checked : e.target.value;
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
      let newFormData = {
        ...formData,
        assign_label: formData.assign_label.map((label)=>label._id),
      }
      let url = editMode ? URL_MAP.UPDATE_DATA_GROUP : URL_MAP.CREATE_DATA_GROUP;
      let tempResponse=null
      if (editMode){
tempResponse=api.patch(url,newFormData)

      }else{

        tempResponse=api.post(url,newFormData)
      }
      tempResponse.then((resp)=>{
        setFormSuccess('Data group created sucessfully.');
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
  console.log("form data->",formData);
  return (
    <>
    <Box display="flex">
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} Data Group</Typography>
      {opLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
    </Box>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Data Group Name" required name='name'
            value={formData.name} errorMsg={formDataErr.name} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Description" name='desc'
            value={formData.desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect label="Assign user" name='assign_user' onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.assign_user} options={userOpts}
            labelKey='name' valueKey='id' />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Pre-trained model" name='ptm' onChange={onTextChange} disabled={formData.data_struct !== ''}
            firstEmpty={true} loading={opLoading} value={formData.ptm} options={ptmOpts} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect hasSearch multiple label="Assign label" name='assign_label' onChange={(e, value)=>{onTextChange(value, 'assign_label')}}
            loading={opLoading} value={formData.assign_label} options={labelOpts}
            labelKey='name' valueKey='id' />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Default structure ID" name='data_struct' disabled={formData.ptm !== ''} onChange={onTextChange}
            firstEmpty={true} loading={opLoading} value={formData.data_struct} options={dataStructOpts} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputCheck label="Data Analytics" formData={formData} options={dataAnalyticsOptions} onChange={onTextChange} />
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
          {/* <Button style={{marginLeft: '1rem'}} variant="outlined" onClick={onCancel}>Cancel</Button> */}
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}