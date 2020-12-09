import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React, {useState} from "react";
import {doValidation, Form, FormInputColor, FormInputText, FormRow, FormRowItem} from "../../FormElements";
import Alert from "@material-ui/lab/Alert";

export const CreateModalDialog = ({ modalOpen, onClose, createLabel }) => {
	const defaults = {
		name: '',
		desc: '',
		shape: '',
		data_type: '',
		color: '#FF6633',
	}
	const [formData, setFormData] = useState(defaults);
	const [formDataErr, setFormDataErr] = useState({});
	const [formError, setFormError] = useState('');

	const formValidators = {
		name: {
			validators: ['required', {type:'regex', param:'^[A-Za-z0-9_]{1,20}$'}],
			messages: ['This field is required', 'Only alpha-numeric & underscore allowed with max length of 20.'],
		}
	}

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

	const create = () => {
		if(!formData.name) {
			setFormError('Label ID is empty')
		} else {
			setFormData(defaults)
			createLabel({
				value: formData.name,
				label: formData.name,
				color: formData.color
			})
		}
	}

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Create Label
      </DialogTitle>
      <DialogContent dividers>
				<Form>
					<FormRow>
						<FormRowItem>
							<FormInputText label="Label ID" required name='name'
														 value={formData.name} errorMsg={formDataErr.name} onChange={onTextChange}/>
						</FormRowItem>
						<FormRowItem>
							<FormInputText label="Label Description" name='desc' onChange={onTextChange}/>
						</FormRowItem>
					</FormRow>
					<FormRow>
						<FormRowItem>
							<FormInputText label="Assign Shape" name='desc'
														 value={"Box"} onChange={() => {}}/>
						</FormRowItem>
						<FormRowItem>
							<FormInputText label="Data type" name='desc' onChange={() => {}}/>
						</FormRowItem>
					</FormRow>
					<FormRow>
						<FormRowItem>
							<FormInputColor label="Assign color" name='color' value={formData.color}
															onChange={(value)=>{onTextChange(value, 'color')}} />
						</FormRowItem>
						<FormRowItem>
						</FormRowItem>
					</FormRow>
					{formError &&
					<FormRow>
						<FormRowItem>
							{formError && <Alert severity="error">{formError}</Alert>}
						</FormRowItem>
					</FormRow>}
				</Form>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={create}
          color="primary"
          variant="contained"
        >
          Create Label
        </Button>
				<Button
					autoFocus
					onClick={onClose}
					color="primary"
					variant="contained"
				>
					Cancel
				</Button>
      </DialogActions>
    </Dialog>
  );
};
