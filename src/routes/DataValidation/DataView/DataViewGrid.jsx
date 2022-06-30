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
