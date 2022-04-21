import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Chip, CircularProgress, Snackbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, RefreshIconButton} from '../../components/CustomButtons';

import {Stacked, StackItem} from '../../components/Stacked';
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import CreateUser from './CreateUser';
import {titleCase} from '../../others/utils';

const useStyles = makeStyles((theme) => ({
  ml1: {
    marginLeft: '1rem',
  },
}));

export default function Users({match}) {
  const classes = useStyles();
  const [stackPath, setStackPath] = useState('home');
  const api = getInstance(localStorage.getItem('token'));
  const [rowsSelected, setRowsSelected] = useState([]);
  const [pageMessage, setPageMessage] = useState(null);
  const [usersMessage, setUsersMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);

  const columns = [
    {
      name: "first_name",
      label: "First Name",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "role_name",
      label: "Role",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRender: (value)=>{
          return titleCase(value.replace('_', ' '));
        }
      }
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          return <Chip size="small" label={value ? "ACTIVE" : "INACTIVE"} variant="outlined" />;
        }
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    filterType: 'dropdown',
    elevation: 0,
    filter: false,
    print: false,
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    sortOrder: {
      name: 'first_name',
      direction: 'asc'
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

  const fetchUsersList = useCallback(() => {
    setUsersMessage('Loading data...');
    setDatalist([]);
    setRowsSelected([]);
    api.get(URL_MAP.USERS_LIST)
      .then((res)=>{
        setDatalist(res.data.data);
      })
      .catch((err)=>{
        console.error(err);
      })
      .then(()=>{
        setUsersMessage(null);
      });
  },[]);

  useEffect(()=>{
    fetchUsersList();
  },[fetchUsersList]);

  return (
    <Box className={classes.root}>
      <Stacked to={stackPath}>
        <StackItem path='adduser' hasBack onBack={()=>{setStackPath('home')}}>
          <CreateUser onCancel={()=>{setStackPath('home')}}/>
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
            <Typography color="primary" variant="h6">Users</Typography>
            <RefreshIconButton className={classes.ml1} onClick={()=>{fetchUsersList()}}/>
            <CompactAddButton className={classes.ml1} color="secondary" label="Add user"
              onClick={()=>{setStackPath('adduser')}}
              />
          </Box>
          <MUIDataTable
            title={<>
              <Box display="flex">
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {usersMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{usersMessage}</Typography></>}
              </Box>
            </>}
            data={datalist}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
  );
}