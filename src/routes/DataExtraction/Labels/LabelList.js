import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, ButtonGroup, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link, Menu, MenuItem, Popover, Snackbar, Tooltip, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, CompactButton, RefreshIconButton} from '../../../components/CustomButtons';
import { getInstance, URL_MAP } from '../../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import { ColorPalette, ColorButton } from 'material-ui-color';

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
  listColorButton: {
    pointerEvents: 'none'
  }
}));

export default function LabelList({setFormData, ...props}) {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const api = getInstance(localStorage.getItem('token'));
  const [listMessage, setListMessage] = useState(null);
  const [labelList, setLabelList] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);

  const showLabelForm = ()=>{history.push(`${match.url}/create`)};
  const onCreateClick = ()=>{
    setFormData(null);
    showLabelForm();
  };
  const onNameClick = (dataIndex)=>{
    setFormData(labelList[dataIndex]);
    showLabelForm();
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
            <Link href="#" onClick={(e)=>{e.preventDefault();onNameClick(dataIndex)}}>{labelList[dataIndex].name}</Link>
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
      name: "shape",
      label: "Shape",
      options: {
        filter: true,
        sort: true,
        draggable: true,
      }
    },
    {
      name: "color",
      label: "Color",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Box display="flex">
              <ColorButton color={labelList[dataIndex].color} className={classes.listColorButton} />
              &nbsp;<Typography>{labelList[dataIndex].color}</Typography>
            </Box>
          )
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
    responsive: 'vertical',
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
  };

  const fetchLabelList = async () => {
    setListMessage('Loading data...');
    setLabelList([]);

    try {
      let resp = await api.get(URL_MAP.GET_LABELS);
      setLabelList(resp.data.data);
    } catch (error) {
      if(error.response) {
        setAjaxMessage({
          error: true, text: error.response.data.message,
        });
      } else {
        console.error(error);
      }
    } finally {
      setListMessage(null);
    }
  }

  useEffect(()=>{
    fetchLabelList();
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
        <Typography color="primary" variant="h6">Labels</Typography>
        <RefreshIconButton className={classes.ml1} title="Refresh data list" onClick={()=>{fetchLabelList()}}/>
        <CompactAddButton className={classes.ml1} color="secondary" label="Create label" onClick={onCreateClick} />
      </Box>
      <MUIDataTable
        title={<>
          <Box display="flex">
          {listMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{listMessage}</Typography></>}
          </Box>
        </>}
        data={labelList}
        columns={columns}
        options={options}
      />
    </>
  )
}