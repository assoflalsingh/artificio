import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, MenuItem, Popover, Snackbar, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import {RefreshIconButton} from '../../components/CustomButtons';
import TableFilterPanel from "../../components/TableFilterPanel";
import {Stacked, StackItem} from '../../components/Stacked';
import { AnnotateTool } from './AnnotateTool';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import {ImageAnnotationDialog} from "../../components/ImageAnnotation/ImageAnnotationDialog";

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


export default function Results() {
  const classes = useStyles();
  const [stackPath] = useState('home');
  const [annotateOpen, setAnnotateOpen] = useState(false);
	const [annotateOpenV2, setAnnotateOpenV2] = useState(false);
  const api = getInstance(localStorage.getItem('token'));
  const [massAnchorEl, setDownloadAnchorEl] = useState();
  const [rowsSelected, setRowsSelected] = useState([]);
  const [] = useState(false);
  const [pageMessage, setPageMessage] = useState(null);
  const [datalistMessage, setDatalistMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [unFilteredData, setUnFilteredData] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(1);

  const columns = [
    {
      name: "file",
      label: "Filename",
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
      label: "Page",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "datagroup_name",
      label: "Data group",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "img_status",
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
      label: "Date time",
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
    filterType: 'dropdown',
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
    isRowSelectable: (dataIndex)=>{
      return datalist[dataIndex].img_status == "completed" ? false : true;
    }
  };

  const onDownloadMenuClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDownloadAnchorEl(null);
  };

  const parseGetDataList = (data) => {
  //   {
  //     "_id": "5f9c3594920d9e5fad533c19",
  //     "timestamp": "2020-10-30T15:47:32",
  //     "id": 202010305407,
  //     "created_by": "name last_name",
  //     "file": "skipper_logo.jpg",
  //     "images": [
  //         {
  //             "page_1": {
  //                 "img_name": "202010305407-skipper_logo.jpg",
  //                 "img_thumb": "thumbnail_202010305407-skipper_logo.jpg",
  //                 "img_status": "new",
  //                 "datagroup_id": "",
  //                 "datagroup_name": ""
  //             },
  //             "page_2": {
  //                 "img_name": "202010305407-skipper_logo1.jpg",
  //                 "img_thumb": "thumbnail_202010305407-skipper_logo1.jpg",
  //                 "img_status": "new",
  //                 "datagroup_id": "",
  //                 "datagroup_name": ""
  //             }
  //         }
  //     ],
  //     "account": 12345,
  //     "status": "new",
  //     "idStr": "202010305407"
  // }

    let newData = [];
    data.forEach((datum)=>{
      let newRecord = {
        _id: datum._id,
        timestamp: datum.timestamp,
        created_by: datum.created_by,
        file: datum.file,
      }

      Object.keys(datum.images).forEach((page)=>{
        newData.push({
          ...newRecord,
          struct_id:datum.images[page].struct_id,
          img_json:datum.images[page].img_json,
          page_no: page,
          image_name: datum.images[page].img_name,
          img_status: datum.images[page].img_status,
          datagroup_id: datum.images[page].datagroup_id,
          datagroup_name: datum.images[page].datagroup_name,
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
    api.post(URL_MAP.GET_DATA_LIST, {status: ['in-process', 'completed']})
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
  const postDownloadRequest = (type) => {
    handleClose();
    if(!datalist[rowsSelected[0]]['datagroup_id']) {
      setAjaxMessage({
        error: true, text: "Datagroup must be assigned.",
      });
      return;
    }
    setPageMessage('Requesting...');
    api.post(URL_MAP.SCHEDULE_DOWNLOAD_REQUEST, {
      type: type,
      datagroup_id: datalist[rowsSelected[0]]['datagroup_id'],
    }).then(()=>{
      setAjaxMessage({
        error: false, text: 'Request success. Please check downloads !!',
      });
    }).catch((error)=>{
      if(error.response) {
        setAjaxMessage({
          error: true, text: error.response.data.message,
        });
      } else {
        console.error(error);
      }
    }).then(()=>{
      setPageMessage(null);
    })
  }

  useEffect(()=>{
    fetchDataList();
  },[]);

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
							<Button disabled={rowsSelected.length === 0} onClick={()=>{setAnnotateOpenV2(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button>
            </Box>
          </Box>
          <>
          <Box display="flex">
              <Button disabled={rowsSelected.length == 0} variant='outlined' style={{height: '2rem'}} size="small"
                endIcon={<ChevronRightOutlinedIcon />} onClick={onDownloadMenuClick}>Download</Button>
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {datalistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{datalistMessage}</Typography></>}
              <TableFilterPanel refreshCounter={refreshCounter} unFilteredData={unFilteredData} disabled={unFilteredData.length === 0} onApplyFilter={filterDataList} coloumnDetails={columns} onResetAllFilters={ResetAllFilters} />
              </Box>
              <Popover
                open={Boolean(massAnchorEl)}
                onClose={handleClose}
                anchorEl={massAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={()=>{setDownloadAnchorEl(null); postDownloadRequest('csv')}}>CSV</MenuItem>
              </Popover>
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
    <AnnotateTool open={annotateOpen} onClose={()=>{setAnnotateOpen(false)}} api={api} getAnnotateImages={()=>rowsSelected.map((i)=>datalist[i])} inReview={true} />
		<ImageAnnotationDialog
			open={annotateOpenV2}
			onClose={()=>{setAnnotateOpenV2(false)}}
			api={api}
			getImages={()=>rowsSelected.map((i)=>datalist[i])}
			inReview={true}
		/>
    </>
  )
}
