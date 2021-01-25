import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Popover, Snackbar, Switch, Tooltip, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import SyncIcon from '@material-ui/icons/Sync';
import {CompactAddButton, CompactButton, RefreshIconButton} from '../../components/CustomButtons';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import { AnnotateTool } from './AnnotateTool';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import { FormInputSelect } from '../../components/FormElements';
import Alert from '@material-ui/lab/Alert';
import {ImageAnnotationDialog} from "../../components/ImageAnnotation/ImageAnnotationDialog";
import DataGroup from './DataGroup';
import Labels from './Labels';
import { MemoryRouter, Route, Switch as RouteSwitch, useHistory, useLocation } from 'react-router-dom';

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
      api.get(URL_MAP.GET_DATAGROUP_NAMES)
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
        <Button onClick={()=>{onClose(); onOK('datagroup', datagroup._id, datagroup.name)}} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function AsssignDataStructure({open, onClose, onOK, api}) {
  const [structOpts, setStructOpts] = useState();
  const [struct, setStruct] = useState(null);
  const [opLoading, setOpLoading] = useState(false);

  useEffect(()=>{
    if(open) {
      setOpLoading(true);
      api.get(URL_MAP.GET_STRUCTURES)
        .then((res)=>{
          let data = res.data.data;
          setStructOpts(data);
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
        <FormInputSelect hasSearch label="Assign structure"
          onChange={(e, value)=>{setStruct(value)}} loading={opLoading} value={struct} options={structOpts}
              labelKey='name' valueKey='_id' />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={()=>{onClose(); onOK('structure', struct._id, struct.name)}} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DataList({history}) {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const [annotateOpen, setAnnotateOpen] = useState(false);
	const [annotateOpenV2, setAnnotateOpenV2] = useState(false);
  const api = getInstance(localStorage.getItem('token'));
  const [massAnchorEl, setMassAnchorEl] = useState();
  const [rowsSelected, setRowsSelected] = useState([]);
  const [showAssignDG, setShowAssignDG] = useState(false);
  const [showAssignStruct, setShowAssignStruct] = useState(false);
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
      name: "struct_name",
      label: "Data structure",
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

  const onMassMenuClick = (event) => {
    setMassAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMassAnchorEl(null);
  };
  const sendFileDetailsForExtraction = () => {
    let errorMessage = "";
    let massExtractionPayload = {
      data_lists: []
    };
    rowsSelected.map((row) => {
      if(datalist[row].img_status!=="ready" && !datalist[row].struct_name) {
        errorMessage="Structure id and Ready Status is missing for the selection."
        setAjaxMessage({
          error: true, text: errorMessage
        })
      }
      else if(datalist[row].img_status!=="ready" && datalist[row].struct_name)
      {
        errorMessage="Status is not Ready for the selection"
        setAjaxMessage({
          error: true, text: errorMessage
        })
      }
      else if(datalist[row].img_status==="ready" && !datalist[row].struct_name)
      {
        errorMessage="Structure id is missing for the selection."
        setAjaxMessage({
          error: true, text: errorMessage
        })
      }
      else {
        let existingFileIndexWithSameId = massExtractionPayload.data_lists.findIndex(o => o.id === datalist[row]._id);
        if(massExtractionPayload.data_lists && existingFileIndexWithSameId >= 0)
        {
          massExtractionPayload["data_lists"][existingFileIndexWithSameId].images.push({
              struct_id: datalist[row].struct_name,
              datagroup_name: datalist[row].datagroup_name,
              datagroup_id:datalist[row].datagroup_id,
              img_json:datalist[row].img_json,
              img_status:datalist[row].img_status,
              img_name:datalist[row].img_name,
              page_no: datalist[row].page_no
          })
        }
        else
        {
        massExtractionPayload.data_lists.push(
          {
            id: datalist[row]._id,
            images:[{ 
              struct_id: datalist[row].struct_name,
              datagroup_name: datalist[row].datagroup_name,
              datagroup_id:datalist[row].datagroup_id,
              img_json:datalist[row].img_json,
              img_status:datalist[row].img_status,
              img_name:datalist[row].img_name,
              page_no: datalist[row].page_no
            }]
          }
        )
        }
      }
    })
    if(massExtractionPayload.data_lists.length>0 && !errorMessage) {
      console.log(massExtractionPayload);
      api.post(URL_MAP.MASS_EXTRACTION_API, {
        ...massExtractionPayload
      }).then((res)=>{
        setAjaxMessage({
          error: false, text: 'Request in progress !!',
        });
      }).catch((error)=>{
        if(error.response) {
          setAjaxMessage({
            error: true, text: error?.response?.data.message || "There is some technial issue with this request please try again in some time.",
          });
        } else {
          setAjaxMessage({
            error: true, text: error?.response?.data.message || "There is some technial issue with this request please try again in some time.",
          });
        }
      }).then(()=>{
        setPageMessage(null);
      })
    }
  }
  const onAssignData = (type, id, name) => {
    handleClose();
    setPageMessage('Assigning...');
    let data_lists = {};
    rowsSelected.map((i)=>{
      let row = datalist[i];
      data_lists[row._id] = data_lists[row._id] || [];
      data_lists[row._id].push(row.page_no);
    });

    api.post(URL_MAP.ASSIGN_DATA, {
      type: type,
      datum: id,
      data_lists: data_lists
    }).then((res)=>{
      setAjaxMessage({
        error: false, text: 'Assignment success !!',
      });
      let newDatalist = [...datalist];
      rowsSelected.forEach((i)=>{
        if(type === 'datagroup') {
          newDatalist[i].datagroup_name = name;
        } else {
          newDatalist[i].struct_name = name;
        }
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

  const onDeleteFiles = async () => {
    setMassAnchorEl(null);
    setPageMessage('Deleting the files...');
    let allResp = await Promise.all(
      rowsSelected.map(async(i)=>{
        let row = datalist[i];
        try {
          await api.post(URL_MAP.UPDATE_FILE_STATUS, {
            "document_id": row._id,
            "page_no": row.page_no,
            status: "deleted"
          });
          return i;
        } catch (error) {
          return error;
        }
      })
    );
    let newDatalist = datalist.filter((v, i)=>allResp.indexOf(i) == -1);

    for(let i=0; i<allResp.length; i++) {
      if(typeof(allResp[i]) != 'number') {
        let error = allResp[i];
        if(error.response) {
          setAjaxMessage({
            error: true, text: error.response.data.message,
          });
        } else {
          console.error(error);
        }
      }
    }
    setRowsSelected([]);
    setDatalist(newDatalist);
    setPageMessage(null);
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
          struct_name: datum.images[page].struct_name,
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

  const hideErrorMessage = () => {
    setAjaxMessage(null)
  }
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
      <Box style={{display: 'flex', flexWrap: 'wrap'}}>
        <Typography color="primary" variant="h6">Data List</Typography>
        <RefreshIconButton className={classes.ml1} title="Refresh data list" onClick={()=>{fetchDataList()}}/>
        <CompactButton className={classes.ml1} label="Labels" variant="contained" color="primary"
          onClick={()=>{history.push('labels')}} />
        <CompactButton className={classes.ml1} label="Data groups" variant="contained" color="primary"
          onClick={()=>{history.push('dg')}} />
        <Box className={classes.rightAlign}>
          {/* <Button onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Old Annotation</Button> */}
          <Button onClick={()=>{setAnnotateOpenV2(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Annotation</Button>
          {/* <ButtonGroup className={classes.ml1}>
            <Button>Date range</Button>
            <Button>Search data</Button>
          </ButtonGroup> */}
        </Box>
      </Box>
      <AsssignDataGroup open={showAssignDG} onClose={()=>{setShowAssignDG(false)}}
        onOK={onAssignData} api={api}/>
      <AsssignDataStructure open={showAssignStruct} onClose={()=>{setShowAssignStruct(false)}}
        onOK={onAssignData} api={api}/>
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
            <MenuItem onClick={()=>{setMassAnchorEl(null); setShowAssignDG(true)}}>Assign data group</MenuItem>
            <MenuItem onClick={()=>{setMassAnchorEl(null); setShowAssignStruct(true)}}>Assign data structure</MenuItem>
            <MenuItem onClick={()=>{sendFileDetailsForExtraction(); }}>Mass data extraction</MenuItem>
            <MenuItem onClick={onDeleteFiles}>Delete files</MenuItem>
          </Popover>
        </>}
        data={datalist}
        columns={columns}
        options={options}
      />
      <AnnotateTool open={annotateOpen} onClose={()=>{setAnnotateOpen(false)}} api={api}
                getAnnotateImages={()=>rowsSelected.map((i)=>datalist[i])} inReview={false}/>

      <ImageAnnotationDialog
        open={annotateOpenV2}
        onClose={()=>{setAnnotateOpenV2(false)}}
        api={api}
        getImages={()=>rowsSelected.map((i)=>datalist[i])}
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
          <Route exact path="/" component={DataList}></Route>
          <Route path="/labels" component={Labels}></Route>
          <Route path="/dg" component={DataGroup}></Route>
        </RouteSwitch>
      </MemoryRouter>
    </Box>
  );
}
