import axios from 'axios'
import { GET_ERRORS } from './types'

export const registerUser = (userData, history) => dispatch => {
  //adding dispatch like this is the same as returning dispatch
  axios.post('/api/users/register', userData)
  .then(res => history.push('/login')) //redirect to login
  .catch(err => 
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  )
}