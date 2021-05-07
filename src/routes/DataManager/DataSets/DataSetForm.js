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
    emails: [],
    ocr_model:null,
    classify_model:null,
    ner_model:null
  }
  console.log("initFormData-->",initFormData)
  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const CURRENT_APP_ID = "10";
  const [opLoading, setOpLoading] = useState(false);

  const [appUsageOpts, setAppUsageOpts] = useState([]);
  
  const [emailsOpts, setEmailsOpts] = useState([]);
  const [ocrDetails, setOcrDetails] = useState([]);
  const [clasificationModels, setClasificationModels] = useState([]);
  const [nerModels, setNerModels] = useState([]);
  const [ocrPresent,setOcrPresent]=useState(false);
  const [classifyPresent,setClassifyPresent] = useState(false);
  const [nerPresent,setNerPresent] = useState(false);



  const api = getInstance(localStorage.getItem('token'));

  const formValidators = {
    data_set_id: {
      validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
      messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
    },
    desc: {
      validators: ['required', {type:'regex', param:'^.{0,200}$'}],
      messages: ['This field is required', 'Text allowed with max length of 200.'],
    },
    app_usage: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    ocr_model: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    classify_model: {
      validators: ['required'],
      messages: ['This field is required'],
    },
    ner_model: {
      validators: ['required'],
      messages: ['This field is required'],
    },

  }

  useEffect(()=>{
    setOpLoading(true);
    api.get(URL_MAP.GET_APP_USAGE).then((resp)=>{
      let usageData = resp.data.data;
      setAppUsageOpts(usageData);
      api.get(URL_MAP.GET_DATASET_EMAILS).then((resp)=>{
        let emailData = resp.data.data;
        setEmailsOpts(emailData);
        if(editMode) {
          let formAppUsage = usageData.filter((label)=>{
            return Object.keys(initFormData.app_usage).indexOf(label._id) > -1;
          });
          setFormData({
            ...initFormData,
            app_usage: formAppUsage,
            emails: initFormData.emails
          });
        }
      })
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

  useEffect(() => {
    const ocr = formData.app_usage.findIndex((el)=>el.app_usage==="20-AI OCR")!== -1;
    const classy = formData.app_usage.findIndex((el)=>el.app_usage==="30-Classification")!== -1;
    const ner = formData.app_usage.findIndex((el)=>el.app_usage==="40-Entity Extraction")!== -1;
    setOcrPresent(ocr);
    setClassifyPresent(classy);
    setNerPresent(ner);
    console.log('app usage change-->',formData.app_usage);
  }, [formData.app_usage]);
  useEffect(() => {
    api.post(URL_MAP.GET_OCR_DETAILS).then((resp)=>{
      const ocrDetails = resp.data.data;
      setOcrDetails(ocrDetails);
    }).catch((err)=>{
      if (err.response && err.response.data.message) {
        setFormError("Failed to fetch pre-requisites. Some error occurred' + '. Contact administrator.");
      }
    })
  }, []);

  useEffect(() => {
    api.post(URL_MAP.GET_ALL_MODELS,{model_type:"classifier"}).then((resp)=>{
      const models = resp.data.model_list;
      setClasificationModels(models);
    }).catch((err)=>{
      if (err.response && err.response.data.message) {
        setFormError("Failed to fetch pre-requisites. Some error occurred' + '. Contact administrator.");
      }
    })
  }, []);

  useEffect(() => {
    api.post(URL_MAP.GET_ALL_MODELS,{model_type:"NER"}).then((resp)=>{
      const models = resp?.data?.model_list;
      setNerModels(models);
    }).catch((err)=>{
      if (err.response && err.response.data.message) {
        setFormError("Failed to fetch pre-requisites. Some error occurred' + '. Contact administrator.");
      }
    })
  }, []);

  const validateField = (name, value) => {
    let errMsg = '';
    let fieldValidators = formValidators[name];
    if(fieldValidators) {
      value = (value && value?.toString().length>0) ? value : "";
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
    if(e?.target) {
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
        "email_ids": formData.emails.map((label)=>{return {'id':label.id, "email":label.email}}),
        "app_usage": formData.app_usage.map((label)=>label._id),
        "app_id": CURRENT_APP_ID,
        "update":editMode || false,
        "_id": editMode ? formData._id : null
      };
      
        if(ocrPresent){
          dataSetPayload.ocr_model_id = formData.ocr_model._id;
        }
        if(classifyPresent){
          dataSetPayload.classify_model_id = formData.classify_model._id;
          dataSetPayload.classify_model_version = formData.classify_model.version;
        }
        if(nerPresent){
          dataSetPayload.ner_model_id = formData.ner_model._id;
          dataSetPayload.ner_model_version = formData.ner_model.version;
        }
       
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
  console.log("formData-->",formData)
  console.log("form errors",formDataErr);

  return (
    <>
    <Box display="flex">
      <Typography color="primary" variant="h6" gutterBottom>{editMode ? "Edit": "Create"} Data Set</Typography>
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
        <FormRowItem>
        <FormInputSelect multiple label="Email Id(s)" hasSearch required name='emails' onChange={(e, value)=>{onTextChange(value, 'emails')}}
            labelKey='email' valueKey='id' firstEmpty={true} loading={opLoading} errorMsg={formDataErr.emails} 
            value={formData.emails} options={emailsOpts} 
          />
        </FormRowItem>
      </FormRow>
      {formData.app_usage.length>0 && (
        <FormRow>
          <>
          {ocrPresent && (
              <FormRowItem xs={6}>
                <FormInputSelect  label="OCR Model" hasSearch required name='ocr_model' onChange={(e, value)=>{onTextChange(value, 'ocr_model')}}
                  labelKey='ocr_type' valueKey='_id' firstEmpty={true} loading={opLoading} errorMsg={formDataErr.ocr_model} 
                  value={formData.ocr_model?._id} options={ocrDetails} 
                />
              </FormRowItem>
          )}
          {classifyPresent && (
            <FormRowItem xs={6}>
              <FormInputSelect  label="Document classification model" hasSearch required name='classify_model' onChange={(e, value)=>{onTextChange(value, 'classify_model')}}
                labelKey='model_name' valueKey='_id' firstEmpty={true} loading={opLoading} errorMsg={formDataErr.classify_model} 
                value={formData.classify_model?._id} options={clasificationModels} 
              />
            </FormRowItem>
          )}
          {nerPresent && (
            <FormRowItem xs={6}>
              <FormInputSelect  label="Named entity recognition(NER) model" hasSearch required name='ner_model' onChange={(e, value)=>{onTextChange(value, 'ner_model')}}
                labelKey='model_name' valueKey='_id' firstEmpty={true} loading={opLoading} errorMsg={formDataErr.ner_model} 
                value={formData.ner_model?._id} options={nerModels} 
              />
            </FormRowItem>
          )}
        
        </>
      </FormRow>
      )}
      
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