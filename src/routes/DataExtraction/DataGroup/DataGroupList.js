import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Link, Snackbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import {CompactAddButton, RefreshIconButton} from '../../../components/CustomButtons';
import { URL_MAP } from '../../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import useApi from '../../../hooks/use-api';

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
  const [labelsDict, setLabelsDict] = useState([]);
  const [dglist, setDgList] = useState([]);
  const {isLoading, apiRequest, error} = useApi();

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
      let labelsDict = {};
      resp.labels.forEach((label)=>{
        labelsDict[label._id] = label.name;
      });
      setLabelsDict(labelsDict);
      setDgList(resp.datagroups);
    });
  },[apiRequest]);

  useEffect(()=>{
    fetchDGList();
  },[fetchDGList]);

  const {match, history} = props;

  return (
    <>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} >
        {error && <Alert severity="error">{error}</Alert>}
      </Snackbar>
      <Box style={{display: 'flex', flexWrap: 'wrap'}}>
        <Typography color="primary" variant="h6">Data Groups</Typography>
        <RefreshIconButton className={classes.ml1} title="Refresh List" onClick={()=>{fetchDGList()}}/>
        <CompactAddButton className={classes.ml1} color="secondary" label="Create Data Group" onClick={onCreateDGClick} />
      </Box>
      <MUIDataTable
        title={<>
          <Box display="flex">
          {isLoading && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;Loading data...</Typography></>}
          </Box>
        </>}
        data={dglist}
        columns={columns}
        options={options}
      />
    </>
  )
}