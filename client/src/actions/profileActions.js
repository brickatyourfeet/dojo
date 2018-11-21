import axios from 'axios'

import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER } from './types'

// get curr profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading())
  axios.get('/api/profile')
    .then(res => 
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err => 
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
}

// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios.post('/api/profile, profileData')
    .then(res => history.push('/dashboard'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// add experience
export const addExperience = (expData, history) => dispatch => {
  axios.post('/api/profile/experience', expData)
    .then(res => history.push('/dashboard'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}
// delete entire user and profile
export const deleteAccount = () => dispatch => {
  if(window.confirm('Delete Account Permanently?')){
    axios.delete('/api/profile')
    .then(res => 
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    ).catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
  }
}

// loading profile
export const setProfileLoading = () => {
  return { type: PROFILE_LOADING }
}

// clear profile
export const clearCurrentProfile = () => {
  return { type: CLEAR_CURRENT_PROFILE }
}