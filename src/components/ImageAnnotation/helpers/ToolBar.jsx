import React from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  Box,
  Button,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  withStyles,
} from "@material-ui/core";
import PanToolIcon from "@material-ui/icons/PanTool";
import FormatShapesIcon from "@material-ui/icons/FormatShapes";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { CustomEventType } from "../../../canvas/core/constants";
import AppsIcon from "@material-ui/icons/Apps";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CachedIcon from "@material-ui/icons/Cached";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { CanvasEventAttacher } from "../canvas/CanvasEventAttacher";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import GetAppIcon from "@material-ui/icons/GetApp";

const useClasses = makeStyles(() => ({
  button: {
    borderRadius: 0,
    margin: "0 0 0 0.2rem",
  },
  active: {
    background: "#0575ce",
    color: "#ffffff",
    borderRadius: 0,
    "&:hover": {
      background: "#0575ce",
      color: "#ffffff",
    },
  },
}));

const ToolBarButton = withStyles({
  label: {
    flexDirection: "column",
  },
})(({ label, icon, active, disabled, ...props }) => {
  const classes = useClasses();
  return (
    <Button
      className={`${active ? classes.active : ''} ${classes.button}`}
      disabled={disabled}
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
});

export class ToolBar extends CanvasEventAttacher {
  state = {
    shapesAnchor: null,
    selectMode: true,
    disableSelectMode: false,
    dragMode: true,
    activeTool: null,
    showProposals: false,
    hideAnnotations: false,
    deleteAllAnnotation: false,
  };

  eventListeners = [
    {
      event: CustomEventType.SET_ACTIVE_TOOL,
      func: (event) => {
        const activeTool = event.detail.toolType;
        if (!activeTool) {
          this.setState({ disableSelectMode: false });
        }
        this.setState({ activeTool: event.detail.toolType });
      },
    },
    {
      event: CustomEventType.NOTIFY_PROPOSAL_RESET,
      func: () => {
        this.setState({
          shapesAnchor: null,
          selectMode: true,
          disableSelectMode: false,
          dragMode: true,
          activeTool: null,
          showProposals: false,
          hideAnnotations: false,
          deleteAllAnnotation: false,
        });
      },
    },
  ];

  onSelectTool = () => {
    this.props.setActiveTool();
    this.props.blockAnnotationClick(true);
    this.setState({ disableSelectMode: true });
  };

  componentDidMount() {
    this.bindEventListeners();
  }

  componentWillUnmount() {
    this.unbindEventListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeTool && prevProps.checkIfTableAnnotation()) {
      this.props.unsetActiveTool();
      this.props.blockAnnotationClick(!this.state.selectMode);
      this.setState({ disableSelectMode: false });
    }
  }

  renderComponent() {
    return (
      <Box style={{boxShadow: "0 4px 18px 0px rgb(0 0 0 / 12%), 0 7px 10px -5px rgb(0 0 0 / 15%)", position: "relative", zIndex: 9}}>
        <ToolBarButton
          label="Select"
          active={this.state.selectMode}
          disabled={this.state.disableSelectMode}
          icon={
            this.state.selectMode ? (
              <CheckBoxIcon />
            ) : (
              <CheckBoxOutlineBlankIcon />
            )
          }
          data-name="select"
          onClick={() => {
            const selected = !this.state.selectMode;
            this.setState({ selectMode: selected });
            this.props.blockAnnotationClick(!selected);
          }}
        />
        <ToolBarButton
          active={this.state.dragMode}
          label="Drag/Pan"
          icon={<PanToolIcon />}
          data-name="pan"
          onClick={() => {
            const dragAllowed = !this.state.dragMode;
            this.setState({ dragMode: dragAllowed });
            this.props.setStageDraggable(dragAllowed);
          }}
        />
        <ToolBarButton
          active={this.state.activeTool}
          label="Shapes"
          disabled={
            this.state.hideAnnotations ||
            this.state.deleteAllAnnotation ||
            this.props.checkIfTableAnnotation()
          }
          icon={<FormatShapesIcon />}
          onClick={(e) => {
            if (this.state.activeTool) {
              this.props.unsetActiveTool();
              this.props.blockAnnotationClick(!this.state.selectMode);
              this.setState({ disableSelectMode: false });
            } else {
              this.setState({ shapesAnchor: e.target });
            }
          }}
        />
        <Menu
          open={Boolean(this.state.shapesAnchor)}
          anchorEl={this.state.shapesAnchor}
          onClose={(e) => this.setState({ shapesAnchor: null })}
        >
          <MenuItem
            data-name="create-box"
            onClick={(e) => {
              this.setState({ shapesAnchor: null });
              this.onSelectTool();
            }}
          >
            <ListItemText primary="Bounding Box" />
          </MenuItem>
          {/*<MenuItem data-name="create-polygon" onClick={(e)=>{ setShapesAnchor(null);onClickIconSidebarItem(e);}}>*/}
          {/*	<ListItemText primary="Polygon" />*/}
          {/*</MenuItem>*/}
        </Menu>
        <ToolBarButton
          active={this.state.showProposals}
          disabled={this.props.checkIfTableAnnotation()}
          label="Proposals"
          icon={<AppsIcon />}
          onClick={() => {
            const show = !this.state.showProposals;
            this.setState({ showProposals: show });
            this.props.showProposals(show);
          }}
        />
        <ToolBarButton
          disabled={this.props.checkIfTableAnnotation()}
          active={this.state.hideAnnotations}
          label={`${this.state.hideAnnotations ? "Show" : "Hide"}`}
          icon={
            this.state.hideAnnotations ? (
              <VisibilityIcon />
            ) : (
              <VisibilityOffIcon />
            )
          }
          onClick={() => {
            const hide = !this.state.hideAnnotations;
            this.setState({
              hideAnnotations: hide,
              deleteAllAnnotation: false,
            });
            this.props.showAnnotationLayer(
              !hide && !this.state.deleteAllAnnotation
            );
          }}
        />
        <ToolBarButton
          disabled={this.props.checkIfTableAnnotation()}
          active={this.state.deleteAllAnnotation}
          label={`${this.state.deleteAllAnnotation ? "Revert" : "Delete All"}`}
          icon={
            this.state.deleteAllAnnotation ? (
              <RestoreFromTrashIcon />
            ) : (
              <DeleteForeverIcon />
            )
          }
          onClick={() => {
            const hide = !this.state.deleteAllAnnotation;
            this.setState({
              deleteAllAnnotation: hide,
              hideAnnotations: false,
            });
            this.props.setDeleteAllAnnotation(true);
            this.props.showAnnotationLayer(
              !hide && !this.state.hideAnnotations
            );
          }}
        />
        <ToolBarButton
          label={"Reset/Clear"}
          icon={<CachedIcon />}
          onClick={this.props.reset}
        />
        <ToolBarButton
          disabled={this.props.checkIfTableAnnotation()}
          label={"Choose structure"}
          icon={<ShuffleIcon />}
          onClick={this.props.chooseStructure}
        />
        <ToolBarButton
          disabled={this.props.checkIfTableAnnotation()}
          label={"Save structure"}
          icon={<DashboardIcon />}
          onClick={this.props.saveStructure}
        />
        <ToolBarButton
          label={"Download CSV"}
          icon={<GetAppIcon />}
          onClick={this.props.downloadCsv}
        />
        <ToolBarButton
          style={{ float: "right" }}
          label="Exit"
          icon={<ExitToAppIcon />}
          onClick={this.props.onAnnotationToolClose}
        />
      </Box>
    );
  }
}
