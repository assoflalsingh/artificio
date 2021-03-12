import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, MenuItem, Popover, Snackbar, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import {ImageAnnotationDialog} from "../../components/ImageAnnotation/ImageAnnotationDialog";
import MUIDataTable from "mui-datatables";
import {RefreshIconButton} from '../../components/CustomButtons';
import TableFilterPanel from "../../components/TableFilterPanel";
import {Stacked, StackItem} from '../../components/Stacked';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';

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
}));


export default function Results(props) {
  const {uploadCounter} = props;
  const classes = useStyles();
  const [stackPath] = useState('home');
  const [annotateOpen, setAnnotateOpen] = useState(false);
	const api = getInstance(localStorage.getItem('token'));
  const [rowsSelected, setRowsSelected] = useState([]);
  const [pageMessage, setPageMessage] = useState(null);
  const [datalistMessage, setDatalistMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [unFilteredData, setUnFilteredData] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(1);

  const columns = [
    {
      name: "file",
      label: "File name",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "page_no",
      label: "Page no",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "data_set_value",
      label: "Data set",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "app_id",
      label: "Source",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
        name: "struct_name",
        label: "Data structure",
        options: {
          filter: true,
          sort: true,
          draggable: true
        },
        possibleComparisons: ["eq", "bw", "ct", "ew"],
        type:"string"
      },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value)=>{
          return <Chip size="small" label={value?.replace('-', ' ').toUpperCase()} variant="outlined" />;
        }
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "timestamp",
      label: "Created on",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value)=>{
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        }
      },
      possibleComparisons: ["gt", "lt","drange"],
      type:"datetime"
    },
  ];

  const options = {
    selectableRows: 'multiple',
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
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
    rowsSelected: rowsSelected,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelectedNow)=>{
      setRowsSelected(rowsSelectedNow)
    },
    isRowSelectable: ()=> true
  };



  const parseGetDataList = (data) => {
    let newData = [];
    data.forEach((datum)=>{
      let newRecord = {
        _id: datum._id,
        timestamp: datum.timestamp,
        created_by: datum.created_by,
        file: datum.file,
        status: datum.status,
      }

      Object.keys(datum.images).forEach((page)=>{
        newData.push({
          ...newRecord,
          app_id: datum.images[page].app_id === "10" ? "Manual upload" : (datum.images[page].app_id === "11" ? "Email" : "Other"),
          struct_id:datum.images[page].struct_id,
          img_json:datum.images[page].img_json,
          page_no: page,
          image_name: datum.images[page].img_name,
          struct_name: datum.images[page].struct_name,
          data_set_value: datum.images[page].data_set_value,
          img_thumb: datum.images[page].img_thumb
        });
      });
    });
    return newData;
  }

  const fetchDataList = () => {
    setDatalistMessage('Loading data...');
    setDatalist([]);
    setRowsSelected([]);
    api.post(URL_MAP.GET_DATA_SETS_RESULTS, {status: [], app_id: ["10", "11"]})
      .then((res)=>{
        let data = res.data.data;
        let contr = refreshCounter+1;
        setRefreshCounter(contr);
        let parsedResult = parseGetDataList(data.data_lists);
        setUnFilteredData([...parsedResult]);
        setDatalist(parsedResult);
      })
      .catch((err)=>{
        console.error(err);
      })
      .then(()=>{
        setDatalistMessage(null);
      });
  }
  const filterDataList = (filteredResult) => {
    setDatalistMessage('Filtering data...');
    setDatalist([]);
    setRowsSelected([]);
    setDatalist(filteredResult);
    setDatalistMessage(null);
  }
  const ResetAllFilters = () => {
    setDatalist([...unFilteredData]);
  }
  const closeAnnotationTool = (wasUpdated) => {
    if(wasUpdated){
      fetchDataList();
    }
    setAnnotateOpen(false)
  }
  useEffect(() => {
    if (!uploadCounter) return
      fetchDataList();
  }, [uploadCounter]);
  
  return (
    <>
    <Box className={classes.root}>
      <Stacked to={stackPath}>
        <StackItem main path='home'>
          <Backdrop className={classes.backdrop} open={Boolean(pageMessage)}>
            <CircularProgress color="inherit" />
            <Typography style={{marginLeft: '0.25rem'}} variant='h4'>{pageMessage}</Typography>
          </Backdrop>
          <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} >
            {ajaxMessage && <Alert onClose={()=>{setAjaxMessage(null)}} severity={ajaxMessage.error ? "error" : "success"}>
              {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
            </Alert>}
          </Snackbar>
          <Box display="flex" style={{margin: "15px 0px"}}>
            <Typography color="primary" variant="h6">Results</Typography>
            <RefreshIconButton className={classes.ml1} onClick={()=>{fetchDataList()}}/>
            <Box className={classes.rightAlign}>
              {/* <Button onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button> */}
							<Button disabled={rowsSelected.length === 0} onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button>
            </Box>
          </Box>
          <>
          <Box display="flex">
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {datalistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{datalistMessage}</Typography></>}
              <TableFilterPanel refreshCounter={refreshCounter} unFilteredData={unFilteredData} disabled={unFilteredData.length === 0} onApplyFilter={filterDataList} coloumnDetails={columns} onResetAllFilters={ResetAllFilters} />
          </Box>
            </>
          <MUIDataTable
            title={<>
              <Typography color="primary" variant="h8">Please select file(s) for review</Typography>
            </>}
            data={datalist}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
    <ImageAnnotationDialog
			open={annotateOpen}
			onClose={(wasUpdated)=>{closeAnnotationTool(wasUpdated)}}
			api={api}
			getImages={()=>rowsSelected.map((i)=>datalist[i])}
			inReview={true}
		/>
    </>
  )
}
