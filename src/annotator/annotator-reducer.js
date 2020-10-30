export default (state, action) => {
  if (action.type === "ON_LABELS_DATA_UPDATE") {
    const newState = {
      ...state,
      labelsData: action.labelsData,
    }
    return newState;
  }
}