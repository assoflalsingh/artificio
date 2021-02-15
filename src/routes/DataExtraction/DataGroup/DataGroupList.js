import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Menu, MenuItem, Popover, Snackbar, Tooltip, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, CompactButton, RefreshIconButton} from '../../../components/CustomButtons';
import { getInstance, URL_MAP } from '../../../others/artificio_api.instance';
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

export default function DataGroupList({setFormData, ...props}) {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const api = getInstance(localStorage.getItem('token'));
  const [dglistMessage, setDglistMessage] = useState(null);
  const [labelsDict, setLabelsDict] = useState([]);
  const [dglist, setDgList] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);

  const showDGForm = ()=>{history.push(`${match.url}/createdg`)};
  const onCreateDGClick = ()=>{
    setFormData(null);
    showDGForm();
  };
  const onNameClick = (dataIndex)=>{
    setFormData(dglist[dataIndex]);
    showDGForm();
  };

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Link href="#" onClick={(e)=>{e.preventDefault();onNameClick(dataIndex)}}>{dglist[dataIndex].name}</Link>
          );
        }
      },
    },
    {
      name: "desc",
      label: "Description",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "assign_label",
      label: "Labels",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return dglist[dataIndex].assign_label.map((label_id)=>{
            return labelsDict[label_id];
          }).join(', ');
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
  };

  const fetchDgList = async () => {
    setDglistMessage('Loading data...');
    setDgList([]);

    try {
      let resp = await api.get(URL_MAP.GET_DATAGROUPS);
      let labelsDict = {};
      resp.data.data.labels.forEach((label)=>{
        labelsDict[label._id] = label.name;
      });
      setLabelsDict(labelsDict);
      setDgList(resp.data.data.datagroups);
    } catch (error) {
      if(error.response) {
        setAjaxMessage({
          error: true, text: error.response.data.message,
        });
      } else {
        console.error(error);
      }
    } finally {
      setDglistMessage(null);
    }
  }

  useEffect(()=>{
    fetchDgList();
  },[]);

  const {match, history} = props;

  return (
    <>
      <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} >
        {ajaxMessage && <Alert onClose={()=>{setAjaxMessage(null)}} severity={ajaxMessage.error ? "error" : "success"}>
          {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
        </Alert>}
      </Snackbar>
      <Box style={{display: 'flex', flexWrap: 'wrap'}}>
        <Typography color="primary" variant="h6">Data groups</Typography>
        <RefreshIconButton className={classes.ml1} title="Refresh data list" onClick={()=>{fetchDgList()}}/>
        <CompactAddButton className={classes.ml1} color="secondary" label="Create data group" onClick={onCreateDGClick} />
      </Box>
      <MUIDataTable
        title={<>
          <Box display="flex">
          {dglistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{dglistMessage}</Typography></>}
          </Box>
        </>}
        data={dglist}
        columns={columns}
        options={options}
      />
    </>
  )
}