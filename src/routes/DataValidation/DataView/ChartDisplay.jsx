import React, { useEffect, useState } from "react";
import { FormRow, FormRowItem, FormInputSelect } from '../../../components/FormElements';
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { useCallback } from "react";

const defaultDataTypes = ['excluded', 'category', 'series', 'time'];
const defaultField = {group: '', label: '', chart_data_type: defaultDataTypes[0], source_labels: []};

const ChartDisplay = (props) => {
	const [attrs, setAttrsData] = useState([...props.chart_display]);
	const {setFormData} = props;

  const getLabels = useCallback((value) => {
		if(value === '') return [];
		let respectiveLabels = [];
		props.dgList.forEach((dg) => {
			if(dg._id === value){
				respectiveLabels = props.labelsList.filter((label) => dg.assign_label.indexOf(label._id) >= 0);
			}
		});
		return respectiveLabels;
	},[props.dgList, props.labelsList]);
	
	const addAttr = () => {
		setAttrsData((prevState) => [...prevState, {...defaultField}]);
	}

	const saveToform = useCallback((attributesArr) => {
		let completedAttributes = [];
		attributesArr.forEach((data) => {
			if(data.group?.length > 0 && data.label?.length > 0 && data.chart_data_type?.length > 0){
				let saveObj = {...data};
				delete saveObj.source_labels;
				completedAttributes.push({...saveObj});
			}
		});
		setFormData((prevFormData)=>({...prevFormData, chart_display: completedAttributes.length > 0 ? completedAttributes: []}));
	},[setFormData]);

	const removeAttr = (index) => {
		setAttrsData((prevState) => {
			let updatedArr = prevState.filter((elem, indx)=> indx !== index);
			saveToform(updatedArr);
			return [...updatedArr];
		});
	}

	const onTextChange = (e, name) => {
    let value = e;
    if(e.target) {
      name = e.target.name;
      value = e.target.value;
    }

    setAttrsData((prevData) => {
			let dataArray = [...prevData];
			let nameArr = name.split('-');
			let fieldObj = {...dataArray[+nameArr[1]]};

			if(nameArr[0] === 'group' && value !== ''){
				fieldObj.source_labels = getLabels(value);
			}

			fieldObj[nameArr[0]] = value;
			dataArray[+nameArr[1]] = fieldObj;
			saveToform(dataArray);

			return [...dataArray];
		});
  }

	useEffect(() => {
		setAttrsData((prevState) => {
			let attrsArr = prevState.map((attr)=>{
				if(attr.group.length > 0){
					if(props.selectedDataGroups.findIndex(sDG => sDG._id === attr.group) < 0){
						attr.group = '';
						attr.label = '';
						attr.chart_data_type = defaultDataTypes[0];
						attr.source_labels = [];
					}else{
						attr.source_labels = getLabels(attr.group);
					}
				}
				return attr;
			});
			return [...attrsArr];
		});
	},[props.selectedDataGroups, getLabels]);

    return (<><hr style={{color: 'inherit', marginTop: '2rem'}}/><h3>Chart Display</h3>{attrs.map((attr,i)=>{
			return <FormRow key={i} style={{position:'relative'}}>
				<FormRowItem>
					<FormInputSelect label={`Data Group - ${i+1}`} name={`group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={attr.group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Label - ${i+1}`} name={`label-${i}`} onChange={onTextChange} options={attr.source_labels} value={attr.label} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Chart Data Type - ${i+1}`} name={`chart_data_type-${i}`} onChange={onTextChange} options={defaultDataTypes} value={attr.chart_data_type} />
					<IconButton variant="outlined" onClick={()=>removeAttr(i)} style={{zIndex:9, top: 8, right: 0, position: 'absolute'}}><DeleteIcon style={{fontSize: '1.2rem'}} /></IconButton>
				</FormRowItem>
			</FormRow>
		})}
		<FormRow>
			<FormRowItem>
				<Button variant="contained" onClick={addAttr} style={{padding: '0.5rem 1rem 0.5rem 0.8rem'}}><Add /> Label Attribute</Button>
			</FormRowItem>
		</FormRow>
    </>);
}

export default ChartDisplay;