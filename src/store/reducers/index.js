/**
 * Root reducer that combines all the reducers present in the App & encapsulates the Store data into Immutable object.
 */

import { fromJS } from 'immutable'
import appReducer from './appReducer'
import accountReducer from './accountReducer'

export default (state, action) => {
  return fromJS({
    app: appReducer(state.get('app'), action),
   // account: accountReducer(state.get('account'), action)
  })
}
