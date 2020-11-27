import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Popover, Snackbar, Tooltip, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import SyncIcon from '@material-ui/icons/Sync';
import {CompactAddButton, CompactButton} from '../../components/CustomButtons';
import CreateDataGroup from './CreateDataGroup';

import {Stacked, StackItem} from '../../components/Stacked';
import CreateLabel from './CreateLabel';
import { AnnotateTool } from './AnnotateTool';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import { FormInputSelect } from '../../components/FormElements';
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

function AsssignDataGroup({open, onClose, onOK, api}) {
  const [datagroupOpts, setDatagroupOpts] = useState();
  const [datagroup, setDatagroup] = useState(null);
  const [opLoading, setOpLoading] = useState(false);

  useEffect(()=>{
    if(open) {
      setOpLoading(true);
      api.get(URL_MAP.GET_DATAGROUPS)
        .then((res)=>{
          let data = res.data.data;
          setDatagroupOpts(data);
        })
        .catch((err)=>{
          console.error(err);
        })
        .then(()=>{
          setOpLoading(false);
        });
    }
  }, [open]);
  return(
    <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={onClose}>
      <DialogContent>
        <FormInputSelect hasSearch label="Assign data group"
          onChange={(e, value)=>{setDatagroup(value)}} loading={opLoading} value={datagroup} options={datagroupOpts}
              labelKey='name' valueKey='_id' />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={()=>{onClose(); onOK(datagroup._id, datagroup.name)}} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function DataList() {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const [annotateOpen, setAnnotateOpen] = useState(false);
  const api = getInstance(localStorage.getItem('token'));
  const [massAnchorEl, setMassAnchorEl] = useState();
  const [rowsSelected, setRowsSelected] = useState([]);
  const [showAssignDG, setShowAssignDG] = useState(false);
  const [pageMessage, setPageMessage] = useState(null);
  const [datalistMessage, setDatalistMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);

  const columns = [
    {
      name: "file",
      label: "Filename",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "page_no",
      label: "Page",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "datagroup_name",
      label: "Data group",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "img_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          return <Chip size="small" label={value?.replace('-', ' ').toUpperCase()} variant="outlined" />;
        }
      },
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "timestamp",
      label: "Date time",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        }
      }
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
    }
  };

  const onMassMenuClick = (event) => {
    setMassAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMassAnchorEl(null);
  };

  const onAssignDatagroup = (id, name) => {
    handleClose();
    setPageMessage('Assigning data group...');
    let data_lists = {};
    rowsSelected.map((i)=>{
      let row = datalist[i];
      data_lists[row._id] = data_lists[row._id] || [];
      data_lists[row._id].push(row.page_no);
    });

    api.post(URL_MAP.ASSIGN_DATAGROUP, {
      datagroup_id: id,
      data_lists: data_lists
    }).then((res)=>{
      setAjaxMessage({
        error: false, text: 'Data group assigned successfully !!',
      });
      let newDatalist = datalist;
      rowsSelected.forEach((i)=>{
        newDatalist[i].datagroup_name = name;
      });
      setDatalist(newDatalist);
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
          page_no: page,
          image_name: datum.images[page].img_name,
          img_status: datum.images[page].img_status,
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
    api.post(URL_MAP.GET_DATA_LIST, {status: ['new', 'ready']})
      .then((res)=>{
        let data = res.data.data;
        setDatalist(parseGetDataList(data.data_lists));
      })
      .catch((err)=>{
        console.error(err);
      })
      .then(()=>{
        setDatalistMessage(null);
      });
  }

  useEffect(()=>{
    fetchDataList();
  },[]);

  return (
    <>
    <Box className={classes.root}>
      <Stacked to={stackPath}>
        <StackItem path='createlabel' hasBack onBack={()=>{setStackPath('home')}}>
          <CreateLabel onCancel={()=>{setStackPath('home')}}/>
        </StackItem>
        <StackItem path='createdg' hasBack onBack={()=>{setStackPath('home')}}>
          <CreateDataGroup onCancel={()=>{setStackPath('home')}}/>
        </StackItem>
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
          <Box display="flex">
            <Typography color="primary" variant="h6">Data List</Typography>
            <Tooltip title="Refresh data list">
              <IconButton size="small" onClick={()=>{fetchDataList()}}><SyncIcon /></IconButton>
            </Tooltip>
            <CompactAddButton className={classes.ml1} color="secondary" label="Create label"
              onClick={()=>{setStackPath('createlabel')}}
              />
            <CompactAddButton className={classes.ml1} color="secondary" label="Create data group" onClick={()=>{setStackPath('createdg')}} />
            <Box className={classes.rightAlign}>
              <CompactButton onClick={()=>{setAnnotateOpen(true)}} startIcon={<PlayCircleFilledIcon color="primary" fontSize='large' />} label='Annotation'/>
              {/* <ButtonGroup className={classes.ml1}>
                <Button>Date range</Button>
                <Button>Search data</Button>
              </ButtonGroup> */}
            </Box>
          </Box>
          <AsssignDataGroup open={showAssignDG} onClose={()=>{setShowAssignDG(false)}}
            onOK={onAssignDatagroup} api={api}/>
          <MUIDataTable
            title={<>
              <Box display="flex">
              <Button disabled={rowsSelected.length == 0} variant='outlined' style={{height: '2rem'}} size="small"
                endIcon={<ChevronRightOutlinedIcon />} onClick={onMassMenuClick}>Mass action</Button>
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {datalistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{datalistMessage}</Typography></>}
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
                <MenuItem onClick={()=>{setMassAnchorEl(null); setShowAssignDG(true)}}>Assign datagroup</MenuItem>
              </Popover>
            </>}
            data={datalist}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
		<ImageAnnotationDialog open={annotateOpen} onClose={()=>{setAnnotateOpen(false)}} api={api} getImages={()=>rowsSelected.map((i)=>datalist[i])}/>
		{/*<AnnotateTool open={annotateOpen} onClose={()=>{setAnnotateOpen(false)}} api={api}*/}
		{/*					getAnnotateImages={()=>rowsSelected.map((i)=>datalist[i])} inReview={false}/>*/}
    </>
  )
}
