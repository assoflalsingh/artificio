import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, Snackbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import Alert from '@material-ui/lab/Alert';
import { MemoryRouter, Route, Switch as RouteSwitch, useHistory, useLocation, Link } from 'react-router-dom';
import {CompactButton} from '../../components/CustomButtons';
import DataSets from './DataSets';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto'
  },
  ml1: {
    marginLeft: '1rem',
  },
  root: {
    position: 'relative'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  contentColumn: {
    textAlign: "center",
    border: "solid 1px gray",
    borderRadius: "10px",
    height: "40px",
    padding: "0px",
    fontSize: "18px",
    maxWidth: "120px"
  },
  headingColumn:{
    height: "50px",
    color: "gray",
    fontSize: "18px",
    fontWeight: "bold"
  },
  noBorder: {
    border: "none"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


function DataSetList({history}) {
  const classes = useStyles();
  const [rowsSelected, setRowsSelected] = useState([]);
  const [pageMessage, setPageMessage] = useState(null);
  const [dataSetlist, setDataSetlist] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  const [dataSetListMessage, setDataSetlistMessage] = useState(null);
  const api = getInstance(localStorage.getItem('token'));

  const columns = [
    {
      name: "data_set_id",
      label: "Data set ID",
      options: {
      filter: true,
      sort: true,
      draggable: true,
      customBodyRender: (value, tableMeta)=>{
        return <Link  label={value} to={{pathname: "/create-dataset", params: { data_set_id:value, desc:tableMeta.rowData[1],app_usage:tableMeta.rowData[3], _id:tableMeta.rowData[4]}}}>
                {value}
            </Link>;
      }
      },
      type:"string"
    },
    {
      name: "desc",
      label: "Description",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      type:"string"
    },
    {
      name: "app_id",
      label: "Application ID",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      type:"string"
    },
    {
      name: "app_usage",
      label: "Application Usage",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRender: (value)=>{
          return typeof value === "object" ? Object.values(value).join(", ") : value.join(", ")
        }
      },
    },
    {
      name: "_id",
      label: "ID",
      options: {
        display: false,
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    searchPlaceholder: 'Enter keywords',
    filterType: 'checkbox',
    elevation: 0,
    filter: false,
    print: false,
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    sortOrder: {
      name: 'timestamp',
      direction: 'desc'
    },
    responsive: 'vertical',
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
    rowsSelected: rowsSelected,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelectedNow)=>{
      setRowsSelected(rowsSelectedNow)
    }
  };

  const hideErrorMessage = () => {
    setAjaxMessage(null)
  }

  const fetchDataList = () => {
    setDataSetlistMessage('Loading data...');
    setDataSetlist([]);
    setRowsSelected([]);
    api.get(URL_MAP.GET_DATA_SETS)
      .then((res)=>{
        let data = res.data.data;
        setDataSetlist(data);
      })
      .catch((err)=>{
        setAjaxMessage({error: true, text: "Sorry, there is some technical issue while fetching the data please try after some time."});
      })
      .then(()=>{
        setDataSetlistMessage(null);
      });
   }
    useEffect(() => {
        fetchDataList();
    }, []);

  return (
    <>
    <Backdrop className={classes.backdrop} open={Boolean(pageMessage)}>
        <CircularProgress color="inherit" />
        <Typography style={{marginLeft: '0.25rem'}} variant='h4'>{pageMessage}</Typography>
      </Backdrop>
      <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} onClose={hideErrorMessage}>
        {ajaxMessage && <Alert onClose={hideErrorMessage} severity={ajaxMessage.error ? "error" : "success"}>
          {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
        </Alert>}
      </Snackbar>
      <Box style={{display: 'flex', flexWrap: 'wrap', margin: "15px 0px"}}>
        <Typography color="primary" variant="h6">Data sets</Typography>
        <CompactButton className={classes.ml1} label="Create Data set" variant="contained" color="primary"
          onClick={()=>{history.push('create-dataset')}} />
      </Box>
      <Backdrop className={classes.backdrop} open={Boolean(pageMessage)}>
        <CircularProgress color="inherit" />
        <Typography style={{marginLeft: '0.25rem'}} variant='h4'>{pageMessage}</Typography>
      </Backdrop>
      <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} onClose={hideErrorMessage}>
        {ajaxMessage && <Alert onClose={hideErrorMessage} severity={ajaxMessage.error ? "error" : "success"}>
          {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
        </Alert>}
      </Snackbar>
          {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
          {dataSetListMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{dataSetListMessage}</Typography></>}
      <MUIDataTable
        title={<>
          <Typography color="primary" variant="h8">Please select Data set(s) for Editing</Typography>
        </>}
        data={dataSetlist}
        columns={columns}
        options={options}
      />
    </>
  )
}

function RouterBackButton() {
  const history = useHistory();
  const location = useLocation();
  if(location.pathname === "/") {
    return <></>
  }
  return (
    <Button startIcon={<ChevronLeftOutlinedIcon />} onClick={()=>{history.goBack();}}>Back</Button>
  );
}

export default function() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <MemoryRouter>
        <RouterBackButton />
        <RouteSwitch>
          <Route exact path="/" component={DataSetList}></Route>
          <Route exact path="/create-dataset" component={DataSets}></Route>
        </RouteSwitch>
      </MemoryRouter>
    </Box>
  );
}
