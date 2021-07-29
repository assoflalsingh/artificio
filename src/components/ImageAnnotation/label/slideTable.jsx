import React, { useMemo, useState, useCallback, useEffect } from "react";
import Button from "@material-ui/core/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import isEqual from "lodash.isequal";

const useStyles = makeStyles((theme) => ({
  export: {
    fontWeight: "bold",
    fontSize: "18px",
    borderBottom: "solid 1px #0575ce",
  },
  tableInfo: {
    display: "block",
    fontSize: "14px",
    width: "90%",
  },
  root: {
    height: 180,
    overflow: "hidden",
  },
  wrapper: {
    width: 100 + theme.spacing.unit * 2,
  },
  elementsContainer: {
    display: "flex",
  },
  slide: {
    flex: 1,
  },
  paper: {
    zIndex: 1,
    position: "relative",
    margin: theme.spacing.unit,
  },
  tableWrapper: {
    position: "absolute",
    width: "700px",
    right: "10px",
    top: "108px",
  },
  buttonWrapper: {
    border: "2px solid rgba(224, 224, 224, 1)",
    borderTop: "none",
    textAlign: "right",
    background: "rgba(224, 224, 224, 1)",
  },
  tableActions: {
    borderRadius: 0,
    margin: "0px 10px",
    "&:hover": {
      "background-color": "rgba(224, 224, 224, 1)",
    },
  },
  cellAnnotated: {
    "background-color": "#ffb600",
    width: "100%",
    "font-weight": "bold",
    "text-align": "center",
    "white-space": "initial",
    "line-height": "17px",
    padding: "10px",
    border: "2px dashed black",
  },
}));

