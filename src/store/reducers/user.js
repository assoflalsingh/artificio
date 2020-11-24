/**
 * Root reducer that combines all the reducers present in the App & encapsulates the Store data into Immutable object.
 */
export default (state={}, action) => {
  switch(action.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state
  }
}

const setUser = (user)=>({
  type: 'SET_USER',
  payload: user
});

export {setUser};