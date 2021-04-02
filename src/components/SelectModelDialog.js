import React, {  } from 'react';
import { Box, Dialog, DialogContent, Typography, Link , DialogActions, Button} from '@material-ui/core';
import MUIDataTable from "mui-datatables";
export default function SelectModelDialog(props) {
    let {showFilterPanel, setDialogDisplay, modelData, onModelSelection} = props;
    const columns = [
        {
          name: "model_name",
          label: "Name",
          options: {
            filter: true,
            sort: true,
            customBodyRender: (value, tableMeta) => {
              return (
                <Link href="#" onClick={(e)=>{
                  e.preventDefault();
                  onModelSelection(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[2], tableMeta.rowData[3]);
                }}>{value}</Link>
              );
            }
          }
        },
        {
          name: "model_desc",
          label: "Description",
          options: {
            filter: true,
            sort: true,
          }
        },
        {
          name: "model_id",
          label: "ID",
          options: {
            display: false,
          },
        },
        {
          name: "version",
          label: "version",
          options: {
            filter: false,
            sort: true
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
          name: "created_on",
          label: "Created On",
          options: {
            filter: false,
            sort: true,
            customBodyRender: (value)=>{
              let d = new Date(`${value}+00:00`);
              return d.toLocaleString();
            }
          }
        },
        {
          name: "updated_on",
          label: "Last Updated",
          options: {
            filter: false,
            sort: true,
            customBodyRender: (value)=>{
              let d = new Date(`${value}+00:00`);
              return d.toLocaleString();
            }
          }
        }
      ];
      const options = {
        selectableRows: 'none',
        filterType: 'checkbox',
        elevation: 0,
        filter: false,
        print: false,
        pagination: false,
        download: false,
        draggableColumns: {enabled: true},
        selectToolbarPlacement: 'none',
        responsive: 'standard',
        setTableProps: () => {
          return {
            size: 'small',
          };
        },
      };
    return (
    <Dialog disableBackdropClick disableEscapeKeyDown open={showFilterPanel} scroll={"paper"} onClose={()=>setDialogDisplay(false)} maxWidth="md" fullWidth={true}>
      <DialogContent>
      <MUIDataTable
          title={<>
            <Box display="flex">
            <Typography variant="h5">{showFilterPanel === "predict" ? "Predict" : "select model to retrain(update)"}</Typography>
            </Box>
          </>}
          data={modelData}
          columns={columns}
          options={options}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={()=>setDialogDisplay(false)} color="primary" variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    )
}