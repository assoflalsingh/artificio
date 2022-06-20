import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-enterprise'; // To use enterprise features
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import { FormInputText } from '../../../components/FormElements';
// import { Box } from '@material-ui/core';

const defaultRowData = [{
	"athlete": "Michael Phelps",
	"age": 23,
	"country": "United States",
	"year": 2008,
	"date": "24/08/2008",
	"sport": "Swimming",
	"gold": 8,
	"silver": 0,
	"bronze": 0,
	"total": 8
},{
	"athlete": "Natalie Coughlin",
	"age": 25,
	"country": "United States",
	"year": 2008,
	"date": "24/08/2008",
	"sport": "Swimming",
	"gold": 1,
	"silver": 2,
	"bronze": 3,
	"total": 6
},{
	"athlete": "Aleksey Nemov",
	"age": 24,
	"country": "Russia",
	"year": 2000,
	"date": "01/10/2000",
	"sport": "Gymnastics",
	"gold": 2,
	"silver": 1,
	"bronze": 3,
	"total": 6
},{
	"athlete": "Alicia Coutts",
	"age": 24,
	"country": "Australia",
	"year": 2012,
	"date": "12/08/2012",
	"sport": "Swimming",
	"gold": 1,
	"silver": 3,
	"bronze": 1,
	"total": 5
}];

const colDefs = [{headerName: 'Test Header', children: [
	{
		// headerName: 'Athlete',
		field: 'athlete',
		minWidth: 180,
		headerCheckboxSelection: true,
		headerCheckboxSelectionFilteredOnly: true,
		checkboxSelection: true,
		rowDrag: true,
	 },
	 { field: 'age',
	 cellStyle: params => {
		 if (+params.value < 18) {
			 //mark police cells as red
				 return {backgroundColor: '#aaa'};
			 }
			 return null;
		 }
	 },
	 { field: 'country', minWidth: 150 },
	 { field: 'year' }, //, rowGroup: true
	 { field: 'date', minWidth: 150 },
	 { field: 'sport', minWidth: 150 },
	 { field: 'gold' },
	 { field: 'silver' },
	 { field: 'bronze' },
	 { field: 'total' },
	 //  {field: 'make', headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,},
	 //  {field: 'model'},
	 //  {field: 'price', type: 'numberColumn'} //filter: true, except test search box
 ]}];

const appendZero = (val) => {
	return (val <= 9 ? '0': '')+val;
}

let dt = new Date();
const today = `${appendZero(dt.getDate())}/${appendZero(dt.getMonth()+1)}/${dt.getFullYear()}`;

