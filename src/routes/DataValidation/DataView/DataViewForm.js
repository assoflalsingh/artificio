import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";

const viewType = [{label: "Single", value:"single"},{label: "Multiple", value:"multiple"}];
const lineItemsTableData = [{label: "No", value:"no"},{label: "Yes", value:"yes"}];
const defaults = {
  name: '',
  desc: '',
  data_group: [],
  view_type: viewType[0].value,
  include_items_table: lineItemsTableData[0].value,
}

export default function DataViewForm({initFormData, ...props}) {
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [opLoading, setOpLoading] = useState(false);
  const [dgList, setDGList] = useState([]);

  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    name: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    }
  }

  useEffect(()=>{
    setOpLoading(true);
    api.get(URL_MAP.GET_DATAGROUPS).then((resp)=>{
      let data = resp.data.data;
      setDGList(data.datagroups);

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
    console.log("formData: ",formData);

    if(isFormValid) {
      let newFormData = {
        ...formData,
        data_group: formData.data_group.map((label)=>label._id),
      }
      console.log("newFormData: ",newFormData);
      return;
      setSaving(true);
      let url = editMode ? URL_MAP.UPDATE_DATA_GROUP : URL_MAP.CREATE_DATA_GROUP;
      api.post(url, newFormData).then((resp)=>{
        setFormSuccess('Data View created sucessfully.');
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
  // console.log("formData: ",formData);
  return (
    <>
    <Box display="flex">
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} Data View</Typography>
      {opLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
    </Box>
    <Box display="flex">
      <Button
        startIcon={<ChevronLeftOutlinedIcon />}
        onClick={() => {
          props.loadDataViewForm(false);
        }}
      >
        Back
      </Button>
    </Box>
    <Form>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Name" required name='name'
            value={formData.name} errorMsg={formDataErr.name} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Description" name='desc' value={formData.desc} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Include Line Items/Table Data" name='include_items_table' value={formData.include_items_table} options={lineItemsTableData} onChange={onTextChange} loading={opLoading} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect required label="Data View Type" name="view_type" value={formData.view_type} onChange={onTextChange} options={viewType} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect hasSearch multiple label="Data Group" name='data_group' onChange={(e, value)=>{onTextChange(value, 'data_group')}} loading={opLoading} value={formData.data_group} options={dgList} labelKey='name' valueKey='id' />
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