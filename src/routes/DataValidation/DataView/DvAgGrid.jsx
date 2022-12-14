import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-enterprise'; // To use enterprise features
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import { FormInputText } from '../../../components/FormElements';

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

useEffect(() => {
	let rows = [];
	let gridColsDef = props.gridata.headers?.map((header) => {
		return {headerName: header.group_name, children: header.labels};
	});
	rows = props.gridata.rows?.length > 0 ? props.gridata.rows : [];
	setColumnDefs(gridColsDef);
	setRowData(rows);
},[props.gridata]);

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
	console.log('columnDefs[0]?.children[0]?.field ',columnDefs[0]?.children[0]?.field);
	 var result = [
		{
			// custom item
			// name: 'Delete "' + params.node?.data[columnDefs[0]?.children[0]?.field] + '" row',
			name: 'Delete row',
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
				// name: 'Insert Above "' + params.node?.data[columnDefs[0]?.children[0]?.field] + '" row',
				name: 'Insert Above this row',
				action: () => {
					addRowToGrid(+params.node.rowIndex);
				},
			},{
				// custom item
				// name: 'Insert Below "' + params.node?.data[columnDefs[0]?.children[0]?.field] + '" row',
				name: 'Insert Below this row',
				action: () => {
					addRowToGrid(+params.node.rowIndex + 1);
				},
			}],
		},
		{
			name: 'Insert Column',
			action: () => {
				// console.log(params.column.colId);
				addColToGrid(params.column.colId);
			},
		},
		'separator',
		'chartRange',
		'separator',
		...params.defaultItems,
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

if(rowData?.length < 1){
	return <div style={{
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // background: "#ccc",
    opacity: "0.8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: "1",
	// color: '#484848',
  }}>No data found.</div>;
}

return (
	<div style={{ marginTop: '16px'}}>
		{/* Example using Grid's API */}
		{/* <Form>
			<FormRow>
		<FormRowItem> */}
					{rowData?.length > 0 && <FormInputText label="Quick Search" name='quick_search' onChange={onQuickFilterChanged}/>}
				{/* </FormRowItem>
			</FormRow>
		</Form> */}

		{/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
		{rowData?.length > 0 && <div className="ag-theme-alpine" style={{ height: '90vh'}}> 
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
				getContextMenuItems={getContextMenuItems}
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