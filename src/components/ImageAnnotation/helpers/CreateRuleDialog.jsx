import React, { useEffect, useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Rectangle from "../../../canvas/annotations/Rectangle";
import Draggable from "react-draggable";
import Paper from '@material-ui/core/Paper';
import {
  Form,
  FormInputText,
  FormInputSelect,
  FormRow,
  FormRowItem,
  FormInputRadio,
} from "../../FormElements";
import { ruleVerification } from "../apiMethods";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#customized-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const defaultRuleForm = {
  rule_type: '',
  token_type: '',
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 0,
  keyword: '',
  occurence: '',
  preSucc: '',
  no_of_tokens: '1',
  extracted_text: '',
  pattern_type: '',
  pattern_value: '',
  annotated_value: '',
};

const ruleType = [{label: "Tokenization", value:"tokenize"},{label:"Pattern", value: "pattern"}];
const tokenType = [{label: "Region", value:"region"},{label: "Whole Doc", value:"whole_doc"}];
const preSucc = [{label: "Preceding", value:"prec"},{label: "Succeeding", value:"succ"}];

export const CreateRuleDialog = ({
  modalOpen,
  onClose,
  createRule,
  getSelectedAnnotation,
  getAnnotatedValue,
  getImageModelData,
  api,
  rulePatterns,
  convertCoorToPoints,
}) => {
  const annotation = getSelectedAnnotation();
  const [newAnnotatedValue, setNewAnnotatedValue] = useState(getAnnotatedValue(annotation).value);
  const [formData, setFormData] = useState(defaultRuleForm);
  const [ extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({show: false, error: false, message: ''});

  const onTextChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setExtractedText("");

    if(name === 'x1' && value >= formData.x2){
      value = formData.x1;
    }
    if(name === 'x2' && value <= formData.x1){
      value = formData.x2;
    }
    if(name === 'y1' && value >= formData.y2){
      value = formData.y1;
    }
    if(name === 'y2' && value <= formData.y1){
      value = formData.y2;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if(['x1', 'x2', 'y1', 'y2'].indexOf(name) >= 0){
      const updatedData = {
        ...formData,
        [name]: value,
      }

      let newDimensions = {x: +updatedData.x1, y: +updatedData.y1, w: +(updatedData.x2 - updatedData.x1).toFixed(), h: +(updatedData.y2 - updatedData.y1).toFixed()};
      const annotationData = {...annotation.annotationData, dimensions: newDimensions};
      const rectangle = new Rectangle(
        annotationData,
        annotation.scale,
        annotation.imageLabels
      );
      setNewAnnotatedValue(getAnnotatedValue(rectangle).value);
    }
  };

  const create = () => {
      let createRuleData = {
        ...formData,
        dimentions: {
          x: +formData.x1,
          y: +formData.y1,
          w: +(formData.x2 - formData.x1).toFixed(),
          h: +(formData.y2 - formData.y1).toFixed(),
        },
        annotated_value: formData.annotated_value.trim(),
        new_annotated_value: newAnnotatedValue,
      };
      if(formData.preSucc.length > 0){
        createRuleData[formData.preSucc] = formData.no_of_tokens;
      }
      createRule(createRuleData);
  };

  const notify = (errorFlag = false, message = '') => {
    setAlert({
        show: message.length > 0,
        error: errorFlag,
        message: message,
    });
  }

  const getFormattedRuleData = () => {
    let ruleData = {};
    let ruleDataType = formData.rule_type === 'tokenize' ? "tokens" : "pattern";
    ruleData[ruleDataType] = { occ: +formData.occurence || 0};

    if(formData.token_type === tokenType[0].value ){
      ruleData[ruleDataType] = {...ruleData[ruleDataType], coor: convertCoorToPoints([formData.x1, formData.y1, formData.x2, formData.y2])};
    }
    if(formData.rule_type === 'tokenize'){
      ruleData[ruleDataType] = {...ruleData[ruleDataType], token_word: formData.keyword};
      if(formData.preSucc.length > 0 && +formData.no_of_tokens > 0){
        ruleData[ruleDataType] = {...ruleData[ruleDataType], [formData.preSucc]: +formData.no_of_tokens};
      }
    }else{
      ruleData[ruleDataType] = {...ruleData[ruleDataType], pattern: formData.pattern_type, user_input: formData.pattern_value};
    }
    return ruleData;
  }

  const verify = () => {
    let verifyData = {rule: getFormattedRuleData(), ...getImageModelData()};

    setExtractedText("");
    setLoading(true);

    ruleVerification(api, verifyData).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setExtractedText(response.data.data.trim());
        if(formData.annotated_value.trim() === response.data.data.trim()){
          notify(false, 'Rule Verified Successfully!');
        }else{
          notify(true, 'Rule Not Verified!');
        }
      }else{
        notify(true, 'Server Response Error!');
      }

    }).catch((error) => {
      setLoading(false);

      if(error.hasOwnProperty("response") && error.response !== undefined){
        notify(true, error.response.data.message);
      } else {
        notify(true, 'Something Went Wrong!!');
      }
    });
  }

  useEffect(()=>{
    let ruleData = {};
    const savedRule = annotation.getRule();

    if(savedRule){
      let savedRuleDimentions = savedRule.dimentions;
      ruleData = {...savedRule,
        x1: (savedRuleDimentions.x).toFixed(),
        x2: (savedRuleDimentions.x + savedRuleDimentions.w).toFixed(),
        y1: (savedRuleDimentions.y).toFixed(),
        y2: (savedRuleDimentions.y + savedRuleDimentions.h).toFixed(),
      };
      const annotationData = {...annotation.annotationData, dimensions: savedRuleDimentions};
      const rectangle = new Rectangle(
        annotationData,
        annotation.scale,
        annotation.imageLabels
      );
      setNewAnnotatedValue(getAnnotatedValue(rectangle).value);
    }else{
      const annDim = annotation.getData().coordinates;
      ruleData = {
        ...defaultRuleForm,
        rule_type: ruleType[0].value,
        token_type: tokenType[0].value,
        annotated_value: getAnnotatedValue(annotation).value.trim(),
        x1: annDim[0].toFixed(),
        y1: annDim[1].toFixed(),
        x2: annDim[2].toFixed(),
        y2: annDim[3].toFixed(),
      };
      setNewAnnotatedValue(getAnnotatedValue(annotation).value);
    }
    setFormData(ruleData);
  },[annotation, getAnnotatedValue]);

  let currentRuleType = rulePatterns.filter((pattern) => pattern.value === formData.pattern_type);
  let isDisabled = loading || (formData.rule_type === ruleType[1].value && ((currentRuleType[0]?.user_input && formData.pattern_value.length === 0) || +formData.occurence < 1))
  || (formData.rule_type === ruleType[0].value && formData.token_type === tokenType[0].value && (formData.keyword.length < 1 || formData.preSucc.length === 0 || formData.no_of_tokens === 0));

  return (
    <Dialog
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose} style={{cursor: "move"}}>Create Rule</DialogTitle>
      <DialogContent dividers>
        <Form>
          <FormRow>
            <FormRowItem>
              <FormInputSelect label="Rule Type" name="rule_type" value={formData.rule_type} onChange={onTextChange} options={ruleType} />
            </FormRowItem>
            <FormRowItem>
              <FormInputRadio label="Token Type" name="token_type" value={formData.token_type} onChange={onTextChange} options={tokenType} />
            </FormRowItem>
          </FormRow>
          {formData.token_type === tokenType[0].value && <><FormRow>
            <FormRowItem>
              <FormInputText label="X1" name="x1" value={formData.x1} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Y1" name="y1" value={formData.y1} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="X2" name="x2" value={formData.x2} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Y2" name="y2" value={formData.y2} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              <FormInputText label="Annotated Value" name="annotated_value" value={formData.annotated_value} readOnly/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Display Text" name="display_text" value={newAnnotatedValue} readOnly/>
            </FormRowItem>
          </FormRow></>}
          {formData.token_type === tokenType[1].value && <FormRow>
            <FormRowItem>
              <FormInputText label="Annotated Value" name="annotated_value" value={formData.annotated_value} readOnly/>
            </FormRowItem>
            </FormRow>}
          {formData.rule_type === ruleType[1].value && <><FormRow>
            <FormRowItem>
              <FormInputSelect required label="Patter Type" name="pattern_type" value={formData.pattern_type} onChange={onTextChange} options={rulePatterns} />
            </FormRowItem>
            <FormRowItem>
              <FormInputText required label="Occurence" name="occurence" value={formData.occurence} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          {currentRuleType[0]?.user_input && <FormRow>
            <FormRowItem>
              <FormInputText label="Pattern Value" name="pattern_value" value={formData.pattern_value} onChange={onTextChange} />
            </FormRowItem>
          </FormRow>}</>}
          {formData.rule_type === ruleType[0].value && <><FormRow>
            <FormRowItem>
              <FormInputText required label="Keyword" name="keyword" value={formData.keyword} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Occurence" name="occurence" value={formData.occurence} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              <FormInputRadio required label="Preceding / Succeeding" disabled={formData.keyword.length < 1} name="preSucc" value={formData.preSucc} onChange={onTextChange} options={preSucc} />
            </FormRowItem>
            <FormRowItem>
              <FormInputText required label="No. of Tokens" disabled={formData.preSucc === ''} name="no_of_tokens" value={formData.no_of_tokens} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow></>}
          <FormRow>
            <FormRowItem>
              <FormInputText label="Extracted Text" name="extracted_text" value={extractedText} readOnly/>
            </FormRowItem>
          </FormRow>
        </Form>
      </DialogContent>
      <DialogActions style={{paddingTop: 12, paddingBottom: 12}}>
        <Button autoFocus onClick={verify} disabled={isDisabled} color="secondary" variant="contained">{loading ? 'Verifing' : 'Verify'}</Button>
        <Button autoFocus onClick={create} disabled={isDisabled || extractedText.trim() !== formData.annotated_value.trim()} color="primary" variant="contained">Save Rule</Button>
        <Button autoFocus onClick={onClose} color="primary" variant="contained">Cancel</Button>
      </DialogActions>
      <Snackbar
          open={alert.show}
          autoHideDuration={6000}
          onClose={() => notify()}
        >
          <Alert
            // onClose={() => notify()}
            severity={alert.error ? "error" : "success"}
          >
            {alert.message}
          </Alert>
        </Snackbar>
    </Dialog>
  );
};
