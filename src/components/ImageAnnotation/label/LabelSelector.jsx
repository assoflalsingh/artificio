import React, { useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/Delete";
import { Select as MaterialSelect } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import { CustomEventType } from "../../../canvas/core/constants";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import Add from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import { CreateModalDialog } from "../helpers/CreateModalDialog";
import MenuItem from "@material-ui/core/MenuItem";
import { CreateRuleDialog } from "../helpers/CreateRuleDialog";
import { Edit } from "@material-ui/icons";

export const DefaultLabel = {
  label_name: "Label",
  label_value: "arto_others",
};

const styles = {
  regionInfo: {
    fontSize: 12,
    cursor: "default",
    transition: "opacity 200ms",
    fontWeight: 600,
    color: grey[900],
    padding: 8,
    "& .name": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .circle": {
        marginRight: 4,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.4)",
        width: 10,
        height: 10,
        borderRadius: 5,
      },
    },
    "& .tags": {
      "& .tag": {
        color: grey[700],
        display: "inline-block",
        margin: 1,
        fontSize: 10,
        textDecoration: "underline",
      },
    },
  },
  screen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "black",
    opacity: 0.7,
  },
};

const useStyles = makeStyles(styles);

export class LabelSelector extends CanvasEventAttacher {
  state = {
    show: false,
    position: { x: 0, y: 0 },
    proposalMode: false,
    showProposalOptionSelection: false,
    proposalOptionSelectionPosition: { x: 0, y: 0 },
  };

  showLabelSelector = (value) => {
    this.setState({ show: value });
  };

  resetProposalMode = () => {
    this.setState({ proposalMode: false });
  };

