import React, { useEffect } from "react";
import { Dialog } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import DvAgGrid from "./DvAgGrid";
import { URL_MAP } from '../../../others/artificio_api.instance';
import useApi from "../../../hooks/use-api";
import { useState } from "react";
import Loader from "../../../components/ImageAnnotation/helpers/Loader";

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
},{
	"athlete": "Michael Mojito",
	"age": 23,
	"country": "Canada",
	"year": 2020,
	"date": "24/08/2020",
	"sport": "ParaGliding",
	"gold": 4,
	"silver": 4,
	"bronze": 4,
	"total": 12
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

const colDefs = [{group_name: 'Players Details', labels: [
	{
		field: 'athlete', chartDataType: 'category',
		// headerCheckboxSelection: true,
		// headerCheckboxSelectionFilteredOnly: true,
		// checkboxSelection: true,
		rowDrag: true,
  },
  { field: 'age', chartDataType: 'series',
    cellStyle: params => {
		  if (+params.value < 18) {
			  //mark police cells as red
        return {backgroundColor: '#aaa'};
      }
      return null;
    }
	 },
	 { field: 'country', chartDataType: 'category', minWidth: 150 },
	 { field: 'year', chartDataType: 'time', }, //, rowGroup: true
	 { field: 'date', chartDataType: 'excluded', minWidth: 150 }]},
	 {group_name: 'Sports Detail', labels: [
	 { field: 'sport', chartDataType: 'series', minWidth: 150 },
	 { field: 'gold', chartDataType: 'series' },
	 { field: 'silver', chartDataType: 'series' },
	 { field: 'bronze', chartDataType: 'series' },
	 { field: 'total' },
 ]}];

const DataViewGrid = (props) => {
  const {isLoading, apiRequest, error} = useApi();
  const [dataViewData, setDataViewData] = useState([]);

  useEffect(() => {
    if(props.dataViewId.length > 0){
      apiRequest({url: `${URL_MAP.GET_DATA_VIEW_DATA}${props.dataViewId}/`}, (resp) => {
        setDataViewData(resp);
      });
      error && console.log(error);
    }
    // let testData = {headers: colDefs, rows: defaultRowData};
    // setDataViewData(testData);
  },[props.dataViewId, apiRequest, error]);

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      // disableBackdropClick
      disableEscapeKeyDown
    >
      {!isLoading && <DvAgGrid gridata={dataViewData} />}
      {isLoading && <Loader />}
      <IconButton
        variant="outlined"
        onClick={props.onClose}
        style={{ zIndex: 9, top: 0, right: 0, position: "absolute" }}
      >
        <DeleteIcon style={{ fontSize: "1.2rem" }} />
      </IconButton>
    </Dialog>
  );
};

export default DataViewGrid;
