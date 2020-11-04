import { getIn, setIn, updateIn } from "seamless-immutable"

export default (state, action) => {
  if (action.type === "ON_LABELS_DATA_UPDATE") {
    const newState = {
      ...state,
      labelsData: action.labelsData,
    }
    return newState;
  }
  if(action.type === "UPDATE_IMAGE_SRC") {
    console.log('in action', action);
    let oldImages = state.images;

    for(let i=0; i<oldImages.length; i++) {
      let newImg = action.dataImages[`${oldImages._id}:${oldImages.page_no}`];
      if(newImg && newImg.src) {
        console.log('set the url', newImg.src);
        setIn(state, ['images', i], {
          ...oldImages[i],
          src: newImg.src,
        });
      }
    }
    // const newState = {
    //   ...state,
    //   images: [
    //     ...oldImages,
    //   ]
    // }
    // return state;
  }
  return state;
}