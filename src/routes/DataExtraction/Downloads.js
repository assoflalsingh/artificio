import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Menu, MenuItem, Popover, Snackbar, Tooltip, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {RefreshIconButton} from '../../components/CustomButtons';

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

export default function Downloads() {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const [annotateOpen, setAnnotateOpen] = useState(false);
	const [annotateOpenV2, setAnnotateOpenV2] = useState(false);
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
      name: "id",
      label: "",
      options: {
        display: false,
      }
    },
    {
      name: "user_name",
      label: "Requested by",
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
      name: "last_updated",
      label: "Last updated",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        }
      }
    },
    {
      name: "file_type",
      label: "File type",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "file_name",
      label: "",
      options: {
        display: false,
      }
    },
    {
      name: "download_link",
      label: "Download",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRender: (value, tableMeta)=>{
          let file_name = tableMeta.rowData[6];
          if(value) {
            return <Link href={value} download={file_name}>Download</Link>;
          }
        }
      }
    },
  ];

  const options = {
    selectableRows: "none",
    filterType: 'checkbox',
    filterType: 'dropdown',
    elevation: 0,
    filter: false,
    print: false,
    sortOrder: {
      name: 'last_updated',
      direction: 'desc'
    },
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    responsive: 'vertical',
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
  };

  const fetchDataList = () => {
    setDatalistMessage('Loading data...');
    setDatalist([]);
    setRowsSelected([]);
    api.get(URL_MAP.GET_DOWNLOADS_LIST)
      .then((res)=>{
        let data = res.data.data;
        setDatalist(data);
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
            <Typography color="primary" variant="h6">Download reports</Typography>
            <RefreshIconButton className={classes.ml1} onClick={()=>{fetchDataList()}}/>
          </Box>
          <MUIDataTable
            title={<>
              <Box display="flex">
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {datalistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{datalistMessage}</Typography></>}
              </Box>
            </>}
            data={datalist}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
    </>
  )
}
