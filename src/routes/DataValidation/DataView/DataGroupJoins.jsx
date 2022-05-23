import React, { useState } from "react";
import { FormRow, FormRowItem, FormInputSelect } from '../../../components/FormElements';
import Add from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

const defaultField = {source_group: '', source_label: '', dest_group: '', dest_label: '', source_labels: [], dest_labels: []};

const DataGroupJoins = (props) => {
	const [joins, setJoinData] = useState([defaultField]);

	const getLabels = (value) => {
		if(value === '') return [];
		let selectedDataGroup = props.selectedDataGroups.filter((group) => group._id === value);
		console.log(selectedDataGroup);
		let respectiveLabels = props.labelsList.filter((label) => selectedDataGroup[0].assign_label.indexOf(label._id) >= 0);
		return respectiveLabels;
	}
	
	const addJoin = () => {
		setJoinData((prevState) => [...prevState, [{...defaultField}]]);
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
			console.log(nameArr);
			let fieldObj = {...dataArray[+nameArr[1]]};
			fieldObj[nameArr[0]] = value;
			if(nameArr[0] === 'source_group' && value !== ''){
				fieldObj.source_labels = getLabels(value);
			}
			if(nameArr[0] === 'dest_group' && value !== ''){
				fieldObj.dest_labels = getLabels(value);
			}
			console.log(fieldObj);
			dataArray[+nameArr[1]] = fieldObj;
			return [...dataArray];
		});
  }

	// console.log(props.labelsList);
	console.log(joins);

    return (<>{joins.map((join,i)=>{
			return <FormRow key={i}>
				<FormRowItem>
					<FormInputSelect label={`Source Group - ${i+1}`} name={`source_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.source_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Source Label - ${i+1}`} name={`source_label-${i}`} onChange={onTextChange} options={join.source_labels} value={join.source_label} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Group - ${i+1}`} name={`dest_group-${i}`} onChange={onTextChange} options={props.selectedDataGroups} value={join.dest_group} labelKey='name' valueKey='_id' />
				</FormRowItem>
				<FormRowItem>
					<FormInputSelect label={`Destination Label - ${i+1}`} name={`dest_label-${i}`} onChange={onTextChange} options={join.dest_labels} value={join.dest_label} labelKey='name' valueKey='_id' />
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