import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React, { useEffect, useState } from "react";
import Rectangle from "../../../canvas/annotations/Rectangle";
import {
  Form,
  FormInputText,
  FormInputSelect,
  FormRow,
  FormRowItem,
} from "../../FormElements";

export const CreateRuleDialog = ({ modalOpen, onClose, createLabel, typedText, annotation, getAnnotatedValue }) => {
  const annotationDimentions = annotation.annotationData.dimensions;
  // const annotatedValue = getAnnotatedValue(annotation).value;
  const [newAnnotatedValue, setNewAnnotatedValue] = useState(getAnnotatedValue(annotation).value);
  const ruleType = ["Tokenization","Pattern"];
  const tokenType = ["Region","Whole Document"];
  const [formData, setFormData] = useState({
    rule_type: ruleType[0],
    token_type: tokenType[0],
    x1: (annotationDimentions.x).toFixed(),
    x2: (annotationDimentions.x + annotationDimentions.w).toFixed(),
    y1: (annotationDimentions.y).toFixed(),
    y2: (annotationDimentions.y + annotationDimentions.h).toFixed(),
    pattern_type: "",
  });

  const onTextChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const create = () => {
    // let newAnnotation = {...annotation};
    // let newDimensions = {x: +formData.x1, y: +formData.y1, w: +(formData.x2 - formData.x1).toFixed(), h: +(formData.y2 - formData.y1).toFixed()};
    // newAnnotation.annotationData.dimensions = newDimensions;
    // console.log(formData);
    // console.log(newAnnotation);
    if (!formData.name) {
      // setFormError("Label ID is empty");
    } else {
      // setFormData(formData);
      // createLabel({
      //   value: formData.name,
      //   label: formData.name,
      //   color: formData.color,
      // });
    }
  };

  useEffect(()=>{
    let newDimensions = {x: +formData.x1, y: +formData.y1, w: +(formData.x2 - formData.x1).toFixed(), h: +(formData.y2 - formData.y1).toFixed()};
    const annotationData = {...annotation.annotationData, dimensions: newDimensions};
    const rectangle = new Rectangle(
      annotationData,
      annotation.scale,
      annotation.imageLabels
    );
    setNewAnnotatedValue(getAnnotatedValue(rectangle).value);
  },[formData, annotation, getAnnotatedValue]);

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Create Rule
      </DialogTitle>
      <DialogContent dividers>
        <Form>
          <FormRow>
            <FormRowItem>
              <FormInputSelect label="Rule Type" name="rule_type" value={formData.rule_type} onChange={onTextChange} options={ruleType} />
            </FormRowItem>
            <FormRowItem>
              {formData.rule_type === ruleType[0] && <FormInputSelect label="Token Type" name="token_type" value={formData.token_type} onChange={onTextChange} options={tokenType} />}
              {formData.rule_type === ruleType[1] && <FormInputSelect label="Pattern Type" name="pattern_type" value="" onChange={onTextChange} options={[""]} />}
            </FormRowItem>
          </FormRow>
          {formData.rule_type === ruleType[0] && formData.token_type === tokenType[0] && <><FormRow>
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
        </Form>
      </DialogContent>
      <DialogActions style={{paddingTop: 12, paddingBottom: 12}}>
        <Button autoFocus onClick={create} color="primary" variant="contained">
          Create Rule
        </Button>
        <Button autoFocus onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
