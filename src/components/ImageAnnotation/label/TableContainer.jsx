import isEqual from "lodash.isequal";
import * as React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import { CustomEventType } from "../../../canvas/core/constants";
import OpenInNewOutlinedIcon from "@material-ui/icons/OpenInNewOutlined";
import SlideTable from "./slideTable.jsx";
import * as cloneDeep from "lodash.clonedeep";

export default class TableDetailsContainer extends CanvasEventAttacher {
  state = {
    labels: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isTableOpen: false,
      tableDataToEdit: [],
    };
    this.eventListeners = [
      {
        event: CustomEventType.ON_ANNOTATION_VALUE_CHANGE,
        func: (event) => {
          if (
            this.state.isTableOpen &&
            (event.detail.action === "UPDATED" ||
              event.detail.action === "ZOOMEND")
          ) {
            this.setState({ selectedCellNewValue: event.detail.labelValue });
          }
        },
      },
    ];
  }
  componentDidMount() {
    this.bindEventListeners();
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }
  openTable(selectedTableIndex) {
    this.setState({
      isTableOpen: true,
      selectedTableIndex,
    });
  }
  handleClose(action) {
    this.props.highlightTableToggle(
      `TBL_HL-${this.state.selectedTableIndex}`,
      "REMOVE"
    );
    if (action === "CANCEL") this.props.resetTableAnnotations();
    this.setState({
      isTableOpen: false,
      selectedTableIndex: null,
    });
  }
  renderComponent() {
    const {
      tableAnnotations = [],
      highlightTableToggle,
      toggleHighlightCell,
      updateTableAnnotationAndSelectedValue,
      getAllTablesAnnotations,
      saveImageData,
    } = this.props;
    return (
      <>
        <Box>
          {tableAnnotations &&
            tableAnnotations.map((table, i) => (
              <Box
                style={{
                  border: "solid 1px #CDCDCD",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                <Typography color="primary" variant="h6" display="inline">
                  {`Table-${i + 1}`}
                </Typography>
                <Box style={{ float: "right" }}>
                  <Button
                    style={{ padding: "3px 16px", margin: "0px 10px" }}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() =>
                      highlightTableToggle(
                        `TBL_HL-${i}`,
                        "DISPLAY",
                        table.bounding_box
                      )
                    }
                  >
                    <span>Highlight</span>
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => {
                      highlightTableToggle(
                        `TBL_HL-${i}`,
                        "EDIT",
                        table.bounding_box
                      );
                      this.openTable(i);
                    }}
                  >
                    <span>Edit</span>{" "}
                    <OpenInNewOutlinedIcon color="primary" fontSize="small" />
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
        {this.state.isTableOpen && (
          <SlideTable
            toggleHighlightCell={toggleHighlightCell}
            updateTableAnnotationAndSelectedValue={
              updateTableAnnotationAndSelectedValue
            }
            selectedTableIndex={this.state.selectedTableIndex}
            open={this.state.isTableOpen}
            handleClose={this.handleClose.bind(this)}
            getAllTablesAnnotations={getAllTablesAnnotations}
            saveImageData={saveImageData}
            selectedCellNewValue={this.state.selectedCellNewValue}
          />
        )}
      </>
    );
  }
}
