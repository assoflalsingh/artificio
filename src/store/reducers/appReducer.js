import { fromJS } from 'immutable'
const initState = fromJS({
    appConfig: {}
  })
  
  const SUCCESS = '_SUCCESS'
  const FAIL = '_FAIL'
  
  const appReducer = (state = initState, action) => {
   }

export default appReducer