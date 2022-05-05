import React, { useEffect, useState } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Rectangle from "../../../canvas/annotations/Rectangle";
import {
  Form,
  FormInputText,
  FormInputSelect,
  FormRow,
  FormRowItem,
  FormInputRadio,
} from "../../FormElements";

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
};

export const CreateRuleDialog = ({ modalOpen, onClose, createRule, getSelectedAnnotation, getAnnotatedValue }) => {
  const annotation = getSelectedAnnotation();
  const annotationDimentions = annotation.annotationData.dimensions;
  const [newAnnotatedValue, setNewAnnotatedValue] = useState(getAnnotatedValue(annotation).value);
  const ruleType = [{label: "Tokenization", value:"tokenize"},{label:"Pattern", value: "pattern"}];
  const tokenType = [{label: "Region", value:"region"},{label: "Whole Doc", value:"whole_doc"}];
  const preSucc = [{label: "Preceding", value:"prec"},{label: "Succeeding", value:"succ"}];
  const [formData, setFormData] = useState(defaultRuleForm);

  const onTextChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const updatedData = {
      ...formData,
      [name]: value,
    }

    if(['x1', 'x2', 'y1', 'y2'].indexOf(name) >= 0){
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
    console.log(formData);
    // if (!formData.name) {
      // setFormError("Label ID is empty");
    // } else {
      let createRuleData = {
        rule_type: formData.rule_type,
        token_type: formData.token_type,
        dimentions: {
          x: +formData.x1,
          y: +formData.y1,
          w: +(formData.x2 - formData.x1).toFixed(),
          h: +(formData.y2 - formData.y1).toFixed(),
        },
        annotated_value: getAnnotatedValue(annotation).value,
        new_annotated_value: newAnnotatedValue,
        keyword: formData.keyword,
        occurence: formData.occurence,
        preSucc: formData.preSucc,
        no_of_tokens: formData.no_of_tokens,
      };
      if(formData.preSucc.length > 0){
        createRuleData[formData.preSucc] = formData.no_of_tokens;
      }
      createRule(createRuleData);
    // }
  };

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
      const annDim = annotation.annotationData.dimensions;
      ruleData = {
        ...defaultRuleForm,
        rule_type: ruleType[0].value,
        token_type: tokenType[0].value,
        x1: (annDim.x).toFixed(),
        x2: (annDim.x + annDim.w).toFixed(),
        y1: (annDim.y).toFixed(),
        y2: (annDim.y + annDim.h).toFixed(),
      };
      setNewAnnotatedValue(getAnnotatedValue(annotation).value);
    }
    setFormData(ruleData);
  },[annotation]);

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>Create Rule</DialogTitle>
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
              <FormInputText label="X2" name="x2" value={formData.x2} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Y1" name="y1" value={formData.y1} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Y2" name="y2" value={formData.y2} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              <FormInputText label="Annotated Value" name="annotated_value" value={getAnnotatedValue(annotation).value} readOnly/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Display Text" name="display_text" value={newAnnotatedValue} readOnly/>
            </FormRowItem>
          </FormRow></>}
          <FormRow>
            <FormRowItem>
              <FormInputText label="Keyword" name="keyword" value={formData.keyword} onChange={onTextChange}/>
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="Occurence" name="occurence" value={formData.occurence} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              <FormInputRadio label="Preceding / Succeeding" name="preSucc" value={formData.preSucc} onChange={onTextChange} options={preSucc} />
            </FormRowItem>
            <FormRowItem>
              <FormInputText label="No. of Tokens" disabled={formData.preSucc === ''} name="no_of_tokens" value={formData.no_of_tokens} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
          <FormRow>
            <FormRowItem>
              <FormInputText label="Extracted Text" name="extracted_text" value={formData.extracted_text} onChange={onTextChange}/>
            </FormRowItem>
          </FormRow>
        </Form>
      </DialogContent>
      <DialogActions style={{paddingTop: 12, paddingBottom: 12}}>
        <Button autoFocus onClick={create} color="primary" variant="contained">Create Rule</Button>
        <Button autoFocus onClick={onClose} color="primary" variant="contained">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
