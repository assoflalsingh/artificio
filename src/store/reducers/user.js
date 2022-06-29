/**
 * Root reducer that combines all the reducers present in the App & encapsulates the Store data into Immutable object.
 */
const userReducer = (state={}, action) => {
  switch(action.type) {
    case 'SET_USER': {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          user_set: true,
        },
      };
    }
    case 'SET_USER_LOADING': {
      return {
        ...state,
        user: {
          ...state.user,
          user_set: false,
        },
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

const setUserLoading = ()=>({
  type: 'SET_USER_LOADING'
});

export default userReducer;
export {setUser, setUserLoading};