/**
 * Root reducer that combines all the reducers present in the App & encapsulates the Store data into Immutable object.
 */

import { fromJS } from 'immutable'
import userReducer from './userReducer'

export default (state, action) => {
  return fromJS({
    user: userReducer(state.get('user'), action)
  })
}
