import React from "react";
import CreatableSelect from "react-select/creatable"
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
import Box from "@material-ui/core/Box";
import { CreateModalDialog } from "../helpers/CreateModalDialog";
import MenuItem from "@material-ui/core/MenuItem";

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
        event: CustomEventType.SHOW_LABEL_DROPDOWN,
        func: (event) => {
          this.setState({
            position: event.detail.position,
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
    const show = this.state.show;
    return (
      <>
        {show && (
          <div
            style={{
              height: "auto",
              position: "absolute",
              opacity: 1,
              top: this.state.position.y,
              left: this.state.position.x,
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
          </MaterialSelect>
        )}
        {this.state.proposalMode && <BackgroundScreen />}
      </>
    );
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
}) => {
  const classes = useStyles();
  const annotation = getSelectedAnnotation();
  const labels = Object.assign([], imageLabels);
  const [labelValue, setLabelValue] = React.useState({
    value: !proposalMode ? annotation.getLabel() : DefaultLabel.label_value,
    label: !proposalMode
      ? annotation.getLabel() === DefaultLabel.label_value
        ? DefaultLabel.label_name
        : annotation.getLabel()
      : DefaultLabel.label_name,
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [creatableLabel, setCreatableLabel] = React.useState(undefined);
  return (
    <Paper className={classnames(classes.regionInfo)}>
      <Box style={{ width: 200 }}>
        <Box>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            {!proposalMode && (
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
            )}

            <div style={{ flexGrow: 1 }} />
            {!proposalMode && (
              <IconButton
                onClick={deleteAnnotation}
                tabIndex={-1}
                style={{ width: 22, height: 22 }}
                size="small"
                variant="outlined"
              >
                <TrashIcon style={{ marginTop: -8, width: 16, height: 16 }} />
              </IconButton>
            )}
          </Box>
          <br />
          <CreatableSelect
            placeholder="Tags"
            value={labelValue}
            onChange={(label) => {
							if (!label.__isNew__) {
								!proposalMode && setAnnotationLabel(label);
								setLabelValue(label);
							} else {
								setCreatableLabel(label.value)
								setModalOpen(true)
							}
						}}
            options={labels.map((label) => ({
              value: label.label_name,
              label: label.label_name,
              color: label.label_color,
            }))}
          />
          <Box style={{ marginTop: 4, display: "flex" }}>
            <Button
              onClick={() => setModalOpen(true)}
              size="small"
              variant="contained"
              color="primary"
            >
              Create Label
            </Button>
            <Box style={{ flexGrow: 1 }} />
            <Button
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
          setAnnotationLabel(label);
          setLabelValue(label);
          setModalOpen(false);
        }}
      />
    </Paper>
  );
};

const BackgroundScreen = () => {
  const classes = useStyles();
  return <Box className={classes.screen} />;
};
