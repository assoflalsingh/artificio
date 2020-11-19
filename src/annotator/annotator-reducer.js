import { getIn, setIn, updateIn } from "seamless-immutable"

export default (state, action) => {
  if(action.type === 'SELECT_IMAGE_WITH_DETAILS') {
    let pathToActiveImage = ["images", action.imageIndex]
    let newState = setIn(state, [...pathToActiveImage, "src"], action.src);
    newState = setIn(newState, [...pathToActiveImage, "image_labels"], action.image_labels);
    newState = setIn(newState, [...pathToActiveImage, "model_regions"], action.model_regions);
    newState = setIn(newState, [...pathToActiveImage, "labels_data"], action.labels_data || {});
    newState = setIn(newState, [...pathToActiveImage, "regions"], action.regions || {});

    return setIn(newState,["selectedImage"], action.imageIndex);
  }
  if(action.type === 'SET_LABELS_DATA') {
    let pathToImageLabelData = ["images", action.imageIndex, "labels_data"];
    return setIn(state, pathToImageLabelData, action.data);
  }
  if(action.type === "SET_LABEL_VALUE") {
    let pathToImageLabelData = ["images", action.imageIndex, "labels_data", action.name];
    return setIn(state, pathToImageLabelData, action.value);
  }
  return state;
}