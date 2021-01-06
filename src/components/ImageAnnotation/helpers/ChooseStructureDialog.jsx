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
import { Box, makeStyles, Paper, Typography } from "@material-ui/core";
import { CompactButton } from "../../CustomButtons";


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

function SingleStructure({data, dataGroup, onChoose}) {
  const classes = useStyles();
  return (
    <Paper className={classes.fileroot} elevation={2}>
      <Box className={classes.filedetails}>
        <Typography variant="body1"><strong>Name: </strong>{data.name}</Typography>
        <Typography variant="body2">{data.desc}</Typography>
        {dataGroup && <Typography variant="body2"><strong>Default for datagroup: </strong>{dataGroup}</Typography>}
      </Box>
      <Box className={classes.rightAlign}>
        <CompactButton label="Open" variant="outlined"
          onClick={()=>{onChoose(data._id)}} />
      </Box>
    </Paper>
  )
}


export const ChooseStructureDialog = ({ api, modalOpen, onClose, chooseStructure }) => {
  const [formError, setFormError] = useState("");
  const [structs, setStructs] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(()=>{
    if(modalOpen) {
      setStructs([]);
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
        });
    }
  }, [modalOpen]);

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={modalOpen}
    >
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        Choose structure
      </DialogTitle>
      <DialogContent>
        {loader && <Typography>Loading...</Typography>}
        {structs.map((struct)=>{
          return <SingleStructure data={struct} onChoose={chooseStructure}/>
        })}
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
  );
};
