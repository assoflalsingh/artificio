import React, { useEffect, useState } from "react";
import { FormRow, FormRowItem, FormInputSelect } from '../../../components/FormElements';
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";

const defaultField = {source_group: '', source_label: '', dest_group: '', dest_label: '', source_labels: [], dest_labels: []};

const DataGroupJoins = (props) => {
	const [joins, setJoinData] = useState([defaultField]);

	const getLabels = (value) => {
		if(value === '') return [];
		let selectedDataGroup = props.selectedDataGroups.filter((group) => group._id === value);
		let respectiveLabels = props.labelsList.filter((label) => selectedDataGroup[0].assign_label.indexOf(label._id) >= 0);
		return respectiveLabels;
	}
	
	const addJoin = () => {
		setJoinData((prevState) => [...prevState, {...defaultField}]);
	}

	const removeJoin = (index) => {
		setJoinData((prevState) => {
			let updatedArr = prevState.filter((elem, indx)=> indx !== index);
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
				if(fieldObj.dest_group === value){
					value = fieldObj.source_group;
				}else{
					fieldObj.source_labels = getLabels(value);
				}
			}
			if(nameArr[0] === 'dest_group' && value !== ''){
				if(fieldObj.source_group === value){
					value = fieldObj.dest_group;
				}else{
					fieldObj.dest_labels = getLabels(value);
				}
			}
			fieldObj[nameArr[0]] = value;
			dataArray[+nameArr[1]] = fieldObj;

			let completedJoins = dataArray.filter((data) => {
				if(data.source_group.length > 0 && data.source_label.length > 0 && data.dest_group.length > 0 && data.dest_label.length > 0){
					let saveObj = {...data};
					delete saveObj['source_labels'];
					delete saveObj['dest_labels'];
					return {...saveObj};
				}
			});

			props.setFormData((prevFormData)=>({...prevFormData, joins: completedJoins.length > 0 ? completedJoins: []}));

			return [...dataArray];
		});
  }

	useEffect(() => {
		setJoinData((prevState) => {
			let joinsArr = prevState.map((join)=>{
				if(join.source_group.length > 0 && props.selectedDataGroups.find((sGroup) => sGroup._id === join.source_group) === undefined){
					join.source_group = '';
					join.source_label = '';
					join.source_labels = [];
				}
				if(join.dest_label.length > 0 && props.selectedDataGroups.find((sGroup) => sGroup._id === join.dest_group) === undefined){
					join.dest_group = '';
					join.dest_label = '';
					join.dest_labels = [];
				}
				return join;
			});
			return [...joinsArr];
		});
	},[props.selectedDataGroups]);

	console.log(joins);

    return (<>{joins.map((join,i)=>{
			return <FormRow key={i} style={{position:'relative'}}>
				<FormRowItem>
					<FormInputSelect label={`Source Data Group - ${i+1}`} name={`source_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.source_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Source Label - ${i+1}`} name={`source_label-${i}`} onChange={onTextChange} options={join.source_labels} value={join.source_label} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Data Group - ${i+1}`} name={`dest_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.dest_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Label - ${i+1}`} name={`dest_label-${i}`} onChange={onTextChange} options={join.dest_labels} value={join.dest_label} labelKey='name' valueKey='_id' />
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