function CustomToolbar() {
  const classes = useStyles();
  return (
    <GridToolbarContainer className={classes["export"]}>
      <span className={classes.tableInfo}>
        Use double click to edit the cell.
      </span>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function SlideTable(props) {
  const {
    open,
    handleClose,
    toggleHighlightCell,
    updateTableAnnotationAndSelectedValue,
    saveImageData,
    selectedTableIndex,
    getAllTablesAnnotations,
    selectedCellNewValue,
  } = props;
  const classes = useStyles();
  function convertJSONtoTable(tableData = []) {
    let columns = [];
    let rowsData = [];
    let currentRowIndex;
    tableData.map((rowData, index) => {
      currentRowIndex = rowData["row_index"];
      if (!currentRowIndex) {
        columns.push({
          field: `col_${rowData["column_index"]}`,
          sortable: false,
          editable: true,
          width: 200,
        });
        rowsData.push({
          id: currentRowIndex,
          [`col_${rowData["column_index"]}`]:
            rowData.word_details &&
            rowData.word_details
              .reduce(
                (acc, current) => `${acc}${current.word_description} `,
                ""
              )
              .trim(),
          [`col_${rowData["column_index"]}_userModified`]: rowData.word_details.reduce(
            (acc, current) => acc + +current.user_modified,
            0
          ),
        });
      } else if (currentRowIndex === rowData["row_index"]) {
        rowsData[rowData["row_index"] - 1] = rowsData[
          rowData["row_index"] - 1
        ] || { id: currentRowIndex };
        if (rowData["row_index"] === 1) {
          columns.push({
            field: `col_${rowData["column_index"]}`,
            sortable: false,
            editable: true,
            width: 200,
          });
        }
        rowsData[rowData["row_index"] - 1][`col_${rowData["column_index"]}`] =
          rowData.word_details &&
          rowData.word_details
            .reduce((acc, current) => `${acc}${current.word_description} `, "")
            .trim();
        rowsData[rowData["row_index"] - 1][
          `col_${rowData["column_index"]}_userModified`
        ] =
          rowData.word_details &&
          rowData.word_details.reduce(
            (acc, current) => acc + +current.user_modified,
            0
          );
      } else {
        rowsData[rowData["row_index"] - 1] = rowsData[
          rowData["row_index"] - 1
        ] || { id: currentRowIndex };
        rowsData[rowData["row_index"] - 1][`col_${rowData["column_index"]}`] =
          rowData.word_details &&
          rowData.word_details
            .reduce((acc, current) => `${acc}${current.word_description} `, "")
            .trim();
        rowsData[rowData["row_index"] - 1][
          `col_${rowData["column_index"]}_userModified`
        ] =
          rowData.word_details &&
          rowData.word_details.reduce(
            (acc, current) => acc + +current.user_modified,
            0
          );
      }
    });
    columns.map((col) => {
      col.renderCell = (cellValues) => {
        return (
          <div
            className={
              cellValues.row[`${cellValues.field}_userModified`] > 0
                ? classes.cellAnnotated
                : null
            }
          >
            {cellValues.value}
          </div>
        );
      };
    });
    return {
      columns,
      rowsData,
    };
  }
  const getAllTableAnnotations = useCallback(
    () => getAllTablesAnnotations(),
    []
  );
  const allTableAnnotations = getAllTableAnnotations();
  const selectedTableAnnotations = allTableAnnotations[selectedTableIndex];
  const jsonTableData = convertJSONtoTable(
    selectedTableAnnotations.cell_details
  );
  const [selectedCellDetails, setSelectedCellDetails] = useState({});
  const totalColumnsPerRow = jsonTableData.columns.length; // added one more for handling the addition of checkboxes.
  const handleCellSingleClick = (cellMeta, event) => {
    const colIndex = cellMeta.api.getColumnIndex(cellMeta.field);
    const rowIndex = cellMeta.api.getRowIndex(cellMeta.row.id);

    const cellIndex = rowIndex * totalColumnsPerRow + (colIndex - 1);
    if (cellIndex !== selectedCellDetails.selectedCellIndex) {
      const cellAnnotation = toggleHighlightCell(
        `TBL_CELL_${cellIndex}`,
        {
          ...selectedTableAnnotations?.cell_details?.[cellIndex],
          cellValue: cellMeta.formattedValue,
        },
        selectedCellDetails.valueChanged
          ? null
          : selectedCellDetails.annotationId
      );
      setSelectedCellDetails({
        ...selectedCellDetails,
        selectedCellIndex: cellIndex,
        row: rowIndex + 1,
        column: colIndex + 1,
        annotationId: cellAnnotation[0].id,
        coordinates: cellAnnotation[0].coordinates,
        valueChanged: false,
        valueAtSelection: cellMeta.value,
      });
    }
  };
  const handleCellDoubleClick = (cellMeta, event) => {
    const colIndex = cellMeta.api.getColumnIndex(cellMeta.field);
    const rowIndex = cellMeta.api.getRowIndex(cellMeta.row.id);
    setSelectedCellDetails({
      ...selectedCellDetails,
      row: rowIndex + 1,
      column: colIndex + 1,
      valueAtSelection: cellMeta.value,
    });
  };
  const handleCellFocus = (cellMeta, event) => {
    // debugger;
    const cellParams = cellMeta.api.getEditCellPropsParams(
      cellMeta.id,
      cellMeta.field
    );
    if (cellParams.props.value !== selectedCellDetails?.valueAtSelection) {
      setSelectedCellDetails({
        ...selectedCellDetails,
        valueChanged: true,
      });
      updateTableAnnotationAndSelectedValue(
        selectedCellDetails.annotationId,
        cellParams.props.value,
        selectedCellDetails.selectedCellIndex,
        selectedTableIndex
      );
    }
  };
  useEffect(() => {
    if (
      selectedCellDetails?.annotationId &&
      selectedCellNewValue !== undefined &&
      selectedCellNewValue !== selectedCellDetails.valueAtSelection
    )
      updateTableAnnotationAndSelectedValue(
        selectedCellDetails.annotationId,
        selectedCellNewValue,
        selectedCellDetails.selectedCellIndex,
        selectedTableIndex
      );
  }, [selectedCellNewValue]);
  return (
    <div className={classes.tableWrapper}>
      <div className={classes.elementsContainer}>
        <Slide
          classes={{ root: classes.slide }}
          direction="left"
          in={open}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 1000, exit: open ? 1 : 900 }}
        >
          <Paper elevation={4} className={classes.paper}>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                onCellClick={(a, b) => {
                  handleCellSingleClick(a, b);
                }}
                onCellDoubleClick={(a, b) => {
                  handleCellDoubleClick(a, b);
                }}
                onEditCellChangeCommitted={(a, b) => {
                  handleCellFocus(a, b);
                }}
                disableColumnFilter
                checkboxSelection
                rows={jsonTableData.rowsData}
                columns={jsonTableData.columns}
                hideFooter={true}
                hideFooterPagination={true}
                hideFooterSelectedRowCount={true}
                components={{
                  Toolbar: CustomToolbar,
                }}
              />
              <div class={classes.buttonWrapper}>
                <Button
                  className={classes.tableActions}
                  autoFocus
                  onClick={() => {
                    toggleHighlightCell(null);
                    handleClose("CANCEL");
                  }}
                  color="primary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.tableActions}
                  onClick={() => {
                    handleClose("SAVED");
                    saveImageData();
                  }}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </Paper>
        </Slide>
      </div>
    </div>
  );
}

export default React.memo(SlideTable, (prev, next) => {
  return isEqual(prev, next);
});
