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
import ChartDisplay from './ChartDisplay';

// const viewType = [{label: "Single", value:"single"},{label: "Multiple", value:"multiple"}];
const lineItemsTableData = [{label: "", name: 'line_item', value: true}];
const defaults = {
  dataview_name: '',
  dataview_desc: '',
  datagroups: [],
  joins:[],
  chart_display: [],
  default_rows: 1000,
  days_before: -30,
  days_after: 30,
  date_from: '',
  date_to: '',
  application_id:'',
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
  const [dgList, setDGList] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const {isLoading, apiRequest: prequisitesReq, error} = useApi();
  const {isLoading: dgIsLoading, apiRequest: dgReq, error: dgError} = useApi();
  const {isLoading: savingDV, apiRequest: saveDVReq, error: dvError} = useApi();
  const classes = useStyles();

  const formValidators = {
    dataview_name: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    },
    datagroups : {
      validators: ['required'],
      messages: ['This field is required'],
    }
  }

  useEffect(()=>{
    if(dgList.length < 1){
      dgReq({url: URL_MAP.GET_DATAGROUPS}, (response) => {
        setDGList(response.datagroups);
        setLabelsList(response.labels);

        if(editMode) {
          let initDatagroups = response.datagroups.filter((dgVal) => initFormData.datagroups.indexOf(dgVal._id) >= 0);
          setFormData((prevState) => {
            let fillForm = {
              ...prevState,
              ...initFormData,
              joins: [],
              chart_display: [],
              datagroups: initDatagroups,
              date_from: '',
              date_to: '',
            };
            fillForm.joins = initFormData.joins.map((join) => {
              let joinData = {...join};
              if(joinData.source_group.length > 0){
                response.datagroups.forEach((dg) => {
                  if(dg._id === joinData.source_group){
                    joinData.source_labels = response.labels.filter((label) => dg.assign_label.indexOf(label._id) >= 0);
                  }
                });
              }
              if(joinData.destination_group.length > 0){
                response.datagroups.forEach((dg) => {
                  if(dg._id === joinData.destination_group){
                    joinData.destination_labels = response.labels.filter((label) => dg.assign_label.indexOf(label._id) >= 0);
                  }
                });
              }
              return joinData;
            });

            initFormData.chart_display = initFormData.chart_display || [];
            fillForm.chart_display = initFormData.chart_display.map((attr) => {
              let attrData = {...attr};
              if(attrData.group.length > 0){
                response.datagroups.forEach((dg) => {
                  if(dg._id === attrData.group){
                    attrData.source_labels = response.labels.filter((label) => dg.assign_label.indexOf(label._id) >= 0);
                  }
                });
              }
              return attrData;
            });
            return fillForm;
          });
        }
      });
    }
  }, [dgReq, prequisitesReq, editMode, initFormData, dgList]);

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
      let joinsData = [];
      formData.joins.forEach((data) => {
				if(data.source_group?.length > 0 && data.source_label?.length > 0 && data.destination_group?.length > 0 && data.destination_label?.length > 0){
					let saveObj = {...data};
					delete saveObj.source_labels;
					delete saveObj.destination_labels;
					joinsData.push({...saveObj});
				}
			});
      let attrsData = [];
      formData.chart_display.forEach((data) => {
				if(data.group?.length > 0 && data.label?.length > 0 && data.chart_data_type?.length > 0){
					let saveObj = {...data};
					delete saveObj.source_labels;
					attrsData.push({...saveObj});
				}
			});
      let newFormData = {};
      newFormData = {
        ...formData,
        date_from: formData.date_from? `${formData.date_from.getFullYear()}-${appendZero(formData.date_from.getMonth()+1)}-${appendZero(formData.date_from.getDate())}` : '',
        date_to: formData.date_to? `${formData.date_to.getFullYear()}-${appendZero(formData.date_to.getMonth()+1)}-${appendZero(formData.date_to.getDate())}`: '',
        datagroups: formData.datagroups.map((group) => group._id),
        joins: joinsData,
        chart_display: attrsData,
      }
      if(editMode){
        delete newFormData._id;
        delete newFormData.dataview_name;
      }
      console.log("newFormData: ",newFormData);
      saveDVReq({url: URL_MAP.DATA_VIEW+(editMode? formData._id+'/': ''), params: newFormData, method: editMode?'patch':'post'}, () =>{
        setFormSuccess(`Data View ${editMode? 'updated':'created'} sucessfully.`);
        if(!editMode) setFormData(defaults);
      });
    }
  }

  return (
    <>
    <Box display="flex" style={{marginTop: '1rem'}}>
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} Data View</Typography>
      {isLoading && dgIsLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading...</Typography></>}
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
          <FormInputText label="Relative Days Data Selection" name='days_before' value={formData.days_before} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="To" sideLabel={true} name='days_after' value={formData.days_after} onChange={onTextChange}/>
        </FormRowItem>
        <FormRowItem>
          <FormInput label="Relative Date From">
            <CustomField>
              <DatePicker className={`${classes.dateSelector} MuiInputBase-input MuiOutlinedInput-input`} selected={formData.date_from } placeholderText="Select Date" onChange={date => onTextChange(date, "date_from")} />
            </CustomField>
          </FormInput>
        </FormRowItem>
        <FormRowItem>
          <FormInput label="To" sideLabel={true}>
            <CustomField>
              <DatePicker className={`${classes.dateSelector} MuiInputBase-input MuiOutlinedInput-input`} selected={formData.date_to } placeholderText="Select Date" minDate={formData.date_from} onChange={date => onTextChange(date, "date_to")}/>
            </CustomField>
          </FormInput>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <FormInputCheck color="primary" label="Include Line Items / Table Data" formData={formData} options={lineItemsTableData} onChange={onTextChange} />
        </FormRowItem>
        <FormRowItem>
          <FormInputText label="Default no of records (rows)" name="default_rows" value={formData.default_rows} onChange={onTextChange} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect label="Application ID" name='application_id' onChange={onTextChange} value={formData.application_id} options={['Training','Live']} />
        </FormRowItem>
        <FormRowItem>
          <FormInputSelect required hasSearch multiple errorMsg={formDataErr.datagroups} label="Data Group" name='datagroups' onChange={(e, value)=>{onTextChange(value, 'datagroups')}} loading={dgIsLoading} value={formData.datagroups} options={dgList} labelKey='name' />
        </FormRowItem>
      </FormRow>
      {formData.datagroups.length > 1 && dgList.length > 1 && <DataGroupJoins selectedDataGroups={formData.datagroups} dgList={dgList} labelsList={labelsList} joins={[...formData.joins]} setFormData={setFormData} />}

      {formData.datagroups.length >= 1 && dgList.length > 1 && <ChartDisplay selectedDataGroups={formData.datagroups} dgList={dgList} labelsList={labelsList} chart_display={[...formData.chart_display]} setFormData={setFormData} />}

      {(error || dgError || dvError || formSuccess) &&
      <FormRow>
        <FormRowItem>
          {(error || dgError || dvError) && <Alert severity="error">{error || dgError || dvError}</Alert>}
          {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
        </FormRowItem>
      </FormRow>}
      <FormRow>
        <FormRowItem>
          <Button color="secondary" variant="contained" onClick={onSave} disabled={savingDV}>{savingDV ? 'Saving...' : 'Save'}</Button>
        </FormRowItem>
      </FormRow>
    </Form>
    </>
  )
}