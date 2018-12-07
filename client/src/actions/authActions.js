import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

import { GET_ERRORS, SET_CURRENT_USER } from './types'


export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/users/register', userData)
  .then(res => history.push('/login'))
  .catch(err => 
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  )
}

export const loginUser = userData => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      //save to localstorage
      const { token } = res.data
      //set token to local storage
      localStorage.setItem('jwtToken', token)
      //set token to authorization header
      setAuthToken(token)
      //decode token to get user data
      const decoded = jwt_decode(token)
      //set curr user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
}


export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// logout action
export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  // remove auth header
  setAuthToken(false)
  // set current user to {} which will reverse isAuthenticated
  dispatch(setCurrentUser({}))
}