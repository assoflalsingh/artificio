// @flow

import React, { useReducer, useEffect, useRef, useState } from "react"

import CommonTabs from '../components/CommonTabs';
import combineReducers from "react-image-annotate/Annotator/reducers/combine-reducers.js";
import generalReducer from "react-image-annotate/Annotator/reducers/general-reducer.js";
import imageReducer from "react-image-annotate/Annotator/reducers/image-reducer.js";
import videoReducer from "react-image-annotate/Annotator/reducers/video-reducer.js";
import historyHandler from "react-image-annotate/Annotator/reducers/history-handler.js";
import localReducer from './annotator-reducer';

import {RegionLeftToolBar, RegionTopToolBar} from "./defaults";

import useEventCallback from "use-event-callback"
import makeImmutable, { without, getIn, setIn } from "seamless-immutable"
import { Box, Button, Card, CardActionArea, CardMedia, makeStyles, Typography, } from '@material-ui/core';
import ImageCanvas from './ImageCanvas';
import LabelValues, { RegionLabelValues } from "./LabelValues";
import RegionEditLabel from './RegionEditLabel';
import getActiveImage from "react-image-annotate/Annotator/reducers/get-active-image";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const useClasses = makeStyles((theme)=>({
  thumbnail : {
    margin: '0.25rem',
    whiteSpace: 'nowrap'
  },
  thumbnailActive : {
    border: '0.125rem solid',
    borderColor: theme.palette.primary.main,
    margin: '0.25rem',
    whiteSpace: 'nowrap'
  },
}));