const DvAgGrid = (props) => {
 	const gridRef = useRef(); // Optional - for accessing Grid's API
 	const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
	 // Each Column Definition results in one Column.
 	const [columnDefs, setColumnDefs] = useState([]);

 // DefaultColDef sets props common to all Columns
 const defaultColDef = useMemo(()=> ({
	 sortable: true,
	 resizable: true,
	 enableRowGroup: true,
	 editable: true,
	 // make every column use 'text' filter by default
     filter: 'agTextColumnFilter',
     // enable floating filters by default
     floatingFilter: true,
   }), []);

const getRowStyle = useCallback(params => {
	if (params.data?.year === 2000) {
			return { background: '#ccc' };
	}
},[]);

const autoGroupColumnDef = useMemo(() => {
	return {
		headerName: 'Year Group',
		field: 'year',
		cellRenderer: 'agGroupCellRenderer',
		cellRendererParams: {
			checkbox: true,
		},
	};
}, []);

// const statusBar = useMemo( ()=> ({
// 	statusPanels: [
// 			{
// 					statusPanel: 'agTotalAndFilteredRowCountComponent',
// 					align: 'left',
// 			}
// 	]
// }),[]);

 // Example of consuming Grid Event
const addColToGrid = useCallback((clickedCol) => {
	// setColumnDefs(prevData => {
	// 	let data = prevData.map((d) => {
	// 		let childrenObj = [...d.children, {field: 'Test Col'}];
	// 		d.children = childrenObj;
	// 		return d;
	// 	});
	// 	gridRef.current.api.setColumnDefs(data);
	// 	 console.log(data);
	// 	return [...data];
	// });

	let data = columnDefs.map((d) => {
		let colIndex = d.children.findIndex((elem) => elem.field === clickedCol);
		console.log(colIndex);
		let childrenObj = [...d.children];
		childrenObj.splice(colIndex, 0, {field: 'New Col'});
		d.children = childrenObj;
		return d;
	});
	gridRef.current.api.setColumnDefs(data);
 }, []);

 // Example load data from sever
 useEffect(() => {
  //  fetch('https://www.ag-grid.com/example-assets/row-data.json')
	// fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
  //  .then(result => result.json())
  //  .then(rowData => setRowData(rowData))
 }, []);

 // Example using Grid's API
 const addRowToGrid = useCallback((atIndex = 0, newRow = {}) => {
	if(!newRow.hasOwnProperty('athlete')){
	 	newRow = {
			"athlete": "(blank)",
			"age": 0,
			"country": "Canada",
			"year": dt.getFullYear(),
			"date": today, //"20/02/2020",
			"sport": "",
			"gold": 0,
			"silver": 0,
			"bronze": 0,
			"total": 0
	 	};
	}
	setRowData(prevData => {
		let updatedData = [...prevData];
		updatedData.splice(atIndex, 0, newRow);
		return [...updatedData];
	});

  // console.log(gridRef.current.api); 
	// gridRef.current.api.deselectAll();
 }, []);

 // Example using Grid's API
 const removeRowById = useCallback((rowId) => {
	setRowData(prevData => {
		let updatedData = [...prevData];
		updatedData.splice(rowId,1);
		return [...updatedData];
	});
 }, []);

const getContextMenuItems = useCallback((params) => {
	var result = [
		{
			name: 'Duplicate Row',
			action: () => {
				addRowToGrid((+params.node?.rowIndex + 1), params.node?.data);
			}
		},
		{
			// custom item
			name: 'Insert Row',
			subMenu: [{
				// custom item
				name: 'Insert Above "' + params.node?.data[columnDefs[0].children[0].field] + '" row',
				action: () => {
					addRowToGrid(+params.node.rowIndex);
				},
			},{
				// custom item
				name: 'Insert Below "' + params.node?.data[columnDefs[0].children[0].field] + '" row',
				action: () => {
					addRowToGrid(+params.node.rowIndex + 1);
				},
			}],
		},
		{
			// custom item
			name: 'Delete "' + params.node?.data[columnDefs[0].children[0].field] + '" row',
			action: () => {
				removeRowById(params.node.rowIndex);
			},
			cssClasses: ['redFont', 'bold'],
			// disabled: true,
			// icon: '',
			tooltip: 'Delete Row',
			// subMenu: [{},{}],
		},
		{
			name: 'Insert Column',
			action: () => {
				// console.log(params.column.colId);
				addColToGrid(params.column.colId);
			},
		},
		'separator',
		...params.defaultItems
	];
	return result;
}, []);

const onQuickFilterChanged = useCallback((e) => {
	if(e.target) {
		gridRef.current.api.setQuickFilter(e.target.value);
	}
}, []);

const onCellValueChanged = useCallback((event) => {
	console.log(event.rowIndex, event.oldValue, event.newValue);
}, []);

useEffect(() => {
	// console.log(props.gridata);
	let rows = [];
	let gridData = props.gridata.map(d => {
		let prepareData = {headerName: d.group_name.replaceAll("_"," "), children: {}};
		if(d.labels.length > 0){
			let cols = Object.keys(d.labels[0]);
				prepareData.children = cols.map((col) => {
					return {field: col};
				});
			rows = rows.concat(d.labels);
		}
		return prepareData;
	});
	setColumnDefs(gridData);
	setRowData(rows);
},[props.gridata]);

console.log('rowData', rowData);
console.log('rowData', rowData.length > 0);
if(rowData.length < 1){
	return <div style={{
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#383838",
    opacity: "0.8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: "1000",
  }}>No Data found to render with grid.</div>;
}

return (
	<div style={{ marginTop: '16px'}}>
		{/* Example using Grid's API */}
		{/* <Form>
			<FormRow>
		<FormRowItem> */}
					{rowData.length > 0 && <FormInputText label="Quick Search" name='quick_search' onChange={onQuickFilterChanged}/>}
				{/* </FormRowItem>
			</FormRow>
		</Form> */}

		{/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
		{rowData.length > 0 && <div className="ag-theme-alpine" style={{ height: '90vh'}}> 
			<AgGridReact
				ref={gridRef} // Ref for accessing Grid's API
				rowData={rowData} // Row Data for Rows
				columnDefs={columnDefs} // Column Defs for Columns
				defaultColDef={defaultColDef} // Default Column Properties
				getRowStyle={getRowStyle}
				rowGroupPanelShow='always' // possible options: 'never', 'always', 'onlyWhenGrouping'
				rowDragManaged={true}
				rowDragEntireRow={true} // AG Grid: Setting `rowDragEntireRow: true` in the gridOptions doesn't work with `enableRangeSelection: true`
				enableRangeSelection={true}
				animateRows={true} // Optional - set to 'true' to have rows animate when sorted
				onCellValueChanged={onCellValueChanged}
				// getContextMenuItems={getContextMenuItems}
				multiSortKey={'ctrl'}
				rowSelection='multiple' // Options 'single', 'multiple' - allows click selection of rows
				// autoGroupColumnDef={autoGroupColumnDef}
				// groupSelectsChildren={true}
				// gridOptions={{ // rowDrag is not working with gridOptions when enableRangeSelection=true but rowDragEntireRow works.
				// 	pagination: true,
				// }}
				// sideBar={['columns','filters']}
				// statusBar={statusBar}
				/>
		</div>}
	</div>
);
};

export default DvAgGrid;