import React, { useState, useEffect} from "react";
import { URL_MAP } from "../../others/artificio_api.instance";
import { Button, Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { FormInputSelect } from "../../components/FormElements";

export default function AssignDataStructure({ open, onClose, onOK, api }) {
    const [structOpts, setStructOpts] = useState();
    const [struct, setStruct] = useState(null);
    const [opLoading, setOpLoading] = useState(false);
  
    useEffect(() => {
      if (open) {
        setOpLoading(true);
        api
          .get(URL_MAP.GET_STRUCTURES)
          .then((res) => {
            let data = res.data.data;
            setStructOpts(data);
          })
          .catch((err) => {
            console.error(err);
          })
          .then(() => {
            setOpLoading(false);
          });
      }
    }, [open]);
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onClose}
      >
        <DialogContent>
          <FormInputSelect
            hasSearch
            label="Assign structure"
            onChange={(e, value) => {
              setStruct(value);
            }}
            loading={opLoading}
            value={struct}
            options={structOpts}
            labelKey="name"
            valueKey="_id"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              onOK("structure", struct._id, struct.name);
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  