export const Annotator = ({
  images,
  allowedArea,
  selectedImage,
  showPointDistances,
  pointDistancePrecision,
  showTags = true,
  enabledTools = [
    "select",
    "create-point",
    "create-box",
    "create-polygon",
    "create-expanding-line",
    "show-mask",
  ],
  selectedTool = "select",
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  keyframes = {},
  taskDescription = "",
  fullImageSegmentationMode = false,
  videoSrc,
  videoTime = 0,
  videoName,
  onExit,
  onNextImage,
  onPrevImage,
  keypointDefinitions,
  autoSegmentationOptions = { type: "autoseg" },
  jsonD,
  thumbnails,
  onThumbnailClick,
  onAnnotatorClose,
  onSaveAnnotationDetails,
}) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = "image";
  const memoizedActionFns = useRef({});
  const classes = useClasses();

  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer,
        localReducer
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      fullImageSegmentationMode: fullImageSegmentationMode,
      autoSegmentationOptions,
      mode: null,
      taskDescription,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      keypointDefinitions,
      ...(annotationType === "image"
        ? {
            selectedImage,
            images,
            selectedImageFrameTime:
              images && images.length > 0 ? images[0].frameTime : undefined,
          }
        : {
            videoSrc,
            keyframes,
          }),
    })
  )

  const dispatch = useEventCallback((action) => {
    // if (action.type === "HEADER_BUTTON_CLICKED") {
    //   if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
    //     return onExit(without(state, "history"))
    //   } else if (action.buttonName === "Next" && onNextImage) {
    //     return onNextImage(without(state, "history"))
    //   } else if (action.buttonName === "Prev" && onPrevImage) {
    //     return onPrevImage(without(state, "history"))
    //   }
    // }

    if(action.type === "LEFT_TOOLBAR") {
      if(action.button === 'save') {
        onSaveAnnotationDetails(selectedImage, activeImage);
      }
    } else {
      dispatchToReducer(action)
    }
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    console.log('region class added', cls);
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  const setLabelsData = (data) => {
    dispatchToReducer({
      type: "SET_LABELS_DATA",
      imageIndex: selectedImage,
      data: data
    });
  }

  // useEffect(()=>{
  //   dispatchToReducer({
  //     type: "SELECT_IMAGE",
  //     imageIndex: 0,
  //   });
  // }, [])

  useEffect(() => {
    if (selectedImage === undefined) return
    let image = state.images[selectedImage];
    if(image.src) {
      dispatchToReducer({
        type: "SELECT_IMAGE",
        imageIndex: selectedImage,
      });
    } else {
      dispatchToReducer({
        type: "SELECT_IMAGE_WITH_DETAILS",
        imageIndex: selectedImage,
        src: images[selectedImage].src,
        image_labels: images[selectedImage].image_labels,
        model_regions: images[selectedImage].model_regions,
        label_values: images[selectedImage].label_values,
      });
    }
  }, [selectedImage]);

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'

  const action = (type, ...params) => {
    const fnKey = `${type}(${params.join(",")})`
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey]

    const fn = (...args) =>
      params.length > 0
        ? dispatch(
            ({
              type,
              ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
            })
          )
        : dispatch({ type, ...args[0] })
    memoizedActionFns.current[fnKey] = fn
    return fn
  }

  const { currentImageIndex, activeImage } = getActiveImage(state, images);
  const canvas = (
    <ImageCanvas
      key={state.selectedImage}
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={state.showTags}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={activeImage ? activeImage.image_labels : []}
      regionTagList={state.regionTagList}
      regions={activeImage ? activeImage.regions || [] : []}
      realSize={activeImage ? activeImage.realSize : undefined}
      videoPlaying={state.videoPlaying}
      imageSrc={activeImage ? activeImage.src : null}
      pointDistancePrecision={state.pointDistancePrecision}
      createWithPrimary={state.selectedTool.includes("create")}
      dragWithPrimary={state.selectedTool === "pan"}
      zoomWithPrimary={state.selectedTool === "zoom"}
      showPointDistances={state.showPointDistances}
      videoTime={
        state.annotationType === "image"
          ? state.selectedImageFrameTime
          : state.currentVideoTime
      }
      keypointDefinitions={state.keypointDefinitions}
      onMouseMove={action("MOUSE_MOVE")}
      onMouseDown={action("MOUSE_DOWN")}
      onMouseUp={action("MOUSE_UP")}
      onChangeRegion={action("CHANGE_REGION", "region")}
      onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
      onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
      onDeleteRegion={action("DELETE_REGION", "region")}
      onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "box", "directions")}
      onBeginMovePolygonPoint={action(
        "BEGIN_MOVE_POLYGON_POINT",
        "polygon",
        "pointIndex"
      )}
      onBeginMoveKeypoint={action(
        "BEGIN_MOVE_KEYPOINT",
        "region",
        "keypointId"
      )}
      onAddPolygonPoint={action(
        "ADD_POLYGON_POINT",
        "polygon",
        "point",
        "pointIndex"
      )}
      onSelectRegion={action("SELECT_REGION", "region")}
      onBeginMovePoint={action("BEGIN_MOVE_POINT", "point")}
      onImageLoaded={action("IMAGE_LOADED", "image")}
      RegionEditLabel={RegionEditLabel}
      onImageOrVideoLoaded={action("IMAGE_OR_VIDEO_LOADED", "metadata")}
      onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
      onChangeVideoPlaying={action("CHANGE_VIDEO_PLAYING", "isPlaying")}
      onRegionClassAdded={onRegionClassAdded}
    />
  );

  return (
      <Box display="flex" style={{height: '100%'}}>
        <RegionLeftToolBar dispatch={dispatch} regions={activeImage ? activeImage.regions : []} />
        <Box style={{flexGrow: 1, overflow: 'hidden'}}>
          <RegionTopToolBar dispatch={dispatch} selectedTool={state.selectedTool}/>
          <Box style={{backgroundColor: 'black'}}>
            {canvas}
          </Box>
          <Box display="flex">
            {(typeof(selectedImage) != "undefined") && <Typography style={{margin: 'auto'}}>{images[selectedImage].document_file_name} ({images[selectedImage].page_no})</Typography>}
            {(typeof(selectedImage) == "undefined") && <Typography style={{margin: 'auto'}}>Select an image....</Typography>}
          </Box>
          <Box style={{overflowY: 'hidden', overflowX: 'auto'}} display="flex">
            <Box display="flex">
              {images.map((thumb, i)=>
                <Card className={i==selectedImage ? classes.thumbnailActive : classes.thumbnail}>
                  <CardActionArea onClick={()=>{onThumbnailClick(thumb._id, thumb.page_no)}}>
                    <CardMedia style={{height: 50, width: 50}}
                      // className={}
                      image={thumb.img_thumb_src}
                      // title="Contemplative Reptile"
                    />
                  </CardActionArea>
                </Card>
              )}
            </Box>
          </Box>
        </Box>
        <Box style={{width: '300px', display: 'flex', flexDirection: 'column', padding: '0.5rem'}}>
          <Box display="flex">
            <Typography style={{marginTop: 'auto', marginBottom: 'auto'}}>LABEL/ANNOTATION</Typography>
            <Button style={{marginLeft: 'auto'}} onClick={onAnnotatorClose} startIcon={<CloseOutlinedIcon />}>Close</Button>
          </Box>
          <Box style={{overflow: 'auto', flexGrow: 1}}>
            {activeImage && <LabelValues activeImage={activeImage} labelsData={state.images[selectedImage].labels_data} setLabelsData={setLabelsData} />}
          </Box>
          {/* <CommonTabs tabs={
            {
              "Custom OCR": (activeImage && <LabelValues activeImage={activeImage} labelsData={state.images[selectedImage].labels_data} setLabelsData={setLabelsData} />),
              "Optimal OCR": <h4>Under construction</h4>,
            }
          }/> */}
        </Box>
      </Box>
  );
}

export default Annotator;
