import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Popover, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import SecondaryAddButton from '../../components/SecondaryAddButton';
import CreateDataGroup from './CreateDataGroup';

import {Stacked, StackItem} from '../../components/Stacked';
import CreateLabel from './CreateLabel';
import { AnnotateTool } from './AnnotateTool';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import { FormInputSelect } from '../../components/FormElements';

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
          console.log(err);
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
  const [showProcessing, setShowProcessing] = useState(false);
  const [datalist, setDatalist] = useState([]);

  const columns = [
    {
      name: "_id",
      label: "",
      options: {
        display: 'excluded'
      }
    },
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
      name: "datagroup_name",
      label: "Data group",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "status",
      label: "System Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          return <Chip label={value.toUpperCase()} variant="outlined" />;
        }
      },
    },
    {
      name: "owner",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "id",
      label: "Date time",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          return '25 Sep, 2020\n12:55AM';
        }
      }
    },
  ];

  const options = {
    selectableRows: 'multiple',
    filterType: 'checkbox',
    filterType: 'dropdown',
    elevation: 0,
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
    rowsSelected: rowsSelected,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelectedNow)=>{
      console.log(currentRowsSelected, allRowsSelected, rowsSelectedNow);
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
    console.log(id, name);
    setShowProcessing(true);
    let datafile_ids = rowsSelected.map((i)=>{
      return datalist[i]._id;
    });

    api.post(URL_MAP.ASSIGN_DATAGROUP, {
      datagroup_id: id,
      datafile_ids: datafile_ids
    }).then((res)=>{
      let newDatalist = datalist;
      rowsSelected.forEach((i)=>{
        newDatalist[i].datagroup_name = name;
      });
      setDatalist(newDatalist);
    }).catch((err)=>{
      console.log(err);
    }).then(()=>{
      setShowProcessing(false);
    })
  }

  useEffect(()=>{
    api.get(URL_MAP.GET_DATA_LIST)
      .then((res)=>{
        let data = res.data.data;
        setDatalist(data.data_lists);
      })
      .catch((err)=>{
        console.log(err);
      });
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
          <Backdrop className={classes.backdrop} open={showProcessing} onClick={()=>{setShowProcessing(false)}}>
            <CircularProgress color="inherit" />
            <Typography style={{marginLeft: '0.25rem'}} variant='h4'>Updating...</Typography>
          </Backdrop>
          <Box display="flex">
            <Typography color="primary" variant="h6">Data List</Typography>
            <SecondaryAddButton className={classes.ml1} color="secondary" label="Create label"
              onClick={()=>{setStackPath('createlabel')}}
              />
            <SecondaryAddButton className={classes.ml1} color="secondary" label="Create data group" onClick={()=>{setStackPath('createdg')}} />
            <Box className={classes.rightAlign}>
              <Button onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Annotation</Button>
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
    <AnnotateTool open={annotateOpen} onClose={()=>{setAnnotateOpen(false)}} />
    </>
  )
}