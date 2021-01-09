import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React, { useEffect, useState } from "react";
import {
  doValidation,
  Form,
  FormInputColor,
  FormInputText,
  FormRow,
  FormRowItem,
} from "../../FormElements";
import Alert from "@material-ui/lab/Alert";
import { getStructuresList } from "../apiMethods";
import { Box, CircularProgress, makeStyles, Paper, Typography, Link } from "@material-ui/core";
import { CompactButton } from "../../CustomButtons";
import MUIDataTable from "mui-datatables";
import ConfirmDialog from "../../ConfirmDialog";


const useStyles = makeStyles(()=>({
  fileroot: {
    display: 'flex',
    padding: '1rem',
    minWidth: '400px',
    marginBottom: '0.5rem',
  },
  filedetails: {
    flexGrow: 1,
  },
  rightAlign: {
    marginLeft: 'auto',
  }
}));

export const ChooseStructureDialog = ({ api, modalOpen, onClose, chooseStructure }) => {
  const [formError, setFormError] = useState("");
  const [structs, setStructs] = useState([]);
  const [loader, setLoader] = useState(true);
  const [listMessage, setListMessage] = useState(null);
  const [selectedStruct, setSelectedStruct] = useState(null);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Link href="#" onClick={(e)=>{
              e.preventDefault();
              console.log(dataIndex);
              setSelectedStruct(dataIndex);
            }}>{structs[dataIndex].name}</Link>
          );
        }
      }
    },
    {
      name: "desc",
      label: "Description",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "timestamp",
      label: "Date time",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta)=>{
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        }
      }
    },
  ];

  const options = {
    selectableRows: 'none',
    filterType: 'checkbox',
    filterType: 'dropdown',
    elevation: 0,
    filter: false,
    print: false,
    pagination: false,
    download: false,
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    sortOrder: {
      name: 'timestamp',
      direction: 'desc'
    },
    responsive: 'standard',
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
  };

  useEffect(()=>{
    if(modalOpen) {
      setStructs([]);
      setFormError(null);
      setListMessage('Loading data...');
      getStructuresList(api)
        .then((resp)=>{
          setLoader(false);
          setStructs(resp.data.data);
        })
        .catch((error)=>{
          setLoader(false);
          if (error.response) {
            setFormError(error.response.data.message);
          } else {
            console.error(error);
          }
        })
        .then(()=>{
          setListMessage(null);
        });
    }
  }, [modalOpen]);

  return (
    <>
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
      maxWidth='lg'
      PaperProps={{
        style: {
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent>
        {loader && <Typography>Loading...</Typography>}
        <MUIDataTable
          title={<>
            <Box display="flex">
            {listMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{listMessage}</Typography></>}
            {!listMessage && <><Typography variant="h6">Choose structure</Typography></>}
            </Box>
          </>}
          data={structs}
          columns={columns}
          options={options}
        />
        {formError && (
          <FormRow>
            <FormRowItem>
              {formError && <Alert severity="error">{formError}</Alert>}
            </FormRowItem>
          </FormRow>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    <ConfirmDialog open={selectedStruct != null} onCancel={()=>{setSelectedStruct(null)}} title={'Load structure ?'}
      content={selectedStruct != null && `Are you sure you want to load the structure - ${structs[selectedStruct].name} ?`}
      onConfirm={()=>{
        let id = structs[selectedStruct]._id;
        setSelectedStruct(null);
        chooseStructure(id);
      }}/>
    </>
  );
};
