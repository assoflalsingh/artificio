/**
 * Redux store setup.
 * Includes the axios config.
 */
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { fromJS } from 'immutable'

const axiosMiddlewareOptions = {
  interceptors: {
    response: [
      {
        success: ({ getState, dispatch, getSourceAction }, res) => {
          if (process.env.mode) {
            console.log(getState, dispatch, getSourceAction)
          }
          return res.data
        },
        error: ({ getState, dispatch, getSourceAction }, error) => {
          if (process.env.mode) {
            console.log(getState, dispatch, getSourceAction)
          }
          return Promise.reject(error)
        }
      }
    ]
  }
}

const getToken = () => {
  const token = sessionStorage.getItem('token')
  if (token) {
    return `Bearer ${token}`
  } else {
    return 0
  }
}

const client = axios.create({
  baseURL: process.env.API_BASEURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  },
  responseType: 'json'
})

// client.interceptors.request.use(
//   config => {
//     const token = getToken()
//     if (token) {
//       config.headers['Authorization'] = `${token}`
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
//)

const initialState = fromJS({})

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(thunk, axiosMiddleware(client, axiosMiddlewareOptions))
  )
)

export default store
