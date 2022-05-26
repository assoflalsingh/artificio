import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import useApi from '../../../hooks/use-api';
import DataGroupJoins from './DataGroupJoins';

// const viewType = [{label: "Single", value:"single"},{label: "Multiple", value:"multiple"}];
const lineItemsTableData = [{label: "No", value:"no"},{label: "Yes", value:"yes"}];
const defaults = {
  name: '',
  desc: '',
  data_group: [],
  records: 1000,
  past_days: 30,
  future_days: 30,
  include_items_table: lineItemsTableData[0].value,
}

export default function DataViewForm({initFormData, ...props}) {
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [dgList, setDGList] = useState([]);
  const [labelsList, setLabesList] = useState([]);
  const {isLoading, apiRequest, error} = useApi();

  const formValidators = {
    name: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    }
  }

  useEffect(()=>{
    apiRequest({url: URL_MAP.GET_DATAGROUPS}, (response) => {
      setDGList(response.datagroups);
    });
    apiRequest({url: URL_MAP.GET_DATAGROUP_PREQUISITES}, (response) =>{
      setLabesList(response.labels);
      if(editMode) {
        let formLabels = response.labels.filter((label)=>{
          return initFormData.assign_label.indexOf(label._id) > -1;
        });
        setFormData({
          ...defaults,
          ...initFormData,
          assign_label: formLabels,
        });
      }
    });
  }, [apiRequest, editMode, initFormData]);

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
      // let url = editMode ? URL_MAP.UPDATE_DATA_GROUP : URL_MAP.CREATE_DATA_GROUP;
      // setSaving(true);
      // apiRequest({url: url, params: newFormData}, () =>{
      //   setFormSuccess('Data View created sucessfully.');
      //   if(!editMode) setFormData(defaults);
      //   setSaving(false);
      // });
    }
  }

  return (
    <>
    <Box display="flex" style={{marginTop: '1rem'}}>
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} Data View</Typography>
      {isLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
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
          <FormInputSelect label="Include Line Items/Table Data" name='include_items_table' value={formData.include_items_table} options={lineItemsTableData} onChange={onTextChange} loading={isLoading} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Relative Days Data Selection" name='past_days' value={formData.past_days} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="To" name='future_days' value={formData.future_days} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Default no of records (rows)" name="Default no of records (rows)" value={formData.records} onChange={onTextChange} />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputSelect hasSearch multiple label="Data Group" name='data_group' onChange={(e, value)=>{onTextChange(value, 'data_group')}} loading={isLoading} value={formData.data_group} options={dgList} labelKey='name' valueKey='id' />
        </FormRowItem>
      </FormRow>
      {formData.data_group.length > 1 && <DataGroupJoins selectedDataGroups={formData.data_group} labelsList={labelsList} setFormData={setFormData} />}
      {(error || formSuccess) &&
      <FormRow>
        <FormRowItem>
          {error && <Alert severity="error">{error}</Alert>}
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