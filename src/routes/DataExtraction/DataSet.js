import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, ButtonGroup, Chip, Typography } from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import MUIDataTable from "mui-datatables";
import SecondaryAddButton from '../../components/SecondaryAddButton';
import CreateDataGroup from './CreateDataGroup';

import {Stacked, StackItem} from '../../components/Stacked';
import CreateLabel from './CreateLabel';

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto'
  },
  ml1: {
    marginLeft: '1rem',
  },
  root: {
    position: 'relative'
  }
}));

export default function DataSet() {
  const classes = useStyles();
  const [createLabelOpen, setCreateLabelOpen] = useState(false);
  const [createDGOpen, setDGOpen] = useState(false);
  const [stackPath, setStackPath] = useState('home');

  const columns = [
    {
      name: "filename",
      label: "Filename",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "datasetId",
      label: "Data Set ID",
      options: {
        filter: true,
        sort: true,
        draggable: true
      }
    },
    {
      name: "createdBy",
      label: "Created By",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "systemStatus",
      label: "System Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          if(value == 'N') {
            return <Chip label="New" color="primary" />;
          } else{
            return <Chip label="Processed" color="secondary" />;
          }
        }
      },
    },
    {
      name: "assinedUser",
      label: "Assigned User",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "dateTime",
      label: "Date time",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        draggable: false,
      }
    },
  ];

   const data = [
    { filename: "Demo_001", datasetId: "IN-003", createdBy: "Yonkers", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "Demo_002", datasetId: "IN-003", createdBy: "Hartford", systemStatus: "P", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "a_long_file_name_is_possible", datasetId: "IN-003", createdBy: "Tampa", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
    { filename: "Demo_001", datasetId: "IN-003", createdBy: "Dallas", systemStatus: "N", assinedUser: 'Paul Doe', dateTime: '25 Sep, 2020\n12:55AM' },
   ];


  const options = {
    filterType: 'checkbox',
    filterType: 'dropdown',
    elevation: 0,
    draggableColumns: {enabled: true}
  };

  return (
    <Box className={classes.root}>
      <Stacked to={stackPath}>
        <StackItem path='createlabel' hasBack onBack={()=>{setStackPath('home')}}>
          <CreateLabel onCancel={()=>{setStackPath('home')}}/>
        </StackItem>
        <StackItem path='createdg' hasBack onBack={()=>{setStackPath('home')}}>
          <CreateDataGroup onCancel={()=>{setStackPath('home')}}/>
        </StackItem>
        <StackItem main path='home'>
          <Box display="flex">
            <Typography color="primary" variant="h6">Data List</Typography>
            <SecondaryAddButton className={classes.ml1} color="secondary" label="Create label"
              onClick={()=>{setStackPath('createlabel')}}
              />
            <SecondaryAddButton className={classes.ml1} color="secondary" label="Create data group" onClick={()=>{setStackPath('createdg')}} />
            <Box className={classes.rightAlign}>
              <Button><PlayCircleFilledIcon color="primary" />&nbsp; Annotation</Button>
              <ButtonGroup className={classes.ml1}>
                <Button>Date range</Button>
                <Button>Search data</Button>
              </ButtonGroup>
            </Box>
          </Box>
          <MUIDataTable
            title=''
            data={data}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
  )
}