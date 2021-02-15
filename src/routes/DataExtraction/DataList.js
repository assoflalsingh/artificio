import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, MenuItem, Popover, Snackbar, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import {CompactButton, RefreshIconButton} from '../../components/CustomButtons';
import TableFilterPanel from "../../components/TableFilterPanel";
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

function DataList(props) {
  const {history, uploadCounter, annotationSuccessCB} = props;
  const classes = useStyles();
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
        sort: true
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
      if(datalist[row].img_status!=="ready" && !datalist[row].struct_id) {
        errorMessage="Structure id and Ready Status is missing for the selection."
        setAjaxMessage({
          error: true, text: errorMessage
        })
      }
      else if(datalist[row].img_status!=="ready" && datalist[row].struct_id)
      {
        errorMessage="Status is not Ready for the selection."
        setAjaxMessage({
          error: true, text: errorMessage
        })
      }
      else if(datalist[row].img_status==="ready" && !datalist[row].struct_id)
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
              struct_id: datalist[row].struct_id,
              datagroup_name: datalist[row].datagroup_name,
              datagroup_id:datalist[row].datagroup_id,
              img_json:datalist[row].img_json,
              img_status:datalist[row].img_status,
              img_name:datalist[row].image_name,
              page_no: datalist[row].page_no
          })
        }
        else
        {
        massExtractionPayload.data_lists.push(
          {
            id: datalist[row]._id,
            images:[{
              struct_id: datalist[row].struct_id,
              datagroup_name: datalist[row].datagroup_name,
              datagroup_id:datalist[row].datagroup_id,
              img_json:datalist[row].img_json,
              img_status:datalist[row].img_status,
              img_name:datalist[row].image_name,
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
      }).then(()=>{
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
    }).then(()=>{
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
          img_json:datum.images[page].img_json,
          image_name: datum.images[page].img_name,
          img_status: datum.images[page].img_status,
          datagroup_name: datum.images[page].datagroup_name,
          struct_name: datum.images[page].struct_name,
          struct_id: datum.images[page].struct_id,
          img_thumb: datum.images[page].img_thumb
        });
      });
  });
    return newData;
  }
  const filterDataList = (filteredResult) => {
    setDatalistMessage('Filtering data...');
    setDatalist([]);
    setRowsSelected([]);
    setDatalist(filteredResult);
    setDatalistMessage(null);
  }
  const fetchDataList = () => {
    setDatalistMessage('Loading data...');
    setDatalist([]);
    setRowsSelected([]);
    api.post(URL_MAP.GET_DATA_LIST, {status: ['new', 'ready']})
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
  const ResetAllFilters = () => {
    setDatalist([...unFilteredData]);
  }

  useEffect(() => {
    if (!uploadCounter) return
      fetchDataList();
  }, [uploadCounter]);
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
      <Box style={{display: 'flex', flexWrap: 'wrap', margin: "15px 0px"}}>
        <Typography color="primary" variant="h6">Data List</Typography>
        <RefreshIconButton className={classes.ml1} title="Refresh data list" onClick={()=>{fetchDataList()}}/>
        <CompactButton className={classes.ml1} label="Labels" variant="contained" color="primary"
          onClick={()=>{history.push('labels')}} />
        <CompactButton className={classes.ml1} label="Data groups" variant="contained" color="primary"
          onClick={()=>{history.push('dg')}} />
        <Box className={classes.rightAlign}>
          <Button disabled={rowsSelected.length === 0} onClick={()=>{setAnnotateOpenV2(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Annotation</Button>
        </Box>
      </Box>
      <AsssignDataGroup open={showAssignDG} onClose={()=>{setShowAssignDG(false)}}
        onOK={onAssignData} api={api}/>
      <AsssignDataStructure open={showAssignStruct} onClose={()=>{setShowAssignStruct(false)}}
        onOK={onAssignData} api={api}/>
        <>
          <Box display="flex">
          <Button disabled={rowsSelected.length === 0 } variant='outlined' style={{height: '2rem'}} size="small"
            endIcon={<ChevronRightOutlinedIcon />} onClick={onMassMenuClick}>Mass action</Button>
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
            <MenuItem onClick={()=>{setMassAnchorEl(null); setShowAssignDG(true)}}>Assign data group</MenuItem>
            <MenuItem onClick={()=>{setMassAnchorEl(null); setShowAssignStruct(true)}}>Assign data structure</MenuItem>
            <MenuItem onClick={()=>{sendFileDetailsForExtraction(); }}>Mass data extraction</MenuItem>
            <MenuItem onClick={onDeleteFiles}>Delete files</MenuItem>
          </Popover>
        </>
      <MUIDataTable
        title={<>
                <Typography color="primary" variant="h8">Please select file(s) for annotation</Typography>
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
        onSuccessSave= {()=> {annotationSuccessCB()}}
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

export default function(props) {
  const classes = useStyles();
  const {uploadCounter, annotationSuccessCB} = props;
  return (
    <Box className={classes.root}>
      <MemoryRouter>
        <RouterBackButton />
        <RouteSwitch>
          <Route exact path="/"  render={(props) => (<DataList uploadCounter={uploadCounter} annotationSuccessCB={annotationSuccessCB} {...props}/>)} ></Route>
          <Route path="/labels" component={Labels}></Route>
          <Route path="/dg" component={DataGroup}></Route>
        </RouteSwitch>
      </MemoryRouter>
    </Box>
  );
}