  constructor(props) {
    super(props);
    this.eventListeners = [
      {
        event: CustomEventType.ON_TABLE_INTERSECTION,
        func: (event) => {
          this.setState({
            isTableIntersection: true,
            showDialog: true,
          });
        },
      },
      {
        event: CustomEventType.SHOW_LABEL_DROPDOWN,
        func: (event) => {
          this.setState({
            position: event.detail.position,
            isTableIntersection: false,
            showDialog: false,
            proposalMode: event.detail.proposalMode,
          });
          this.showLabelSelector(true);
        },
      },
      {
        event: CustomEventType.HIDE_LABEL_DROPDOWN,
        func: (event) => {
          this.showLabelSelector(false);
          this.setState({
            proposalMode: event.detail && event.detail.proposalMode,
          });
        },
      },
      {
        event: "contextmenu",
        func: (event) => {
          event.preventDefault();
          const proposalTool = this.props.getProposalTool();
          if (proposalTool) {
            this.setState({
              showProposalOptionSelection: true,
              proposalOptionSelectionPosition: {
                x: event.x,
                y: event.y,
              },
            });
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
    // const {
    //   saveImageData,
    //   resetImageData,
    //   getEdittedAnnotationCount,
    // } = this.props;
    // const edditedAnnotationExist = getEdittedAnnotationCount();
    const show = this.state.show;
    // const isTableIntersection = this.state.isTableIntersection;
    // isTableIntersection (
    //   <ConfirmDialog
    //     open={this.state.showDialog}
    //     onCancel={() => {
    //       edditedAnnotationExist && resetImageData();
    //       this.setState({ showDialog: false });
    //     }}
    //     title={"Looks like you want to update a table ?"}
    //     content={`Why not update the table using our interactive table editing tool.Please save your existing work and go to the table edit view.`}
    //     onConfirm={() => {
    //       edditedAnnotationExist && saveImageData();
    //       this.setState({ showDialog: false });
    //     }}
    //     onExtraAction={() => {
    //       this.setState({ showDialog: false });
    //     }}
    //     extraAction="Continue Editing Text"
    //     cancelText="Reset All Changes"
    //     okText="Save Existing Changes"
    //   />
    // ) :
    // (
    return (
      <>
        {show && !this.props.checkIfTableAnnotation() && (
          <div
            style={{
              height: "auto",
              position: "absolute",
              opacity: 1,
              top: this.state.position.y,
              left:
                this.state.position.x <= 150
                  ? this.state.position.x
                  : this.state.position.x - 80,
              zIndex: 1000,
            }}
          >
            <Label
              showLabelSelector={this.showLabelSelector}
              deSelectActiveAnnotation={this.props.deSelectActiveAnnotation}
              imageLabels={this.props.imageLabels}
              deleteAnnotation={this.props.deleteAnnotation}
              getSelectedAnnotation={this.props.getSelectedAnnotation}
              setAnnotationLabel={
                this.state.proposalMode
                  ? (label) => {
                      this.props.getProposalTool().assignLabel(label);
                    }
                  : this.props.setAnnotationLabel
              }
              proposalMode={this.state.proposalMode}
              resetProposalMode={this.resetProposalMode}
              getAnnotatedValue={this.props.getAnnotatedValue}
              getImageModelData={this.props.getImageModelData}
              api={this.props.api}
              rulePatterns={this.props.rulePatterns}
              convertCoorToPoints={this.props.convertCoorToPoints}
            />
          </div>
        )}

        {this.state.showProposalOptionSelection && (
          <MaterialSelect
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              left: this.state.proposalOptionSelectionPosition.x,
              top: this.state.proposalOptionSelectionPosition.y,
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            open={true}
          >
            <MenuItem
              value={""}
              onClick={() => {
                this.props.getProposalTool().createAnnotation();
                this.setState({ showProposalOptionSelection: false });
              }}
            >
              Merge
            </MenuItem>
            <MenuItem
              value={""}
              onClick={() => {
                this.props.getProposalTool().showLabelDropDown();
                this.setState({ showProposalOptionSelection: false });
              }}
            >
              Assign Label
            </MenuItem>
            <MenuItem
              value={""}
              onClick={() => {
                this.props.getProposalTool().deleteProposals();
                this.setState({ showProposalOptionSelection: false });
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              value={""}
              onClick={() => {
                this.setState({ showProposalOptionSelection: false });
              }}
            >
              Cancel
            </MenuItem>
          </MaterialSelect>
        )}
        {this.state.proposalMode && <BackgroundScreen />}
      </>
    );
  }
}

const iconStyle = { marginTop: -2, width: 20, height: 16 };
const getUpdatedLabel = (annotation,proposalMode) => {
  return {
    value: !proposalMode ? annotation.getLabel() : DefaultLabel.label_value,
    label: !proposalMode
      ? annotation.getLabel() === DefaultLabel.label_value
        ? DefaultLabel.label_name
        : annotation.getLabel()
      : DefaultLabel.label_name,
      color: annotation.color
  }
}

/**
 *
 * imageLabels: {
  "label_name": string,
  "label_shape": string",
  "label_datatype": string",
  "label_color": string
	}
 */

const Label = ({
  showLabelSelector,
  deSelectActiveAnnotation,
  imageLabels,
  deleteAnnotation,
  getSelectedAnnotation,
  setAnnotationLabel,
  proposalMode,
  resetProposalMode,
  getAnnotatedValue,
  getImageModelData,
  api,
  rulePatterns,
  convertCoorToPoints,
}) => {
  const classes = useStyles();
  const annotation = getSelectedAnnotation();
  const labels = Object.assign([], imageLabels);
  const [labelValue, setLabelValue] = React.useState(getUpdatedLabel(annotation,proposalMode));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [ruleModalOpen, setRuleModalOpen] = React.useState(false);
  const [creatableLabel, setCreatableLabel] = React.useState(undefined);
  const [ruleData, setRuleData] = React.useState(undefined);
  const isReady = !labelValue?.value || labelValue.value === DefaultLabel.label_value ? true : false;
  const hasRule = annotation.getRule();

  useEffect(() => {
    if(annotation.getLabel() !== labelValue.value){
      setLabelValue(getUpdatedLabel(annotation,proposalMode));
    }
  },[annotation, labelValue, proposalMode]);

  return (
    <Paper className={classnames(classes.regionInfo)} style={{ border: "1px solid #ccc", boxShadow: "0 4px 18px 0px rgb(0 0 0 / 12%), 0 7px 10px -5px rgb(0 0 0 / 15%)"}}>
      <Box style={{ width: 185 }}>
        <Box>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            {/* {!proposalMode && (
              <div
                style={{
                  display: "flex",
                  backgroundColor: annotation.color || "#888",
                  color: "#fff",
                  padding: 4,
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 4,
                  fontWeight: "bold",
                  textShadow: "0px 0px 5px rgba(0,0,0,0.4)",
                }}
              >
                {annotation.type}
              </div>
            )} */}

            <Button
              disabled={isReady}
              onClick={() => setRuleModalOpen(true)}
              size="small"
              variant="contained"
              color="primary"
            >{hasRule && <Edit style={iconStyle} />}
            {!hasRule && <Add style={iconStyle} />} Rule
            </Button>

            <div style={{ flexGrow: 1 }} />
            {!proposalMode && (
              <IconButton
                onClick={deleteAnnotation}
                tabIndex={-1}
                style={{ width: 22, height: 22 }}
                size="small"
                variant="outlined"
              >
                <TrashIcon style={iconStyle} />
              </IconButton>
            )}
          </Box>
          <CreatableSelect
            styles={{
              control: base => ({
                ...base,
                margin: "10px 0",
              })
            }}
            placeholder="Tags"
            value={labelValue}
            onChange={(label) => {
              if (!label.__isNew__) {
                !proposalMode && setAnnotationLabel(label);
                setLabelValue(label);
              } else {
                setCreatableLabel(label.value);
                setModalOpen(true);
              }
            }}
            options={labels.map((label) => ({
              value: label.label_name,
              label: label.label_name,
              color: label.label_color,
            }))}
          />
          <Box style={{ display: "flex" }}>
            <Button
              onClick={() => setModalOpen(true)}
              size="small"
              variant="contained"
              color="primary"
            ><Add style={iconStyle} /> Label
            </Button>
            <Box style={{ flexGrow: 1 }} />
            <Button
              disabled={isReady}
              onClick={() => {
                if (proposalMode) {
                  // point to active too assign label
                  setAnnotationLabel(labelValue);
                  resetProposalMode();
                } else {
                  deSelectActiveAnnotation();
                }
                showLabelSelector(false);
              }}
              size="small"
              variant="contained"
              color="primary"
            >
              <CheckIcon />
            </Button>
          </Box>
        </Box>
      </Box>

      <CreateModalDialog
        modalOpen={modalOpen}
        typedText={creatableLabel}
        onClose={() => setModalOpen(false)}
        createLabel={(label) => {
          label.rule = ruleData;
          setAnnotationLabel(label);
          setLabelValue(label);
          setModalOpen(false);
        }}
      />
      <CreateRuleDialog
        modalOpen={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        createRule={(ruleData) => {
          labelValue.rule = {...ruleData};
          console.log(labelValue);
          setAnnotationLabel(labelValue);
          setRuleData(ruleData);
          setRuleModalOpen(false);
        }}
        getSelectedAnnotation={getSelectedAnnotation}
        getAnnotatedValue={getAnnotatedValue}
        getImageModelData={getImageModelData}
        api={api}
        rulePatterns={rulePatterns}
        convertCoorToPoints={convertCoorToPoints}
      />
    </Paper>
  );
};

const BackgroundScreen = () => {
  const classes = useStyles();
  return <Box className={classes.screen} />;
};
