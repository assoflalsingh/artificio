import * as React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import { CustomEventType } from "../../../canvas/core/constants";
import TableChartIcon from "@material-ui/icons/TableChart";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import SlideTable from "./slideTable.jsx";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";

const styles = {
  tableAction: {
    "&:hover": {
      color: "#0575ce",
    },
  },
};
const useStyles = makeStyles(styles);
const ButtonContainer = (props) => {
  const classes = useStyles();
  return (
    <Tooltip title={props.title} aria-label={props.title}>
      <IconButton
        className={classes.tableAction}
        component="span"
        aria-label={props.title}
      >
        {props.children}
      </IconButton>
    </Tooltip>
  );
};
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
                <Typography
                  color="primary"
                  variant="h6"
                  display="inline"
                  style={{ fontsize: "18px", fontWeight: "bold" }}
                >
                  {`Table-${i + 1}`}
                </Typography>
                <Box style={{ float: "right" }}>
                  <Button
                    className="actionButton"
                    style={{
                      margin: "0px 5px",
                      padding: "0px",
                      "min-width": "51px",
                      height: "30px",
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      highlightTableToggle(
                        `TBL_HL-${i}`,
                        "EDIT",
                        table.bounding_box
                      );
                      this.openTable(i);
                    }}
                  >
                    <ButtonContainer title="Edit Table Data">
                      <TableChartIcon fontSize="small" />
                    </ButtonContainer>
                  </Button>
                  <Button
                    className="actionButton"
                    style={{
                      margin: "0px 5px",
                      padding: "0px",
                      "min-width": "51px",
                      height: "30px",
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      highlightTableToggle(
                        `TBL_HL-${i}`,
                        "DISPLAY",
                        table.bounding_box
                      )
                    }
                  >
                    <ButtonContainer title="Display Table Data">
                      <AspectRatioIcon fontSize="small" />
                    </ButtonContainer>
                  </Button>
                  <Button
                    className="actionButton"
                    style={{
                      margin: "0px 5px",
                      padding: "0px",
                      "min-width": "51px",
                      height: "30px",
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() => this.props.downloadCsv("onlyTable", i)}
                  >
                    <ButtonContainer title="Download CSV">
                      <CloudDownloadIcon fontSize="small" />
                    </ButtonContainer>
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
