import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import {getInstance, URL_MAP} from '../../../others/artificio_api.instance';
import { Form, FormInputText, FormInputSelect, FormRow, FormRowItem, doValidation } from '../../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import {useAsyncEffect} from 'use-async-effect';

export default function LabelForm({initFormData, ...props}) {
  const defaults = {    
    data_set_id: '',
    desc: '',
    app_usage: [],
    data_type: '',
    emails: [],
    ocr_model:'',
    classify_model:'',
    ner_model:''
  }

  const editMode = (initFormData != null);
  const [formData, setFormData] = useState(defaults);
  const [formDataErr, setFormDataErr] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const CURRENT_APP_ID = "10";
  const [opLoading, setOpLoading] = useState(true);

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

  useAsyncEffect(async isMounted => {
    try{
        // fetch app usage data
        const usageResponse = await api.get(URL_MAP.GET_APP_USAGE);
        // fetch emails data
        const emailsResponse = await api.get(URL_MAP.GET_DATASET_EMAILS);

        // fetch Ocr data
        const ocrResponse = await api.post(URL_MAP.GET_OCR_DETAILS);
        // fetch classification data
        const classifyResponse = await api.post(URL_MAP.GET_ALL_MODELS,{model_type:"classifier"});
        const classifyData = classifyResponse?.data?.model_list || []; 
        if(classifyData.length>0){
          classifyData.map((data)=>{data.model_name = `${data.model_name} ${data.version ? ` - v${data.version}`:""}`})
        }

        // fetch NER models
        const nerResponse = await api.post(URL_MAP.GET_ALL_MODELS,{model_type:"NER"});
        const nerData = nerResponse?.data?.model_list || [];
        if(nerData.length>0){
          nerData.map((data)=>{data.model_name = `${data.model_name} ${data.version ? ` - v${data.version}`:""}`})
        }
        if (!isMounted()) return;

        // set data
        setAppUsageOpts(usageResponse?.data?.data);
        setEmailsOpts(emailsResponse?.data?.data);
        setOcrDetails(ocrResponse?.data?.data);
        setClasificationModels(classifyData);
        setNerModels(nerData);
        setOpLoading(false);

        // edit mode
        if(editMode) {
          let formAppUsage = usageResponse?.data?.data.filter((label)=>{
            return Object.keys(initFormData.app_usage).indexOf(label._id) > -1;
          });
          
          const classifyModel = classifyData.filter((model)=>(model.model_id === initFormData.classify_model && model.version===initFormData.classify_version))[0]?._id || "" ;
          const nerModel = nerData.filter((model)=>(model.model_id === initFormData.ner_model && model.version===initFormData.ner_version))[0]?._id || "";
          setFormData({
            ...initFormData,
            app_usage: formAppUsage,
            emails: initFormData.emails,
            classify_model:classifyModel,
            ner_model:nerModel
          });
        }


    }
    catch(err){
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
  }
   
  }, []);

  

  useEffect(() => {
    const ocr = formData.app_usage.length?formData.app_usage.findIndex((el)=>el.app_usage==="20-AI OCR")!== -1:false;
    const classy = formData.app_usage.length?formData.app_usage.findIndex((el)=>el.app_usage==="30-Classification")!== -1:false;
    const ner = formData.app_usage.length?formData.app_usage.findIndex((el)=>el.app_usage==="40-Entity Extraction")!== -1:false;
    setOcrPresent(ocr);
    setClassifyPresent(classy);
    setNerPresent(ner);
  }, [formData.app_usage]);


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
      if(name==="ocr_model" && !ocrPresent){
        delete formDataErr.ocr_model;
        setFormDataErr(formDataErr);
      }
      else if(name ==="classify_model" && !classifyPresent){
        delete formDataErr.classify_model;
        setFormDataErr(formDataErr);
      }
      else if(name ==="ner_model" && !nerPresent){
        delete formDataErr.ner_model;
        setFormDataErr(formDataErr);
      }
      else if(Boolean(validateField(name, formData[name]))) {
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
        // add additional model details 
        // for OCR MODEL     
        if(ocrPresent){
          dataSetPayload.ocr_model_id = formData.ocr_model;
        }
        else{
          dataSetPayload.ocr_model_id = "";
        }
   
        //FOR CLASSIFICATION MODEL
        if(classifyPresent){
          dataSetPayload.classify_model_id = clasificationModels.filter((model)=>model._id===formData.classify_model)[0].model_id;
          dataSetPayload.classify_version = clasificationModels.filter((model)=>model._id===formData.classify_model)[0].version;
        }
        else{
          dataSetPayload.classify_model_id = "";
          dataSetPayload.classify_version = "";
        }
        // FOR NER MODEL
        if(nerPresent){
          dataSetPayload.ner_model_id = nerModels.filter((model)=>model._id===formData.ner_model)[0].model_id;
          dataSetPayload.ner_version =  nerModels.filter((model)=>model._id===formData.ner_model)[0].version;
        }
        else{
          dataSetPayload.ner_model_id = "";
          dataSetPayload.ner_version = "";
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
      {/* {formData.app_usage.length>0 && ( */}
      <FormRow>
        <>
          {ocrPresent && (
            <FormRowItem xs={6}>
            <FormInputSelect   label="OCR Model"  required name='ocr_model' onChange={onTextChange}
              labelKey='ocr_type' valueKey='_id' firstEmpty={false} loading={opLoading} errorMsg={formDataErr.ocr_model} 
              value={formData.ocr_model} options={ocrDetails} 
            />
          </FormRowItem>
          )}
          {classifyPresent && (
            <FormRowItem xs={6}>
              <FormInputSelect  label="Document classification model"  required name='classify_model' onChange={onTextChange}
                labelKey='model_name' valueKey='_id' firstEmpty={false} loading={opLoading} errorMsg={formDataErr.classify_model} 
                value={formData.classify_model} options={clasificationModels} 
              />
            </FormRowItem>
          )}
          {nerPresent && (
            <FormRowItem xs={6} >
              <FormInputSelect label="Named entity recognition(NER) model"  required name='ner_model' onChange={onTextChange}
                labelKey='model_name' valueKey='_id' firstEmpty={false} loading={opLoading} errorMsg={formDataErr.ner_model} 
                value={formData.ner_model} options={nerModels} 
              />
            </FormRowItem>
          )}
        </>
      </FormRow>
      {/* )} */}
      
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