import React, { useState, useEffect} from "react";
import { URL_MAP } from "../../others/artificio_api.instance";
import { Button, Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { FormInputSelect } from "../../components/FormElements";

export default function AsssignDataGroup({ open, onClose, onOK, api }) {
    const [datagroupOpts, setDatagroupOpts] = useState();
    const [datagroup, setDatagroup] = useState(null);
    const [opLoading, setOpLoading] = useState(false);
  
    useEffect(() => {
      if (open) {
        setOpLoading(true);
        api
          .get(URL_MAP.GET_DATAGROUP_NAMES)
          .then((res) => {
            let data = res.data.data;
            setDatagroupOpts(data);
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
            label="Assign Data gGroup"
            onChange={(e, value) => {
              setDatagroup(value);
            }}
            loading={opLoading}
            value={datagroup}
            options={datagroupOpts}
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
              onOK("datagroup", datagroup._id, datagroup.name);
            }}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }