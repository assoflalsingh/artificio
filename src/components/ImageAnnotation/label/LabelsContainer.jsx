import { Box, Tooltip, Typography, Button } from "@material-ui/core";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CommonTabs from "../../CommonTabs";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import { CustomEventType } from "../../../canvas/core/constants";
import { getLabelValueFromProposals } from "../utilities";
import TextField from "@material-ui/core/TextField";
import { DefaultLabel } from "./LabelSelector";
import * as uuid from "uuid";
import Chip from "@material-ui/core/Chip";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Checkbox from "@material-ui/core/Checkbox";
import withStyles from "@material-ui/core/styles/withStyles";
import TableContainer from "./TableContainer";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import TextFieldsOutlinedIcon from "@material-ui/icons/TextFieldsOutlined";
import ConfirmDialog from "../../ConfirmDialog";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { LabelImportant } from "@material-ui/icons";

export const LabelId = "label-text-container";
export const LabelContainerId = "labels-container";

const styles = {
  labelContainer: {
    background: "#383838",
    color: "#ffffff",
    height: "100%",
  },
  textHead: {
    margin: "0.7rem 0 0.7rem 0.8rem",
    fontWeight: "bold",
  },
  tabsContainer: {
    height: "80%",
    padding: "0 0.5rem 0 0.8rem",
  },
  downLoadAction: {
    "&:hover": {
      color: "#0575ce",
      backgroundColor: "transparent",
    },
  },
  scrollableLabelsContainer: {
    padding: "0.5rem",
    height: "100%",
    overflowY: "scroll",
    overflowX: "hidden",
    paddingRight: "0.8rem",
  },
  label: {
    margin: "0.1rem 0 0.6rem 0.2rem",
    border: "1px solid #0775ce",
    borderRadius: "4px",
    padding: "0.5rem",
  },
  labelName: {
    marginLeft: "0.5rem",
    fontWeight: "bold",
  },
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  h4: {
    color: "#0575ce",
  },
  tag: {
    marginBottom: "0.2rem",
    marginRight: "0.1rem",
  },
  tagContainer: {
    marginTop: "0.2rem",
  },
};

const useStyles = makeStyles(styles);

const ButtonContainer = (props) => {
  const classes = useStyles();
  return (
    <Tooltip title={props.title} aria-label={props.title}>
      <IconButton
        className={classes.downLoadAction}
        component="span"
        aria-label={props.title}
      >
        {props.children}
      </IconButton>
    </Tooltip>
  );
};

/**
 * imageLabels: {
  "label_name": string,
  "label_shape": string",
  "label_datatype": string",
  "label_color": string
	}
 */
export const LabelsContainer = ({
  getAnnotations,
  imageLabels,
  textAnnotations,
  tableAnnotations,
  getAnnotationData,
  removeConnectingLine,
  addConnectingLine,
  selectAnnotationById,
  getProposals,
  setAnnotationAccuracy,
  getAnnotationAccuracy,
  highlightTableToggle,
  toggleHighlightCell,
  saveImageData,
  resetImageData,
  getEdittedAnnotationCount,
  setTableAnnotationInProgress,
  updateTableAnnotationAndSelectedValue,
  getAllTablesAnnotations,
  resetTableAnnotations,
  checkIFAnnotationIntersectingWithTables,
  getAllTableAnnProposals,
  downloadCsv,
}) => {
  const classes = useStyles();
  const [dialogState, setDialogState] = React.useState(false);
  const [selectedTabIndex, setselectedTabIndex] = React.useState(0);
  const [tabToKeepOpen, setTabToKeepOpen] = React.useState(0);
  const [isTableEditingInProgress, setTableEditingInProgress] = React.useState(
    false
  );
  let wheeling;
  const onScroll = () => {
    if (!wheeling) {
      // Start scrolling
      removeConnectingLine();
    }
    clearTimeout(wheeling);
    wheeling = setTimeout(() => {
      // Stop scrolling
      addConnectingLine();
      wheeling = undefined;
    }, 70);
  };
  const hanldeTabChange = (selected) => {
    setselectedTabIndex(selected);
    setTabToKeepOpen(selected);
    if (
      selectedTabIndex !== selected &&
      tableAnnotations?.length > 0 &&
      getEdittedAnnotationCount() > 0
    ) {
      setDialogState(true);
    } else {
      setTableAnnotationInProgress(selected === 1 ? true : false);
    }
  };
  const updateTableEdittingAndToggleHighlight = (...args) => {
    let mode = args[1];
    highlightTableToggle(...args);
    if (mode === "EDIT") {
      setTableEditingInProgress(true);
    } else {
      setTableEditingInProgress(false);
    }
  };
  return (
    <Box className={classes.labelContainer}>
      <Typography className={classes.textHead}>LABEL / ANNOTATION</Typography>
      <Box className={classes.tabsContainer}>
        <CommonTabs
          tabs={{
            "Data Entities": {
              icon: <TextFieldsOutlinedIcon />,
              disabled: isTableEditingInProgress,
              componentDetails: (
                <Box
                  className={classes.scrollableLabelsContainer}
                  id={LabelContainerId}
                  onScroll={onScroll}
                >
                  <ScrollableLabelsContainer
                    getAnnotations={getAnnotations}
                    getAnnotationData={getAnnotationData}
                    imageLabels={imageLabels}
                    textAnnotations={textAnnotations}
                    selectAnnotationById={selectAnnotationById}
                    getProposals={getProposals}
                    setAnnotationAccuracy={setAnnotationAccuracy}
                    getAnnotationAccuracy={getAnnotationAccuracy}
                    checkIFAnnotationIntersectingWithTables={
                      checkIFAnnotationIntersectingWithTables
                    }
                    getAllTablesAnnotations={getAllTablesAnnotations}
                    getAllTableAnnProposals={getAllTableAnnProposals}
                    downloadCsv={downloadCsv}
                  />
                </Box>
              ),
            },
            "Data Tables": {
              icon: <TableChartOutlinedIcon />,
              componentDetails: (
                <Box className={classes.scrollableLabelsContainer}>
                  <TableContainer
                    resetTableAnnotations={resetTableAnnotations}
                    getAllTablesAnnotations={getAllTablesAnnotations}
                    updateTableAnnotationAndSelectedValue={
                      updateTableAnnotationAndSelectedValue
                    }
                    downloadCsv={downloadCsv}
                    tableAnnotations={tableAnnotations}
                    highlightTableToggle={updateTableEdittingAndToggleHighlight.bind(
                      this
                    )}
                    toggleHighlightCell={toggleHighlightCell}
                    saveImageData={saveImageData}
                  />
                </Box>
              ),
            },
          }}
          hanldeTabChange={(selectedIndex) => hanldeTabChange(selectedIndex)}
          selectedTab={tabToKeepOpen}
        />
      </Box>
      <ConfirmDialog
        open={dialogState}
        onCancel={() => {
          setDialogState(false);
          resetImageData();
          setTableAnnotationInProgress(selectedTabIndex === 1 ? true : false);
        }}
        onExtraAction={() => {
          setTabToKeepOpen(selectedTabIndex === 1 ? 0 : 1);
          setselectedTabIndex(selectedTabIndex === 1 ? 0 : 1);
          setDialogState(false);
        }}
        title={"Select if you want to save the existing annotations ?"}
        content={`Are you sure you want to save existing editing, once you select RESET, changes will no longer applicable.`}
        onConfirm={() => {
          setDialogState(false);
          saveImageData();
          setTableAnnotationInProgress(selectedTabIndex === 1 ? true : false);
        }}
        extraAction="Continue Editing"
        cancelText="Reset changes"
        okText="Save Changes"
      />
      ;
    </Box>
  );
};

class ScrollableLabelsContainer extends CanvasEventAttacher {
  state = {
    labels: [],
  };

  constructor(props) {
    super(props);
    this.eventListeners = [
      {
        event: CustomEventType.NOTIFY_LABEL_CREATION,
        func: (event) => {
          const {
            getAnnotations,
            selectAnnotationById,
            getProposals,
            setAnnotationAccuracy,
            getAnnotationAccuracy,
            checkIFAnnotationIntersectingWithTables,
            getAllTableAnnProposals,
          } = this.props;
          const annotations = getAnnotations() || [];
          const labels = [];
          annotations.forEach((ann, index) => {
            const isTableInterSection = checkIFAnnotationIntersectingWithTables(
              ann
            );
            const source = isTableInterSection
              ? getAllTableAnnProposals()
              : getProposals();
            const labelValue = getLabelValueFromProposals(ann, source);
            if (!ann.getLabelValue()) {
              ann.setLabelValue(labelValue?.value);
            }
            if (ann.getLabel() !== DefaultLabel.label_value) {
              labels.push(
                <Label
                  labelValue={ann.getLabelValue()}
                  setLabelValue={ann.setLabelValue}
                  confidence={labelValue.confidence}
                  words={labelValue.words}
                  key={uuid.v4()}
                  labelName={ann.getLabel()}
                  isRuled={ann.getRule()}
                  color={ann.color}
                  annotationId={ann.id}
                  selectAnnotationById={selectAnnotationById}
                  setAnnotationAccuracy={setAnnotationAccuracy}
                  getAnnotationAccuracy={getAnnotationAccuracy}
                />
              );
            }
          });
          this.setState({ labels });
        },
      },
      {
        event: CustomEventType.ON_ANNOTATION_SELECT,
        func: (event) => {
          const id = event.detail.id;
          const element = document.getElementById(`${LabelId}-${id}`);
          const labelContainer = document.getElementById(LabelContainerId);
          if (element) {
            const elementBounds = element.getBoundingClientRect();
            const labelContainerBounds = labelContainer.getBoundingClientRect();
            if (
              elementBounds.y < labelContainerBounds.y ||
              elementBounds.y + elementBounds.height >
                labelContainerBounds.y + labelContainerBounds.height
            ) {
              const scrollDifference = elementBounds.y - labelContainerBounds.y;
              labelContainer.scrollTo({
                top: scrollDifference,
                behavior: "smooth",
              });
            }
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

  renderComponent() {
    return (
      <Box>
        {this.props.imageLabels && this.props.imageLabels.length > 0 && (
          <Box>
            <TreeView>
              <TreeItem
                nodeId="1"
                label={
                  <Box style={{ display: "inline-flex", marginLeft: -21 }}>
                    <h4
                      style={{ color: "#0575ce", margin: "0.5rem 0 0.5rem 0" }}
                    >
                      <b>LABELS</b>
                    </h4>
                    <ChevronRightIcon
                      style={{ marginTop: "0.35rem", color: "#0575ce" }}
                    />
                  </Box>
                }
              >
                <Tags tags={this.props.imageLabels} />
              </TreeItem>
            </TreeView>
          </Box>
        )}
        <Box>
          <h4
            style={{
              color: "#0575ce",
              margin: "1.0rem 0 0.5rem 0",
              borderBottom: "dotted 1px",
              display: "inline-block",
              width: "100%",
            }}
          >
            <b>DATA INFORMATION</b>
            <Button
              style={{
                float: "right",
                padding: "0",
                color: "#0575ce",
                marginTop: "-10px",
              }}
              onClick={() => this.props.downloadCsv("onlyText")}
            >
              <ButtonContainer title="Download CSV">
                <CloudDownloadIcon fontSize="small" />
              </ButtonContainer>
            </Button>
          </h4>
          {this.state.labels}
        </Box>
      </Box>
    );
  }
}

const Tags = ({ tags }) => {
  const classes = useStyles();
  return (
    <Box className={classes.tagContainer}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          size={"small"}
          className={classes.tag}
          label={tag.label_name}
        />
      ))}
    </Box>
  );
};

const Label = ({
  labelName,
  color,
  labelValue,
  setLabelValue,
  annotationId,
  selectAnnotationById,
  confidence,
  isRuled,
  words,
  setAnnotationAccuracy,
  getAnnotationAccuracy,
}) => {
  const classes = useStyles();
  const [label, setLabel] = React.useState(labelValue);
  React.useEffect(() => {
    setLabel(labelValue);
  }, [labelValue]);
  const redTicked = words.some((w) => w.confidence_score < 0.5);
  const accuracy = getAnnotationAccuracy(annotationId);
  const [isRedTicked, setGreenTicked] = React.useState(
    accuracy === undefined ? redTicked : accuracy !== 1
  );
  const tick = (type) => {
    if (type === "green") {
      // 1 or revert
      setAnnotationAccuracy(annotationId, 0);
    } else {
      // 0 or revert
      setAnnotationAccuracy(annotationId, 1);
    }
    setGreenTicked(!isRedTicked);
  };
  return (
    <Box>
      <Box className={classes.labelName}>
        {labelName}
        {isRedTicked ? (
          <RedCheckbox checked={true} onClick={() => tick("red")} />
        ) : (
          <Checkbox checked={true} onClick={() => tick("green")} />
        )}
        {isRuled? <LabelImportant title="Rule Applied" style={{position: 'relative', top: '8px'}} />: '' }
      </Box>
      <Box
        className={classes.label}
        id={`${LabelId}-${annotationId}`}
        style={{
          borderLeft: `9px solid ${color}`,
        }}
      >
        <Tooltip title={label}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            value={label}
            // inputProps={{
            //   className: confidence > 0.5 ? classes.green : classes.red,
            // }}
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              const value = e.target.value;
              setLabel(value);
              setLabelValue(value);
              selectAnnotationById(annotationId);
            }}
            onFocus={(e) => {
              const value = e.target.value;
              setLabel(value);
              setLabelValue(value);
              selectAnnotationById(annotationId);
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

const RedCheckbox = withStyles({
  root: {
    color: "red",
    "&$checked": {
      color: "red",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);
