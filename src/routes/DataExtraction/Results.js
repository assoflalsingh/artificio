import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, MenuItem, Popover, Snackbar, Typography, Dialog, DialogActions, DialogContent, Tooltip, IconButton} from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import {RefreshIconButton, CompactButton} from '../../components/CustomButtons';
import TableFilterPanel from "../../components/TableFilterPanel";
import {Stacked, StackItem} from '../../components/Stacked';
import {ImageAnnotationDialog} from "../../components/ImageAnnotation/ImageAnnotationDialog";
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import Loader from "../../components/ImageAnnotation/helpers/Loader";
import SelectModelDialog from "../../components/SelectModelDialog";
import { Form, FormInputText, FormRow, FormRowItem, doValidation, FormInputCheck, FormInputSelect } from "../../components/FormElements";
import SettingsIcon from '@material-ui/icons/Settings';
import AssignDataGroup from './AssignDataGroup';
import AssignDataStructure from './AssignDataStructure';

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto'
  },
  playBtn: {
    border: "solid 1px #0575CF",
  },
  ml1: {
    marginLeft: '1rem',
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
    position: 'relative'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const statusArr = ['IN PROCESS', 'REVIEWED'];
const settingValidation = {
  validators: ["required", { type: "regex", param: "^[0-9]*$" }],
  messages: [
    "This field is required",
    "Only Digits are allowed here.",
  ],
};

export default function Results(props) {
  const {uploadCounter} = props;
  const classes = useStyles();
  const [stackPath] = useState('home');
	const [annotateOpen, setAnnotateOpen] = useState(false);
  const api = getInstance(localStorage.getItem('token'));
  const [massAnchorEl, setMassAnchorEl] = useState();
  const [massActionEl, setMassActionEl] = useState();
  const [showAssignDG, setShowAssignDG] = useState(false);
  const [showAssignStruct, setShowAssignStruct] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [updateStatusTo, setUpdateStatusTo] = useState(null);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [pageMessage, setPageMessage] = useState(null);
  const [datalistMessage, setDatalistMessage] = useState(null);
  const [datalist, setDatalist] = useState([]);
  const [unFilteredData, setUnFilteredData] = useState([]);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(1);
  const [showModelListDialog, setShowModelListDialog] = useState();
  const [createModelDialogStatus, setCreateModelDialogStatus] = useState();
  const [isTrainingReqInProcess, setIsTrainingReqInProcess] = useState(false);
  const createModelDefault = {
    new_model_name: "",
    new_model_desc: "",
    new_model_type: "", // ner
    epochs: '', // 2
    lr: '', // 0.000000001
    batch_size: '', // 2
  };
  const [trainSettings, setTrainSettings] = useState(false);
  const [epochsAuto, setEpochsAuto] = useState(true);
  const [lrAuto, setLRAuto] = useState(true);
  const [batchSizeAuto, setBatchSizeAuto] = useState(true);

  const [createModelFormData, setCreateModelFormData] = useState(createModelDefault);
  const [modelsList, setModelsList] = useState([]);
  const [createModelErr, setCreateModelErr] = useState({});

  const columns = [
    {
      name: "file",
      label: "Filename",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "page_no",
      label: "Page",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "datagroup_name",
      label: "Data group",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "struct_name",
      label: "Data structure",
      options: {
        filter: true,
        sort: true,
        draggable: true
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "img_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value)=>{
          return <Chip size="small" label={value?.replace('-', ' ').toUpperCase()} variant="outlined" />;
        }
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "created_by",
      label: "Created by",
      options: {
        filter: true,
        sort: true,
      },
      possibleComparisons: ["eq", "bw", "ct", "ew"],
      type:"string"
    },
    {
      name: "timestamp",
      label: "Date time",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value)=>{
          let d = new Date(`${value}+00:00`);
          return d.toLocaleString();
        }
      },
      possibleComparisons: ["gt", "lt","drange"],
      type:"datetime"
    },
  ];

  const options = {
    selectableRows: 'multiple',
    filterType: 'dropdown',
    elevation: 0,
    filter: false,
    print: false,
    download: true,
    draggableColumns: {enabled: true},
    selectToolbarPlacement: 'none',
    sortOrder: {
      name: 'timestamp',
      direction: 'desc'
    },
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
    rowsSelected: rowsSelected,
    onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelectedNow)=>{
      setRowsSelected(rowsSelectedNow)
    },
    isRowSelectable: ()=> true
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

  const onMassMenuClick = (event) => {
    setMassActionEl(event.currentTarget);
  };

  const onChangeStatus = async () => {
    handleClose();
    setPageMessage("Waiting for API to be ready.");
    return;
    // setPageMessage("Updating the files status...");
    let allResp = await Promise.all(
      rowsSelected.map(async (i) => {
        let row = datalist[i];
        try {
          await api.post(URL_MAP.UPDATE_FILE_STATUS, {
            document_id: row._id,
            page_no: row.page_no,
            status: updateStatusTo,
          });
          return i;
        } catch (error) {
          return error;
        }
      })
    );

    let newDatalist = [...datalist];
    rowsSelected.forEach((i) => {
      newDatalist[i].img_status = updateStatusTo;
    });

    // for (let i = 0; i < allResp.length; i++) {
    //   if (typeof allResp[i] != "number") {
    //     let error = allResp[i];
    //     if (error.response) {
    //       setAjaxMessage({
    //         error: true,
    //         text: error.response.data.message,
    //       });
    //     } else {
    //       console.error(error);
    //     }
    //   }
    // }
    setRowsSelected([]);
    setDatalist(newDatalist);
    setPageMessage(null);
  };

  const onDownloadMenuClick = (event) => {
    setMassAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMassAnchorEl(null);
    setMassActionEl(null);
  };

  const parseGetDataList = (data) => {
  //   {
  //     "_id": "5f9c3594920d9e5fad533c19",
  //     "timestamp": "2020-10-30T15:47:32",
  //     "id": 202010305407,
  //     "created_by": "name last_name",
  //     "file": "skipper_logo.jpg",
  //     "images": [
  //         {
  //             "page_1": {
  //                 "img_name": "202010305407-skipper_logo.jpg",
  //                 "img_thumb": "thumbnail_202010305407-skipper_logo.jpg",
  //                 "img_status": "new",
  //                 "datagroup_id": "",
  //                 "datagroup_name": ""
  //             },
  //             "page_2": {
  //                 "img_name": "202010305407-skipper_logo1.jpg",
  //                 "img_thumb": "thumbnail_202010305407-skipper_logo1.jpg",
  //                 "img_status": "new",
  //                 "datagroup_id": "",
  //                 "datagroup_name": ""
  //             }
  //         }
  //     ],
  //     "account": 12345,
  //     "status": "new",
  //     "idStr": "202010305407"
  // }

    let newData = [];
    data.forEach((datum)=>{
      let newRecord = {
        _id: datum._id,
        timestamp: datum.timestamp,
        created_by: datum.created_by,
        file: datum.file,
      }

      Object.keys(datum.images).forEach((page)=>{
        newData.push({
          ...newRecord,
          struct_id:datum.images[page].struct_id,
          img_json:datum.images[page].img_json,
          page_no: page,
          image_name: datum.images[page].img_name,
          img_status: datum.images[page].img_status,
          datagroup_id: datum.images[page].datagroup_id,
          datagroup_name: datum.images[page].datagroup_name,
          struct_name: datum.images[page].struct_name,
          img_thumb: datum.images[page].img_thumb
        });
      });
    });
    return newData;
  }

  const fetchDataList = () => {
    setDatalistMessage('Loading data...');
    setDatalist([]);
    setRowsSelected([]);
    api.get(URL_MAP.GET_DATA_LIST, {params:{status: ['in-process', 'completed', 'reviewed', 'ner trained', 'ner training', 'ner queue']}})
      .then((res)=>{
        let data = res.data.data;
        let contr = refreshCounter+1;
        setRefreshCounter(contr);
        let parsedResult = parseGetDataList(data.data_lists);
        setUnFilteredData([...parsedResult]);
        setDatalist(parsedResult);
      })
      .catch((err)=>{
        console.error(err);
      })
      .then(()=>{
        setDatalistMessage(null);
      });
  }
  const filterDataList = (filteredResult) => {
    setDatalistMessage('Filtering data...');
    setDatalist([]);
    setRowsSelected([]);
    setDatalist(filteredResult);
    setDatalistMessage(null);
  }
  const ResetAllFilters = () => {
    setDatalist([...unFilteredData]);
  }
  const postDownloadRequest = (file_type, is_datagroup) => {
    handleClose();
    let dgStructId = '';

    for (const rowInd of rowsSelected) {
      if(is_datagroup && !datalist[rowInd]['datagroup_id']) {
        setAjaxMessage({
          error: true, text: "Data group must be assigned to all the selected files.",
        });
        return;
      } else if(!is_datagroup && !datalist[rowInd]['struct_id']) {
        setAjaxMessage({
          error: true, text: "Data structure must be assigned to all the selected files.",
        });
        return;
      }

      if(is_datagroup && dgStructId !== '' && dgStructId !== datalist[rowInd]['datagroup_id']) {
        setAjaxMessage({
          error: true, text: "All the files must have same data group for the report to be generated.",
        });
        return;
      } else if(!is_datagroup && dgStructId !== '' && dgStructId !== datalist[rowInd]['struct_id']) {
        setAjaxMessage({
          error: true, text: "All the files must have same data structure for the report to be generated.",
        });
        return;
      }
      dgStructId = is_datagroup ? datalist[rowInd]['datagroup_id'] : datalist[rowInd]['struct_id'];
    }
    setPageMessage('Requesting...');
    let data_lists = {};
    rowsSelected.map((i)=>{
      let row = datalist[i];
      data_lists[row._id] = data_lists[row._id] || [];
      data_lists[row._id].push(row.page_no);
      return i;
    });
    api.post(URL_MAP.SCHEDULE_DOWNLOAD_REQUEST, {
      file_type: file_type,
      datagroup_struct_id: dgStructId,
      data_lists: data_lists,
    }).then(()=>{
      setAjaxMessage({
        error: false, text: 'Request success. Please check downloads !!',
      });
    }).catch((error)=>{
      if(error.response) {
        setAjaxMessage({
          error: true, text: error.response.data.message,
        });
      } else {
        console.error(error);
      }
    }).then(()=>{
      setPageMessage(null);
    })
  }
  const closeAnnotationTool = (wasUpdated) => {
    if(wasUpdated){
      fetchDataList();
    }
    setAnnotateOpen(false)
  }

  const onTrainRetrainModel = async (
    model_name,
    model_desc,
    model_type,
    model_action,
    version,
    modelID
  ) => {
    let errorMessage = "";
    setAjaxMessage(null);
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

    if (trainSettings === true && epochsAuto === false && +createModelFormData.epochs < 1) {
      errorMessage = "Epochs should be a number or Auto.";
      setAjaxMessage({
        error: true,
        text: errorMessage,
      });
      return false;
    }

    if (trainSettings === true && lrAuto === false && (createModelFormData.lr.indexOf('.') < 1 || createModelFormData.lr.length < 1)) {
      errorMessage = "LR should be a decimal value or Auto.";
      setAjaxMessage({
        error: true,
        text: errorMessage,
      });
      return false;
    }

    if (trainSettings === true && batchSizeAuto === false && (+createModelFormData.batch_size % 2 !== 0 || +createModelFormData.batch_size < 2)) {
      errorMessage = "Batch Size should be multiple of 2 or Auto.";
      setAjaxMessage({
        error: true,
        text: errorMessage,
      });
      return false;
    }

    createModelPayload.files = [];
    createModelPayload.settings = {epochs: trainSettings === false || epochsAuto? '' : +createModelFormData.epochs, lr: trainSettings === false || lrAuto? '' : +createModelFormData.lr, batch_size: trainSettings === false || batchSizeAuto? '' : +createModelFormData.batch_size};

    rowsSelected.map((row) => {
      createModelPayload.files.push(datalist[row].image_name);
      createModelPayload.datagroup_id = datalist[row].datagroup_id;

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
      // if (model_action !== "predict" && !datalist[row].struct_id) {
      //   errorMessage = "Structure id is missing for the selection.";
      //   setAjaxMessage({
      //     error: true,
      //     text: errorMessage,
      //   });
      // } else
      // Datagroup id is missing
      if (model_action !== "predict" && !datalist[row].datagroup_id) {
        errorMessage = "Datagroup id is missing for the selection.";
        setAjaxMessage({
          error: true,
          text: errorMessage,
        });
        return false;
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
    delete createModelPayload["action"];
    delete createModelPayload["data_lists"];
    delete createModelPayload["model_type"];
    console.log("createModelPayload", createModelPayload);
    if (!errorMessage) { //createModelPayload.data_lists.length > 0 &&
      setIsTrainingReqInProcess(true);
      setCreateModelDialogStatus(false);
      api
        .post(model_action === "train" ? URL_MAP.TRAIN_MODEL: URL_MAP.TRAIN_RETRAIN_MODEL, {
          ...createModelPayload,
        })
        .then((response) => {
          setIsTrainingReqInProcess(false);
          setAjaxMessage({
            error: false,
            text: response.data?.data,
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

  const validateField = (name, value) => {
    let errMsg = "";
    let fieldValidators = createModelFormValidators[name];
    if (fieldValidators) {
      value = value && value?.toString().length > 0 ? value : "";
      errMsg = doValidation(
        (name === 'lr'? value.replaceAll(".",""): value),
        fieldValidators.validators,
        fieldValidators.messages
        );
      if(errMsg === ''){
        if( name === 'lr' && value.indexOf('.') < 1){
          errMsg = 'LR value should be in decimal.';
        }
        if( name === 'batch_size' && +value % 2 !== 0){
          errMsg = 'Batch Size should be multiple of 2.';
        }
      }
      setCreateModelErr((prevErr) => ({
        ...prevErr,
        [name]: errMsg,
      }));
    }
    return errMsg;
  };

  const clearError = (name) => {
    setCreateModelFormData((prevData) => ({
      ...prevData,
      [name]: '',
    }));

    setCreateModelErr((prevErr) => ({
      ...prevErr,
      [name]: '',
    }));
  }

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
    epochs: settingValidation,
    lr: settingValidation,
    batch_size: settingValidation,
  };

  const onCreateModelAPI = () => {
    onTrainRetrainModel(
      createModelFormData.new_model_name,
      createModelFormData.new_model_desc,
      createModelFormData.new_model_type,
      "train"
    );
  };

  useEffect(() => {
    if (!uploadCounter) return
      fetchDataList();
  }, [uploadCounter]);

  return (
    <>
    <Box className={classes.root}>
      <Stacked to={stackPath}>
        <StackItem main path='home'>
          <Backdrop className={classes.backdrop} open={Boolean(pageMessage)}>
            <CircularProgress color="inherit" />
            <Typography style={{marginLeft: '0.25rem'}} variant='h4'>{pageMessage}</Typography>
          </Backdrop>
          <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} >
            {ajaxMessage && <Alert onClose={()=>{setAjaxMessage(null)}} severity={ajaxMessage.error ? "error" : "success"}>
              {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
            </Alert>}
          </Snackbar>
          <Box display="flex" style={{margin: "15px 0px"}}>
            <Typography color="primary" variant="h6">Results</Typography>
            <RefreshIconButton className={classes.ml1} onClick={()=>{fetchDataList()}}/>
            <Box className={classes.rightAlign}>
              {/* <Button onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button> */}
							<Button style={{height: '2rem'}} className={classes.playBtn} disabled={rowsSelected.length === 0} onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button>
              <Tooltip title="Entity Extraction" aria-label="Entity Extraction">
              <CompactButton
                className={classes.ml1}
                label="Train"
                variant="contained"
                color="primary"
                disabled={rowsSelected.length === 0}
                onClick={() => {
                  setAjaxMessage(null);
                  let stopFlag = false;
                  let dg_id = '';
                  let errorMessage;
                  rowsSelected.forEach((row) => {
                    if(!stopFlag && dg_id !== '' && dg_id !== datalist[row].datagroup_id){
                      stopFlag = true;
                      errorMessage = 'Data Group must be the same for all the selected files.';
                    }
                    dg_id = datalist[row].datagroup_id;

                    if(!stopFlag && datalist[row].img_status !== 'reviewed'){
                      stopFlag = true;
                      errorMessage = 'Please select only Reviewed file(s).';
                    }
                  });

                  if(stopFlag){
                    setAjaxMessage({
                      error: true,
                      text: errorMessage,
                    });
                    return false;
                  }
                  setCreateModelDialogStatus(true);
                }}
              />
              </Tooltip>
              <Tooltip title="Entity Extraction" aria-label="Entity Extraction">
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
                  <IconButton
                    variant="outlined"
                    onClick={() => {
                      setTrainSettings(prevState => !prevState);
                    }}
                    style={{ zIndex: 9, top: '10px', right: '10px', position: "absolute" }}
                  >
                    <SettingsIcon style={{ fontSize: "1.2rem" }} color={trainSettings? 'primary' : ''} />
                  </IconButton>
                  <Form>
                  {trainSettings && <>
                    <FormRow>
                      <FormRowItem>
                        <FormInputText label="Epochs" name='epochs' disabled={epochsAuto} value={createModelFormData.epochs} onChange={onTextChange} errorMsg={createModelErr.epochs}/>
                      </FormRowItem>
                      <FormRowItem>
                        <FormInputCheck label="Auto" checked={epochsAuto} color="primary" onChange={() => {
                          setEpochsAuto(prevState => !prevState);
                          clearError('epochs');
                          }} />
                      </FormRowItem>
                    </FormRow>
                    <FormRow>
                      <FormRowItem>
                        <FormInputText label="Learning Rate" name='lr' disabled={lrAuto} value={createModelFormData.lr} onChange={onTextChange} errorMsg={createModelErr.lr}/>
                      </FormRowItem>
                      <FormRowItem>
                        <FormInputCheck label="Auto" checked={lrAuto} color="primary" onChange={() => {
                          setLRAuto(prevState => !prevState);
                          clearError('lr');
                          }} />
                      </FormRowItem>
                    </FormRow>
                    <FormRow>
                      <FormRowItem>
                        <FormInputText label="Batch Size" name='batch_size' disabled={batchSizeAuto} value={createModelFormData.batch_size} onChange={onTextChange} errorMsg={createModelErr.batch_size}/>
                      </FormRowItem>
                      <FormRowItem>
                        <FormInputCheck label="Auto" checked={batchSizeAuto} color="primary" onChange={() => {
                          setBatchSizeAuto(prevState => !prevState);
                          clearError('batch_size');
                          }} />
                      </FormRowItem>
                    </FormRow>
                    </>}
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
          <>
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
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={showChangeStatus}
            onClose={() => {
              setShowChangeStatus(false);
            }}
          >
            <DialogContent>
              <FormInputSelect
                hasSearch
                label="Change Status To"
                onChange={(e, value) => {
                  setUpdateStatusTo(value);
                }}
                value={updateStatusTo}
                options={statusArr}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowChangeStatus(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowChangeStatus(false);
                  onChangeStatus();
                }}
                color="primary"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Box display="flex">
            <Button
              name="mass-action"
              disabled={rowsSelected.length === 0}
              variant="outlined"
              style={{ height: "2rem", marginRight: 10 }}
              size="small"
              endIcon={<ChevronRightOutlinedIcon />}
              onClick={onMassMenuClick}
            >
              Mass action
            </Button>
              <Button disabled={rowsSelected.length === 0} variant='outlined' style={{height: '2rem'}} size="small"
                endIcon={<ChevronRightOutlinedIcon />} onClick={onDownloadMenuClick}>Download</Button>
              {rowsSelected.length > 0 && <Typography style={{marginTop:'auto', marginBottom:'auto', marginLeft:'0.25rem'}}>{rowsSelected.length} selected.</Typography>}
              {datalistMessage && <> <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} /><Typography style={{alignSelf:'center'}}>&nbsp;{datalistMessage}</Typography></>}
              <TableFilterPanel refreshCounter={refreshCounter} unFilteredData={unFilteredData} disabled={unFilteredData.length === 0} onApplyFilter={filterDataList} coloumnDetails={columns} onResetAllFilters={ResetAllFilters} />
              </Box>
              <Popover
                open={Boolean(massAnchorEl)}
                onClose={handleClose}
                anchorEl={massAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={()=>{setMassAnchorEl(null); postDownloadRequest('csv', true)}}>CSV by data group</MenuItem>
                <MenuItem onClick={()=>{setMassAnchorEl(null); postDownloadRequest('csv', false)}}>CSV by data structure</MenuItem>
              </Popover>
              <Popover
                open={Boolean(massActionEl)}
                onClose={handleClose}
                anchorEl={massActionEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={()=>{setMassActionEl(null); setShowAssignDG(true)}}>Assign Data Group</MenuItem>
                <MenuItem onClick={()=>{setMassActionEl(null); setShowAssignStruct(true)}}>Assign Data Structure</MenuItem>
                <MenuItem onClick={() => {setMassActionEl(null); setShowChangeStatus(true)}}>Change Status</MenuItem>
              </Popover>
            </>
          <MUIDataTable
            title={<>
              <Typography color="primary" variant="h8">Please select file(s) for review</Typography>
            </>}
            data={datalist}
            columns={columns}
            options={options}
          />
      </StackItem>
      </Stacked>
    </Box>
		<ImageAnnotationDialog
			open={annotateOpen}
			onClose={(wasUpdated)=>{closeAnnotationTool(wasUpdated)}}
			api={api}
			getImages={()=>rowsSelected.map((i)=>datalist[i])}
			inReview={true}
		/>
    </>
  )
}
