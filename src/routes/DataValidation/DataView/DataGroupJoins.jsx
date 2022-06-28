import React, { useEffect, useState } from "react";
import { FormRow, FormRowItem, FormInputSelect } from '../../../components/FormElements';
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { useCallback } from "react";

const defaultField = {source_group: '', source_label: '', source_labels: [], destination_group: '', destination_label: '', destination_labels: []};

const DataGroupJoins = (props) => {
	const [joins, setJoinData] = useState([...props.joins]);
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
	
	const addJoin = () => {
		setJoinData((prevState) => [...prevState, {...defaultField}]);
	}

	const saveToform = useCallback((joinsArr) => {
		let completedJoins = [];
		joinsArr.forEach((data) => {
			if(data.source_group?.length > 0 && data.source_label?.length > 0 && data.destination_group?.length > 0 && data.destination_label?.length > 0){
				let saveObj = {...data};
				delete saveObj.source_labels;
				delete saveObj.destination_labels;
				completedJoins.push({...saveObj});
			}
		});
		setFormData((prevFormData)=>({...prevFormData, joins: completedJoins.length > 0 ? completedJoins: []}));
	},[setFormData]);

	const removeJoin = (index) => {
		setJoinData((prevState) => {
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

    setJoinData((prevData) => {
			let dataArray = [...prevData];
			let nameArr = name.split('-');
			let fieldObj = {...dataArray[+nameArr[1]]};

			if(nameArr[0] === 'source_group' && value !== ''){
				if(fieldObj.destination_group === value){
					value = fieldObj.source_group;
				}else{
					fieldObj.source_labels = getLabels(value);
				}
			}
			if(nameArr[0] === 'destination_group' && value !== ''){
				if(fieldObj.source_group === value){
					value = fieldObj.destination_group;
				}else{
					fieldObj.destination_labels = getLabels(value);
				}
			}
			fieldObj[nameArr[0]] = value;
			dataArray[+nameArr[1]] = fieldObj;
			saveToform(dataArray);

			return [...dataArray];
		});
  }

	useEffect(() => {
		setJoinData((prevState) => {
			let joinsArr = prevState.map((join)=>{
				if(join.source_group.length > 0){
					if(props.selectedDataGroups.findIndex(sDG => sDG._id === join.source_group) < 0){
						join.source_group = '';
						join.source_label = '';
						join.source_labels = [];
					}else{
						join.source_labels = getLabels(join.source_group);
					}
				}
				if(join.destination_group.length > 0){
					if(props.selectedDataGroups.findIndex(sDG => sDG._id === join.destination_group) < 0){
						join.destination_group = '';
						join.destination_label = '';
						join.destination_labels = [];
					}else{
						join.destination_labels = getLabels(join.destination_group);
					}
				}
				return join;
			});
			return [...joinsArr];
		});
	},[props.selectedDataGroups, getLabels]);

    return (<>{joins.map((join,i)=>{
			return <FormRow key={i} style={{position:'relative'}}>
				<FormRowItem>
					<FormInputSelect label={`Source Data Group - ${i+1}`} name={`source_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.source_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Source Label - ${i+1}`} name={`source_label-${i}`} onChange={onTextChange} options={join.source_labels} value={join.source_label} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Data Group - ${i+1}`} name={`destination_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.destination_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Label - ${i+1}`} name={`destination_label-${i}`} onChange={onTextChange} options={join.destination_labels} value={join.destination_label} labelKey='name' valueKey='_id' />
					<IconButton variant="outlined" onClick={()=>removeJoin(i)} style={{zIndex:9, top: 8, right: 0, position: 'absolute'}}><DeleteIcon style={{fontSize: '1.2rem'}} /></IconButton>
				</FormRowItem>
			</FormRow>
		})}
		<FormRow>
			<FormRowItem>
				<Button variant="contained" onClick={addJoin} style={{padding: '0.5rem 1rem 0.5rem 0.8rem'}}><Add /> Join</Button>
			</FormRowItem>
		</FormRow>
    </>);
}

export default DataGroupJoins;