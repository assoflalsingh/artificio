// @flow

import React, { useReducer, useEffect, useRef } from "react"

import combineReducers from "react-image-annotate/Annotator/reducers/combine-reducers.js";
import generalReducer from "react-image-annotate/Annotator/reducers/general-reducer.js";
import imageReducer from "react-image-annotate/Annotator/reducers/image-reducer.js";
import videoReducer from "react-image-annotate/Annotator/reducers/video-reducer.js";
import historyHandler from "react-image-annotate/Annotator/reducers/history-handler.js";

import {RegionLeftToolBar, RegionTopToolBar} from "./defaults";

import useEventCallback from "use-event-callback"
import makeImmutable, { without } from "seamless-immutable"
import { Box, makeStyles, } from '@material-ui/core';
import getActiveImage from 'react-image-annotate/Annotator/reducers/get-active-image';
import ImageCanvas from 'react-image-annotate/ImageCanvas';
import { RegionLabelValues } from "./RegionLabelValues";
import RegionEditLabel from './RegionEditLabel';

export const Annotator = ({
  images,
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
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
  // RegionLabelValues,
  // RegionLeftToolBar,
  // RegionTopToolBar,
}) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video";
  const memoizedActionFns = useRef({});

  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer
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
        console.log(activeImage.regions);
      }
    }

    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
  }, [selectedImage])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'


  // const settings = useSettings();
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

  const { currentImageIndex, activeImage } = getActiveImage(state);

  const canvas = (
    <ImageCanvas
      // {...settings}
      // showCrosshairs={
      //   settings.showCrosshairs &&
      //   !["select", "pan", "zoom"].includes(state.selectedTool)
      // }
      key={state.selectedImage}
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={state.showTags}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={state.regionClsList}
      regionTagList={state.regionTagList}
      regions={activeImage.regions ?  activeImage.regions : []}
      realSize={activeImage ? activeImage.realSize : undefined}
      videoPlaying={state.videoPlaying}
      imageSrc={state.annotationType === "image" ? activeImage.src : null}
      videoSrc={state.annotationType === "video" ? state.videoSrc : null}
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

  return <>
    <Box display="flex" style={{width: '100%', height: '100%'}}>
      <RegionLeftToolBar dispatch={dispatch} regions={activeImage.regions} />
      <Box style={{flexGrow: 1}}>
        <RegionTopToolBar dispatch={dispatch} />
        <Box style={{backgroundColor: 'black'}}>
          {canvas}
        </Box>
      </Box>
      <RegionLabelValues regions={activeImage.regions} />
    </Box>
  </>
}

export default Annotator
