import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation, FormInputCheck, FormInput, CustomField } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useApi from '../../../hooks/use-api';
import DataGroupJoins from './DataGroupJoins';

// const viewType = [{label: "Single", value:"single"},{label: "Multiple", value:"multiple"}];
const lineItemsTableData = [{label: "", name: 'line_item', value: true}];
const defaults = {
  dataview_name: '',
  dataview_desc: '',
  datagroups: [],
  default_rows: 1000,
  days_before: -30,
  days_after: 30,
  date_from: '',
  date_to: '',
  usage:'',
  line_item: lineItemsTableData[0].value,
}
const useStyles = makeStyles((theme) => ({
  dateSelector: {
    cursor: "pointer",
    caretColor: 'transparent'
  }
}));

const appendZero = (val) => {
	return (val <= 9 ? '0': '')+val;
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
  const classes = useStyles();

  const formValidators = {
    dataview_name: {
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
    });
    if(editMode) {
      console.log(initFormData);
      setFormData({
        ...initFormData,
        date_from: '',
        date_to: '',
      });
    }
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
      value = e.target.type === 'checkbox'? e.target.checked : e.target.value;
    }
    if(name === 'days_before'){
      if(value === '-'){
        value = '';
      }
      if(+value > 0){
        value *= -1;
      }
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
      let newFormData = {};
      if(editMode){
        newFormData.dataview_desc = formData.dataview_desc;
      }else{
        newFormData = {
          ...formData,
          date_from: formData.date_from? `${formData.date_from.getFullYear()}-${appendZero(formData.date_from.getMonth()+1)}-${appendZero(formData.date_from.getDate())}` : '',
          date_to: formData.date_to? `${formData.date_to.getFullYear()}-${appendZero(formData.date_to.getMonth()+1)}-${appendZero(formData.date_to.getDate())}`: '',
          datagroups: formData.datagroups.map((label)=>label._id),
          joins: formData.joins?.length > 0? formData.joins : [] ,
        }
      }
      console.log("newFormData: ",newFormData);
      setSaving(true);
      apiRequest({url: URL_MAP.DATA_VIEW+(editMode? formData._id+'/': ''), params: newFormData, method: editMode?'patch':'post'}, () =>{
        setFormSuccess(`Data View ${editMode? 'updated':'created'} sucessfully.`);
        if(!editMode) setFormData(defaults);
        setSaving(false);
      });
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
          <FormInputText label="Name" required name='dataview_name'
            value={formData.dataview_name} errorMsg={formDataErr.dataview_name} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Description" name='dataview_desc' value={formData.dataview_desc} onChange={onTextChange}/>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputText label="Relative Days Data Selection" name='days_before' value={formData.days_before} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="To" sideLabel={true} name='days_after' value={formData.days_after} onChange={onTextChange} disabled={editMode}/>
        </FormRowItem>
        <FormRowItem>
          <FormInput label="Relative Date From">
            <CustomField>
              <DatePicker className={`${classes.dateSelector} MuiInputBase-input MuiOutlinedInput-input`} selected={formData.date_from } placeholderText="Select Date" onChange={date => onTextChange(date, "date_from")} disabled={editMode} />
            </CustomField>
          </FormInput>
        </FormRowItem>
        <FormRowItem>
          <FormInput label="To" sideLabel={true}>
            <CustomField>
              <DatePicker className={`${classes.dateSelector} MuiInputBase-input MuiOutlinedInput-input`} selected={formData.date_to } placeholderText="Select Date" minDate={formData.date_from} onChange={date => onTextChange(date, "date_to")} disabled={editMode}/>
            </CustomField>
          </FormInput>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputCheck color="primary" label="Include Line Items / Table Data" formData={formData} options={lineItemsTableData} onChange={onTextChange} disabled={editMode} />
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Default no of records (rows)" name="default_rows" value={formData.default_rows} onChange={onTextChange} disabled={editMode} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect hasSearch multiple label="Data Group" name='datagroups' onChange={(e, value)=>{onTextChange(value, 'datagroups')}} loading={isLoading} value={formData.datagroups} options={dgList} labelKey='name' valueKey='id' disabled={editMode} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Usage" name='usage' onChange={onTextChange} value={formData.usage} options={['Training','Live']} disabled={editMode} />
        </FormRowItem>
      </FormRow>
      {!editMode && formData.datagroups.length > 1 && <DataGroupJoins selectedDataGroups={formData.datagroups} labelsList={labelsList} setFormData={setFormData} />}
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