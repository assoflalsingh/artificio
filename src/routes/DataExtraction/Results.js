import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, Box, Button, Chip, CircularProgress, MenuItem, Popover, Snackbar, Typography, Dialog, DialogActions, DialogContent} from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MUIDataTable from "mui-datatables";
import {RefreshIconButton, CompactButtonWithArrow} from '../../components/CustomButtons';
import TableFilterPanel from "../../components/TableFilterPanel";
import {Stacked, StackItem} from '../../components/Stacked';
import {ImageAnnotationDialog} from "../../components/ImageAnnotation/ImageAnnotationDialog";
import { getInstance, URL_MAP } from '../../others/artificio_api.instance';
import Alert from '@material-ui/lab/Alert';
import Loader from "../../components/ImageAnnotation/helpers/Loader";
import SelectModelDialog from "../../components/SelectModelDialog";
import { Form, FormInputText, FormRow, FormRowItem, doValidation } from "../../components/FormElements";

const useStyles = makeStyles((theme) => ({
  rightAlign: {
    marginLeft: 'auto'
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


export default function Results(props) {
  const {uploadCounter} = props;
  const classes = useStyles();
  const [stackPath] = useState('home');
	const [annotateOpen, setAnnotateOpen] = useState(false);
  const api = getInstance(localStorage.getItem('token'));
  const [massAnchorEl, setMassAnchorEl] = useState();
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
  };
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

  const onDownloadMenuClick = (event) => {
    setMassAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMassAnchorEl(null);
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
    api.post(URL_MAP.GET_DATA_LIST, {status: ['in-process', 'completed']})
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

  const onCreateModelArrowBtn = (event) => {
    setMassAnchorEl(event.currentTarget);
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

  const onCreateModelAPI = () => {
    onTrainRetrainModel(
      createModelFormData.new_model_name,
      createModelFormData.new_model_desc,
      "classifier",
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
							<Button disabled={rowsSelected.length === 0} onClick={()=>{setAnnotateOpen(true)}}><PlayCircleFilledIcon color="primary" />&nbsp; Review</Button>
              <CompactButtonWithArrow
                className={classes.arrowbutton}
                name="predictmodel"
                arrowBtnClass={classes.arrowBtnClass}
                arrowBtnOnClick={onCreateModelArrowBtn}
                variant="contained"
                color="primary"
                disabled={rowsSelected.length === 0}
                onClick={() => {
                  setCreateModelDialogStatus(true);
                }}
              >
                {/* <img
                  src={CreateModelIcon}
                  alt={"Train/Create New Model"}
                  width={40}
                  height={30}
                ></img> */}
                Train
              </CompactButtonWithArrow>
              <Popover
                open={Boolean(massAnchorEl) && massAnchorEl.name === "predictmodel"}
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
                    setShowModelListDialog("retrain");
                  }}
                >
                  Re-Train
                </MenuItem>
              </Popover>
              <CompactButtonWithArrow
                className={classes.arrowbutton}
                name="trainmodel"
                arrowBtnClass={classes.arrowBtnClass}
                arrowBtnOnClick={onCreateModelArrowBtn}
                variant="contained"
                color="primary"
                disabled={rowsSelected.length === 0}
                onClick={() => {
                  onTrainRetrainModel(null, null, null, "predict", null);
                }}
              >
                Predict
              </CompactButtonWithArrow>
              <Popover
                open={Boolean(massAnchorEl) && massAnchorEl.name === "trainmodel"}
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
                    setShowModelListDialog("predict");
                  }}
                >
                  Predict with Model
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
                    null,
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
          <>
          <Box display="flex">
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
