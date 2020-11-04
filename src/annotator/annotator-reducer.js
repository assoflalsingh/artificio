import { getIn, setIn, updateIn } from "seamless-immutable"

export default (state, action) => {
  if (action.type === "ON_LABELS_DATA_UPDATE") {
    const newState = {
      ...state,
      labelsData: action.labelsData,
    }
    return newState;
  }

  // console.log(action.type);
  return state;
}