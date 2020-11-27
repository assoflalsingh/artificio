/**
 * Redux store setup.
 */

import { createStore, applyMiddleware } from "redux";

// Logger with default options
import logger from "redux-logger";
import userReducer from "./reducers/user";

export default function configureStore(initialState) {
  const store = createStore(userReducer, initialState);//, applyMiddleware(logger));
  return store;
}