import { Box, Tooltip, Typography } from "@material-ui/core";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CommonTabs from "../../CommonTabs";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import { CustomEventType } from "../../../canvas/core/constants";
import { getLabelValueFromTextAnnotations } from "../utilities";
import TextField from "@material-ui/core/TextField";

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
};

const useStyles = makeStyles(styles);

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
  getAnnotationData,
  removeConnectingLine,
  addConnectingLine,
	selectAnnotationById
}) => {
  const classes = useStyles();
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

  return (
    <Box className={classes.labelContainer}>
      <Typography className={classes.textHead}>LABEL / ANNOTATION</Typography>
      <Box className={classes.tabsContainer}>
        <CommonTabs
          tabs={{
            "Custom OCR": (
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
                />
              </Box>
            ),
            "Optimal OCR": (
              <Box className={classes.scrollableLabelsContainer}>
                Not Implemented
              </Box>
            ),
          }}
        />
      </Box>
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
            imageLabels,
            textAnnotations,
            getAnnotationData,
						selectAnnotationById
          } = this.props;
          const annotations = getAnnotations() || [];
          const labels = [];
          annotations.forEach((ann) => {
            const scaledData = getAnnotationData(ann);
            const labelValue = getLabelValueFromTextAnnotations(
              scaledData.label_points,
              textAnnotations
            );
            if (!ann.getLabelValue()) {
              ann.setLabelValue(labelValue);
            }
            if (
              imageLabels.find((label) => label.label_name === ann.getLabel())
            ) {
              labels.push(
                <Label
                  labelValue={ann.getLabelValue()}
                  setLabelValue={ann.setLabelValue}
                  key={ann.id}
                  labelName={ann.getLabel()}
                  color={ann.color}
                  annotationId={ann.id}
									selectAnnotationById={selectAnnotationById}
                />
              );
            }
          });
          this.setState({ labels });
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
    return <Box>{this.state.labels}</Box>;
  }
}

const Label = ({
  labelName,
  color,
  labelValue,
  setLabelValue,
  annotationId,
  selectAnnotationById
}) => {
  const classes = useStyles();
  const [label, setLabel] = React.useState(labelValue);
  React.useEffect(() => {
    setLabel(labelValue);
  }, [labelValue]);
  return (
    <Box>
      <Box className={classes.labelName}>{labelName}</Box>
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
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              const value = e.target.value;
              setLabel(value);
              setLabelValue(value);
							selectAnnotationById(annotationId)
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};
