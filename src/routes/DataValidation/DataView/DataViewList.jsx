import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Link, Snackbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, RefreshIconButton} from '../../../components/CustomButtons';
import { URL_MAP } from '../../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import useApi from '../../../hooks/use-api';
import TableChartIcon from "@material-ui/icons/TableChart";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import DataViewGrid from './DataViewGrid';

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
  const [dataViewId, setDataViewId] = useState(-1);
  const [dvlist, setDVList] = useState(testData);
  const {isLoading, apiRequest, error} = useApi();

  const showDGForm = ()=>{props.loadDataViewForm(true);};
  const onCreateDGClick = ()=>{
    setFormData(null);
    showDGForm();
  };
  const onNameClick = (dataIndex)=>{
    setFormData(dvlist[dataIndex]);
    showDGForm();
  };
  const showDataViewGrid = (dataIndex)=>{
    setDataViewId(dvlist[dataIndex]._id);
    setOpenDataViewGrid(true);
  };
  const deleteDataView = (dataIndex)=>{
    console.log(dvlist[dataIndex]);
  };
  const closeDataViewGrid = ()=>{
    setDataViewId(-1);
    setOpenDataViewGrid(false);
  };

  const columns = [
    {
      name: "dataview_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        draggable: true,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Link href="#" onClick={(e)=>{e.preventDefault();onNameClick(dataIndex)}}>{dvlist[dataIndex].dataview_name}</Link>
          );
        }
      },
    },
    {
      name: "dataview_desc",
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
        customBodyRenderLite: (dataIndex) => {
          return (<>
          <IconButton variant="outlined" onClick={()=>showDataViewGrid(dataIndex)}>
            <TableChartIcon style={{fontSize: '1.2rem'}} />
          </IconButton>
          <IconButton variant="outlined" onClick={()=>deleteDataView(dataIndex)}>
            <DeleteIcon style={{fontSize: '1.2rem'}} />
          </IconButton>
          </>);
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

  const fetchDVList = useCallback(() => {
    setDVList([]);

    apiRequest({url: URL_MAP.DATA_VIEW}, (resp) => {
      setDVList(resp);
    });
  },[apiRequest]);

  useEffect(()=>{
    fetchDVList();
  },[fetchDVList]);

  return (
    <>
      <MUIDataTable
        title={<>
        <Box style={{display: 'flex', flexWrap: 'wrap'}}>
          <Typography color="primary" variant="h6">Data View</Typography>
          <RefreshIconButton className={classes.ml1} title="Refresh List" onClick={()=>{fetchDVList()}}/>
          <CompactAddButton className={classes.ml1} color="secondary" label="Create Data View" onClick={onCreateDGClick} />
          {isLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading data...</Typography></>}
        </Box>
        </>}
        data={dvlist}
        columns={columns}
        options={options}
      />
      <DataViewGrid open={openDataViewGrid} onClose={closeDataViewGrid} dataViewId={dataViewId} />
      <Snackbar open={Boolean(error)} autoHideDuration={6000} >
        {error && <Alert severity="error">{error}</Alert>}
      </Snackbar>
    </>
  )
}