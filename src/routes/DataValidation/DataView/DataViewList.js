import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Link, Snackbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, RefreshIconButton} from '../../../components/CustomButtons';
import { URL_MAP } from '../../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import useApi from '../../../hooks/use-api';
import TableChartIcon from "@material-ui/icons/TableChart";
import IconButton from "@material-ui/core/IconButton";
// import DataViewGrid from './DataViewGrid';

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

const testData = [{name: 'ADSingh', desc: 'Developer', actions: ''}];

export default function DataViewList({setFormData, ...props}) {
  const classes = useStyles();
  const [openDataViewGrid, setOpenDataViewGrid] = useState(false);
  const [dataViewId, setDataViewId] = useState(0);
  const [dglist, setDgList] = useState(testData);
  const {isLoading, apiRequest, error} = useApi();

  const showDGForm = ()=>{props.loadDataViewForm(true);};
  const onCreateDGClick = ()=>{
    setFormData(null);
    showDGForm();
  };
  const onNameClick = (dataIndex)=>{
    setFormData(dglist[dataIndex]);
    showDGForm();
  };
  const showDataViewGrid = (dataIndex)=>{
    setDataViewId(dataIndex);
    setOpenDataViewGrid(true);
  };
  const closeDataViewGrid = ()=>{
    setDataViewId(0);
    setOpenDataViewGrid(false);
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
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        draggable: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return <IconButton variant="outlined" onClick={()=>showDataViewGrid(dataIndex)}>
            <TableChartIcon style={{fontSize: '1.2rem'}} />
          </IconButton>
        }
      }
    },
  ];

  const options = {
    selectableRows: "none",
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

  const fetchDGList = useCallback(() => {
    setDgList([]);

    apiRequest({url: URL_MAP.GET_DATAGROUPS}, (resp) => {
      setDgList(resp.datagroups);
    });
  },[apiRequest]);

  useEffect(()=>{
    // fetchDGList();
  },[fetchDGList]);

  return (
    <>
      <MUIDataTable
        title={<>
        <Box style={{display: 'flex', flexWrap: 'wrap'}}>
          <Typography color="primary" variant="h6">Data View</Typography>
          <RefreshIconButton className={classes.ml1} title="Refresh List" onClick={()=>{fetchDGList()}}/>
          <CompactAddButton className={classes.ml1} color="secondary" label="Create Data View" onClick={onCreateDGClick} />
          {isLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading data...</Typography></>}
        </Box>
        </>}
        data={dglist}
        columns={columns}
        options={options}
      />
      {/* <DataViewGrid open={openDataViewGrid} onClose={closeDataViewGrid} dataViewID={dataViewId} /> */}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} >
        {error && <Alert severity="error">{error}</Alert>}
      </Snackbar>
    </>
  )
}