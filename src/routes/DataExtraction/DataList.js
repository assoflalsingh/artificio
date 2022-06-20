import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Popover,
  Snackbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import MUIDataTable from "mui-datatables";
import {
  CompactButton,
  RefreshIconButton,
} from "../../components/CustomButtons";
import TableFilterPanel from "../../components/TableFilterPanel";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import { getInstance, URL_MAP } from "../../others/artificio_api.instance";
import Alert from "@material-ui/lab/Alert";
import { ImageAnnotationDialog } from "../../components/ImageAnnotation/ImageAnnotationDialog";
import DataGroup from "./DataGroup";
import Labels from "./Labels";
import {
  MemoryRouter,
  Route,
  Switch as RouteSwitch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Loader from "../../components/ImageAnnotation/helpers/Loader";
import {
  Form,
  FormInputText,
  FormRow,
  FormRowItem,
  doValidation,
} from "../../components/FormElements";
import SelectModelDialog from "../../components/SelectModelDialog";
import AssignDataGroup from "./AssignDataGroup";
import AssignDataStructure from "./AssignDataStructure";
import { ArrowDropDownCircle } from "@material-ui/icons";
import useApi from "../../hooks/use-api";

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: "auto",
  },
  playBtn: {
    border: "solid 1px #0575CF",
  },
  ml1: {
    marginLeft: "1rem",
  },
  arrowbutton: {
    cursor: "pointer",
    marginLeft: "1rem",
    "border-bottom-right-radius": 0,
    "border-top-right-radius": 0,
    background: "#0575CF",
    border: "solid 1px #0575CF",
    width: "auto",
    "min-width": 40,
  },
  arrowBtnClass: {
    "border-bottom-left-radius": 0,
    "border-top-left-radius": 0,
    width: 32,
    padding: 0,
    margin: 0,
    "min-width": 20,
    "border-left": "solid 2px #ffffff",
  },
  root: {
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  contentColumn: {
    textAlign: "center",
    border: "solid 1px gray",
    borderRadius: "10px",
    height: "40px",
    padding: "0px",
    fontSize: "18px",
    maxWidth: "120px",
  },
  headingColumn: {
    height: "50px",
    color: "gray",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noBorder: {
    border: "none",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const createModelDefault = {
  new_model_name: "",
  new_model_desc: "",
  new_model_type: "classifier",
};

function DataList(props) {
  const { history, uploadCounter } = props;
  const classes = useStyles();
  const [annotateOpen, setAnnotateOpen] = useState(false);
  const api = getInstance(localStorage.getItem("token"));
  const [massAnchorEl, setMassAnchorEl] = useState();
  const [createModelDialogStatus, setCreateModelDialogStatus] = useState();
  const [createModelFormData, setCreateModelFormData] = useState(createModelDefault);
  const [showModelListDialog, setShowModelListDialog] = useState();
  const [isTrainingReqInProcess, setIsTrainingReqInProcess] = useState(false);
  const [createModelErr, setCreateModelErr] = useState({});
  const [rowsSelected, setRowsSelected] = useState([]);
  const [showAssignDG, setShowAssignDG] = useState(false);
  const [showAssignStruct, setShowAssignStruct] = useState(false);
  const [pageMessage, setPageMessage] = useState(null);
  const [datalistMessage, setDatalistMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [unFilteredData, setUnFilteredData] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(1);
  const [modelsList, setModelsList] = useState([]);
  const [openPredict, setOpenPredict] = React.useState(false);
  const predictRef = useRef();
  const {apiRequest, error} = useApi();
  const [dglist, setDgList] = useState([]);

  const createModelFormValidators = {
    new_model_name: {
      validators: [
        "required",
        { type: "regex", param: "^[A-Za-z0-9_]{1,20}$" },
      ],
      messages: [
        "This field is required",
        "Only alpha-numeric & underscore allowed with max length of 20.",
      ],
    },
    new_model_desc: {
      validators: ["required", { type: "regex", param: "^.{0,200}$" }],
      messages: [
        "This field is required",
        "Text allowed with max length of 200.",
      ],
    },
  };
  const columns = [
    {
      name: "file",
      label: "Filename",
      options: {
        filter: true,
        sort: true,
        draggable: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "page_no",
      label: "Page",
      options: {
        filter: true,
        sort: true,
        draggable: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "datagroup_name",
      label: "Data Group",
      options: {
        filter: true,
        sort: true,
        draggable: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "struct_name",
      label: "Data structure",
      options: {
        filter: true,
        sort: true,
        draggable: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "img_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return (
            <Chip
              size="small"
              label={value?.replace("-", " ").toUpperCase()}
              variant="outlined"
            />
          );
        },
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type: "string",
    },
    {
      name: "timestamp",
      label: "Date time",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        },
      },
      possibleComparisons: ["gt", "lt", "drange"],
      type: "datetime",
    },
  ];

  const options = {
    selectableRows: "multiple",
    searchPlaceholder: "Enter keywords",
    filterType: "checkbox",
    elevation: 0,
    filter: false,
    print: false,
    draggableColumns: { enabled: true },
    selectToolbarPlacement: "none",
    sortOrder: {
      name: "timestamp",
      direction: "desc",
    },
    responsive: "vertical",
    setTableProps: () => {
      return {
        size: "small",
      };
    },
    rowsSelected: rowsSelected,
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelectedNow
    ) => {
      setRowsSelected(rowsSelectedNow);
    },
  };

  const onMassMenuClick = (event) => {
    setMassAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMassAnchorEl(null);
  };
  const sendFileDetailsForExtraction = () => {
    let errorMessage = "";
    let massExtractionPayload = {
      data_lists: [],
    };
    rowsSelected.map((row) => {
      if (datalist[row].img_status !== "ready" && !datalist[row].struct_id) {
        errorMessage =
          "Structure id and Ready Status is missing for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
      } else if (
        datalist[row].img_status !== "ready" &&
        datalist[row].struct_id
      ) {
        errorMessage = "Status is not Ready for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
      } else if (
        datalist[row].img_status === "ready" &&
        !datalist[row].struct_id
      ) {
        errorMessage = "Structure id is missing for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
      } else {
        let existingFileIndexWithSameId = massExtractionPayload.data_lists.findIndex(
          (o) => o.id === datalist[row]._id
        );
        if (
          massExtractionPayload.data_lists &&
          existingFileIndexWithSameId >= 0
        ) {
          massExtractionPayload["data_lists"][
            existingFileIndexWithSameId
          ].images.push({
            struct_id: datalist[row].struct_id,
            datagroup_name: datalist[row].datagroup_name,
            datagroup_id: datalist[row].datagroup_id,
            img_json: datalist[row].img_json,
            img_status: datalist[row].img_status,
            img_name: datalist[row].image_name,
            page_no: datalist[row].page_no,
          });
        } else {
          massExtractionPayload.data_lists.push({
            id: datalist[row]._id,
            images: [
              {
                struct_id: datalist[row].struct_id,
                datagroup_name: datalist[row].datagroup_name,
                datagroup_id: datalist[row].datagroup_id,
                img_json: datalist[row].img_json,
                img_status: datalist[row].img_status,
                img_name: datalist[row].image_name,
                page_no: datalist[row].page_no,
              },
            ],
          });
        }
      }
      return row;
    });
    if (massExtractionPayload.data_lists.length > 0 && !errorMessage) {
      console.log(massExtractionPayload);
      api
        .post(URL_MAP.MASS_EXTRACTION_API, {
          ...massExtractionPayload,
        })
        .then(() => {
          setAjaxMessage({
            error: false,
            text: "Request in progress !!",
          });
        })
        .catch((error) => {
          if (error.response) {
            setAjaxMessage({
              error: true,
              text:
                error?.response?.data.message ||
                "There is some technial issue with this request please try again in some time.",
            });
          } else {
            setAjaxMessage({
              error: true,
              text:
                error?.response?.data.message ||
                "There is some technial issue with this request please try again in some time.",
            });
          }
        })
        .then(() => {
          setPageMessage(null);
        });
    }
  };
  const onAssignData = (type, id, name) => {
    handleClose();
    setPageMessage("Assigning...");
    let data_lists = {};
    rowsSelected.map((i) => {
      let row = datalist[i];
      data_lists[row._id] = data_lists[row._id] || [];
      data_lists[row._id].push(row.page_no);
      return i;
    });

    api
      .post(URL_MAP.ASSIGN_DATA, {
        type: type,
        datum: id,
        data_lists: data_lists,
      })
      .then(() => {
        setAjaxMessage({
          error: false,
          text: "Assignment success !!",
        });
        let newDatalist = [...datalist];
        rowsSelected.forEach((i) => {
          if (type === "datagroup") {
            newDatalist[i].datagroup_id = id;
            newDatalist[i].datagroup_name = name;
          } else {
            newDatalist[i].struct_name = name;
          }
        });
        setDatalist(newDatalist);
      })
      .catch((error) => {
        if (error.response) {
          setAjaxMessage({
            error: true,
            text: error.response.data.message,
          });
        } else {
          console.error(error);
        }
      })
      .then(() => {
        setPageMessage(null);
      });
  };

  const onDeleteFiles = async () => {
    setMassAnchorEl(null);
    setPageMessage("Deleting the files...");
    let allResp = await Promise.all(
      rowsSelected.map(async (i) => {
        let row = datalist[i];
        try {
          await api.post(URL_MAP.UPDATE_FILE_STATUS, {
            document_id: row._id,
            page_no: row.page_no,
            status: "deleted",
          });
          return i;
        } catch (error) {
          return error;
        }
      })
    );
    let newDatalist = datalist.filter((v, i) => allResp.indexOf(i) === -1);

    for (let i = 0; i < allResp.length; i++) {
      if (typeof allResp[i] != "number") {
        let error = allResp[i];
        if (error.response) {
          setAjaxMessage({
            error: true,
            text: error.response.data.message,
          });
        } else {
          console.error(error);
        }
      }
    }
    setRowsSelected([]);
    setDatalist(newDatalist);
    setPageMessage(null);
  };
  const onCreateModelAPI = () => {
    onTrainRetrainModel(
      createModelFormData.new_model_name,
      createModelFormData.new_model_desc,
      createModelFormData.new_model_type,
      "train"
    );
  };

  const onTrainRetrainModel = async (
    model_name,
    model_desc,
    model_type,
    model_action,
    version,
    modelID
  ) => {
    let errorMessage = "";
    let createModelPayload = {
      model_name: model_name,
      model_desc: model_desc,
      model_type: model_type,
      action: model_action,
      data_lists: [],
    };
    if (model_action === "predict" || model_action === "retrain") {
      delete createModelPayload["model_type"];
      delete createModelPayload["model_name"];
      delete createModelPayload["model_desc"];
      createModelPayload["model_id"] = modelID || "";
      createModelPayload["version"] = version || "";
    }
    rowsSelected.map((row) => {
      if (model_action === "predict")
        datalist[row].struct_id = "temp_strucutre_to_remove_for_predict";
      // show error if selected file has status new
      if (datalist[row].img_status === "new") {
        errorMessage = "Status is not Ready or Classified for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
        return false;
      }
      // structure id is missing
      if (model_action !== "predict" && !datalist[row].struct_id) {
        errorMessage = "Structure id is missing for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
      }
      // Datagroup id is missing
      else if (model_action !== "predict" && !datalist[row].datagroup_id) {
        errorMessage = "Datagroup id is missing for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
      } else {
        let existingFileIndexWithSameId = createModelPayload.data_lists.findIndex(
          (o) => o.id === datalist[row]._id
        );
        if (createModelPayload.data_lists && existingFileIndexWithSameId >= 0) {
          createModelPayload["data_lists"][
            existingFileIndexWithSameId
          ].images.push({
            struct_id:
              model_action === "predict" ? "" : datalist[row].struct_id,
            datagroup_id:
              model_action === "predict"
                ? ""
                : datalist[row].datagroup_id
                ? datalist[row].datagroup_id
                : "",
            img_json: datalist[row].img_json,
            img_status: datalist[row].img_status,
            img_name: datalist[row].image_name,
            page_no: datalist[row].page_no,
          });
        } else {
          createModelPayload.data_lists.push({
            _id: datalist[row]._id,
            images: [
              {
                struct_id:
                  model_action === "predict" ? "" : datalist[row].struct_id,
                datagroup_id:
                  model_action === "predict"
                    ? ""
                    : datalist[row].datagroup_id
                    ? datalist[row].datagroup_id
                    : "",
                img_json: datalist[row].img_json,
                img_status: datalist[row].img_status,
                img_name: datalist[row].image_name,
                page_no: datalist[row].page_no,
              },
            ],
          });
        }
      }
      return row;
    });
    console.log("createModelPayload", createModelPayload);
    if (createModelPayload.data_lists.length > 0 && !errorMessage) {
      setIsTrainingReqInProcess(true);
      setCreateModelDialogStatus(false);
      api
        .post(URL_MAP.TRAIN_RETRAIN_MODEL, {
          ...createModelPayload,
        })
        .then((response) => {
          setIsTrainingReqInProcess(false);
          setAjaxMessage({
            error: false,
            text: response.data,
          });
          fetchModels();
          setCreateModelFormData(createModelDefault);
        })
        .catch((error) => {
          if (error.response) {
            setIsTrainingReqInProcess(false);
            setAjaxMessage({
              error: true,
              text:
                error?.response?.data.message ||
                "There is some technial issue with this request please try again in some time.",
            });
          } else {
            setIsTrainingReqInProcess(false);
            setAjaxMessage({
              error: true,
              text:
                error?.response?.data.message ||
                "There is some technial issue with this request please try again in some time.",
            });
          }
        })
        .then(() => {
          setIsTrainingReqInProcess(false);
          setPageMessage(null);
        });
    }
  };
  const validateField = (name, value) => {
    let errMsg = "";
    let fieldValidators = createModelFormValidators[name];
    if (fieldValidators) {
      value = value && value?.toString().length > 0 ? value : "";
      errMsg = doValidation(
        value,
        fieldValidators.validators,
        fieldValidators.messages
      );
      setCreateModelErr((prevErr) => ({
        ...prevErr,
        [name]: errMsg,
      }));
    }
    return errMsg;
  };

  const onTextChange = (e, name) => {
    let value = e;
    if (e.target) {
      name = e.target.name;
      value = e.target.value;
    }
    setCreateModelFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value);
  };

  const parseGetDataList = (data) => {
    let newData = [];
    data.forEach((datum) => {
      let newRecord = {
        _id: datum._id,
        timestamp: datum.timestamp,
        created_by: datum.created_by,
        file: datum.file,
      };
      Object.keys(datum.images).forEach((page) => {
        newData.push({
          ...newRecord,
          page_no: page,
          img_json: datum.images[page].img_json,
          image_name: datum.images[page].img_name,
          img_status: datum.images[page].img_status,
          datagroup_name: datum.images[page].datagroup_name,
          datagroup_id: datum.images[page].datagroup_id,
          struct_name: datum.images[page].struct_name,
          struct_id: datum.images[page].struct_id,
          img_thumb: datum.images[page].img_thumb,
        });
      });
    });
    return newData;
  };
  const filterDataList = (filteredResult) => {
    setDatalistMessage("Filtering data...");
    setDatalist([]);
    setRowsSelected([]);
    setDatalist(filteredResult);
    setDatalistMessage(null);
  };
  const fetchDataList = () => {
    setDatalistMessage("Loading data...");
    setDatalist([]);
    setRowsSelected([]);
    api
      .get(URL_MAP.GET_DATA_LIST, { params: {status:["new","ready","classified","ner predicted","ner predict queue","started ner predict"] }})
      .then((res) => {
        let data = res.data.data;
        let contr = refreshCounter + 1;
        setRefreshCounter(contr);
        let parsedResult = parseGetDataList(data.data_lists);
        setUnFilteredData([...parsedResult]);
        setDatalist(parsedResult);
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setDatalistMessage(null);
      });
  };
  const ResetAllFilters = () => {
    setDatalist([...unFilteredData]);
  };
  const closeAnnotationTool = (wasUpdated) => {
    if (wasUpdated) {
      fetchDataList();
    }
    setAnnotateOpen(false);
  };
  const fetchModels = async () => {
    try {
      setIsTrainingReqInProcess(true);
      const models = await api.post(URL_MAP.GET_ALL_MODELS, {
        model_type: "classifier",
      });
      setModelsList(models.data?.model_list || []);
      setIsTrainingReqInProcess(false);
    } catch (error) {
      setIsTrainingReqInProcess(false);
      setAjaxMessage({
        error: true,
        text:
          "Could not fetch all the available models, Please refresh the page",
      });
    }
  };

  const hideErrorMessage = () => {
    setAjaxMessage(null);
  };
  // API CALL on did mount for getting all the Models.
  useEffect(() => {
    fetchModels();

    apiRequest({url: URL_MAP.GET_DATAGROUPS}, (resp) => {
      setDgList(resp.datagroups);
    });

    if (!uploadCounter) return;
    fetchDataList();

  }, [uploadCounter]);

  const handlePredictClose = (event) => {
    if (predictRef.current && predictRef.current.contains(event.target)) {
      return;
    }
    setOpenPredict(false);
  };

  const handleToggle = () => {
    setOpenPredict(prevState => !prevState);
  }

  const predictNER = () => {
    handleToggle();
    let params = [];
    let errors = [];
    rowsSelected.forEach((row) => {
      if(datalist[row].datagroup_id === undefined){
        errors.push(`Please assign Data group to the ${datalist[row].file} file.`);
      }
      let param = {datagroup_id: datalist[row].datagroup_id, files: [datalist[row].image_name]};
      dglist.forEach((dg) => {
        if(param.datagroup_id === dg._id){
          if(dg.ptm.length < 1){
            errors.push(`Pretrained model assignment missing for Data group ${datalist[row].datagroup_id}.`);
          }else{
            param.model_id = dg.ptm;
          }
        }
      });
      params.push(param);
    });

    if(errors.length > 0){
      setAjaxMessage({
        error: true,
        text: errors.join('\n'),
      });
    }else{
      apiRequest({url: URL_MAP.PREDICT_NER, method: 'post', params: {data: params}}, (resp) => {
        setAjaxMessage({
          error: false,
          text: resp,
        });
      });
      error && console.log(error);
    }
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={Boolean(pageMessage)}>
        <CircularProgress color="inherit" />
        <Typography style={{ marginLeft: "0.25rem" }} variant="h4">
          {pageMessage}
        </Typography>
      </Backdrop>
      <Snackbar
        open={Boolean(ajaxMessage)}
        autoHideDuration={6000}
        onClose={hideErrorMessage}
      >
        {ajaxMessage && (
          <Alert
            onClose={hideErrorMessage}
            severity={ajaxMessage.error ? "error" : "success"}
          >
            {ajaxMessage.error ? "Error occurred: " : ""}
            {ajaxMessage.text}
          </Alert>
        )}
      </Snackbar>
      <Box style={{ display: "flex", flexWrap: "wrap", margin: "15px 0px" }}>
        <Typography color="primary" variant="h6">
          Data List
        </Typography>
        <RefreshIconButton
          className={classes.ml1}
          label="Refresh"
          onClick={() => {
            fetchDataList();
          }}
        />
        <CompactButton
          className={classes.ml1}
          label="Labels"
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("labels");
          }}
        />
        <CompactButton
          className={classes.ml1}
          label="Data Groups"
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("dg");
          }}
        />
        <Box className={classes.rightAlign}>
          <Button
            style={{
              height: '2rem'
            }}
            className={classes.playBtn}
            disabled={rowsSelected.length === 0}
            onClick={() => {
              setAnnotateOpen(true);
            }}
          >
            <PlayCircleFilledIcon color="primary" />
            &nbsp; Annotation
          </Button>
          <Tooltip title="Text Classification" aria-label="Text Classification">
          <CompactButton
            className={classes.ml1}
            label="Train"
            variant="contained"
            color="primary"
            disabled={rowsSelected.length === 0}
            onClick={() => {
              setCreateModelDialogStatus(true);
            }}
          />
          </Tooltip>
          <Tooltip title="Text Classification" aria-label="Text Classification" placement="top">
          <CompactButton
            className={classes.ml1}
            label="Re-Train"
            variant="contained"
            color="primary"
            disabled={rowsSelected.length === 0}
            onClick={() => {
              setMassAnchorEl(null);
              setShowModelListDialog("retrain");
            }}
          />
          </Tooltip>
          <Button ref={predictRef} className={classes.ml1}
            variant="contained"
            label="Predict"
            size="small"
            color="primary"
            onClick={() => handleToggle()}
            disabled={rowsSelected.length === 0}
          >
            Predict &nbsp;
            <ArrowDropDownCircle />
          </Button>
          <Popover open={openPredict} anchorEl={predictRef.current} role={undefined} transition disablePortal
            onClose={handlePredictClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              onClick={(event) => {
                setMassAnchorEl(null);
                setShowModelListDialog("predict");
              }}
              >Classification
            </MenuItem>
            <MenuItem
              onClick={(event) => {
                setMassAnchorEl(null);
                predictNER();
              }}
              >Predict NER
            </MenuItem>
        </Popover>
          {isTrainingReqInProcess && <Loader />}
          {/* Dialog for Selecting Existing Model */}
          <SelectModelDialog
            showFilterPanel={showModelListDialog}
            setDialogDisplay={setShowModelListDialog}
            modelData={modelsList}
            onModelSelection={(name, desc, modelID, version) => {
              onTrainRetrainModel(
                name,
                desc,
                createModelFormData.new_model_type,
                showModelListDialog,
                version,
                modelID
              );
              setShowModelListDialog(false);
            }}
          />
          {/* Dialog for Creating Model */}
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={createModelDialogStatus}
            scroll={"paper"}
            onClose={() => setCreateModelDialogStatus(false)}
            maxWidth="sm"
          >
            <DialogContent>
              <Typography variant="h5">Enter Model Details</Typography>
              <Form>
                <FormRow>
                  <FormRowItem>
                    <FormInputText
                      label="Model name:"
                      required
                      name="new_model_name"
                      placeholder="Model name here."
                      value={createModelFormData.new_model_name}
                      errorMsg={createModelErr.new_model_name}
                      onChange={onTextChange}
                    />
                  </FormRowItem>
                  <FormRowItem>
                    <FormInputText
                      label="Model Description:"
                      required
                      name="new_model_desc"
                      placeholder="Model description here.."
                      value={createModelFormData.new_model_desc}
                      errorMsg={createModelErr.new_model_desc}
                      onChange={onTextChange}
                    />
                  </FormRowItem>
                </FormRow>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setCreateModelDialogStatus(false);
                }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                autoFocus
                onClick={() => {
                  onCreateModelAPI();
                }}
                color="primary"
                variant="contained"
                disabled={
                  !createModelFormData.new_model_name ||
                  !createModelFormData.new_model_desc
                }
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <AssignDataGroup
        open={showAssignDG}
        onClose={() => {
          setShowAssignDG(false);
        }}
        onOK={onAssignData}
        api={api}
      />
      <AssignDataStructure
        open={showAssignStruct}
        onClose={() => {
          setShowAssignStruct(false);
        }}
        onOK={onAssignData}
        api={api}
      />
      <>
        <Box display="flex">
          <Button
            name="mass-action"
            disabled={rowsSelected.length === 0}
            variant="outlined"
            style={{ height: "2rem" }}
            size="small"
            endIcon={<ChevronRightOutlinedIcon />}
            onClick={onMassMenuClick}
          >
            Mass action
          </Button>
          {rowsSelected.length > 0 && (
            <Typography
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                marginLeft: "0.25rem",
              }}
            >
              {rowsSelected.length} selected.
            </Typography>
          )}
          {datalistMessage && (
            <>
              {" "}
              <CircularProgress
                size={24}
                style={{ marginLeft: 15, position: "relative", top: 4 }}
              />
              <Typography style={{ alignSelf: "center" }}>
                &nbsp;{datalistMessage}
              </Typography>
            </>
          )}
          <TableFilterPanel
            refreshCounter={refreshCounter}
            unFilteredData={unFilteredData}
            disabled={unFilteredData.length === 0}
            onApplyFilter={filterDataList}
            coloumnDetails={columns}
            onResetAllFilters={ResetAllFilters}
          />
        </Box>
        <Popover
          open={Boolean(massAnchorEl) && massAnchorEl.name === "mass-action"}
          onClose={handleClose}
          anchorEl={massAnchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              setMassAnchorEl(null);
              setShowAssignDG(true);
            }}
          >
            Assign Data Group
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMassAnchorEl(null);
              setShowAssignStruct(true);
            }}
          >
            Assign Data Structure
          </MenuItem>
          <MenuItem
            onClick={() => {
              sendFileDetailsForExtraction();
            }}
          >
            Mass data extraction
          </MenuItem>
          <MenuItem onClick={onDeleteFiles}>Delete files</MenuItem>
        </Popover>
      </>
      <MUIDataTable
        title={
          <>
            <Typography color="primary" variant="h8">
              Please select file(s) for annotation
            </Typography>
          </>
        }
        data={datalist}
        columns={columns}
        options={options}
      />
      <ImageAnnotationDialog
        open={annotateOpen}
        onClose={(wasUpdated) => {
          closeAnnotationTool(wasUpdated);
        }}
        api={api}
        getImages={() => rowsSelected.map((i) => datalist[i])}
      />
    </>
  );
}

function RouterBackButton() {
  const history = useHistory();
  const location = useLocation();
  if (location.pathname === "/") {
    return <></>;
  }
  return (
    <Button
      startIcon={<ChevronLeftOutlinedIcon />}
      onClick={() => {
        history.goBack();
      }}
    >
      Back
    </Button>
  );
}

export default function(props) {
  const classes = useStyles();
  const { uploadCounter, annotationSuccessCB } = props;
  return (
    <Box className={classes.root}>
      <MemoryRouter>
        <RouterBackButton />
        <RouteSwitch>
          <Route
            exact
            path="/"
            render={(props) => (
              <DataList
                uploadCounter={uploadCounter}
                annotationSuccessCB={annotationSuccessCB}
                {...props}
              />
            )}
          ></Route>
          <Route path="/labels" component={Labels}></Route>
          <Route path="/dg" component={DataGroup}></Route>
        </RouteSwitch>
      </MemoryRouter>
    </Box>
  );
}
