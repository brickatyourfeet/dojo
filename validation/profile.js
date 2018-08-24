const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateProfileInput(data){
  let errors = {}

  data.handle = !isEmpty(data.handle) ? data.handle : ''
  data.status = !isEmpty(data.status) ? data.status : ''
  data.skills = !isEmpty(data.skills) ? data.skills : ''
  
  if(!Validator.isLength(data.handle, { min: 2, max: 30 })){
    errors.handle = 'Handle should be between 2 and 30 characters'
  }

  if(Validator.isEmpty(data.handle)){
    errors.handle = 'Username / handle is required'
  }

  if(Validator.isEmpty(data.status)){
    errors.status = 'Status input is required'
  }

  if(Validator.isEmpty(data.skills)){
    errors.skills = 'Skills are required?'
  }

  if(!isEmpty(data.website)){
    if(!Validator.isURL(data.website)){
      errors.website = 'Please use valid URL'
    }
  }

  if(!isEmpty(data.twitter)){
    if(!Validator.isURL(data.twitter)){
      errors.twitter = 'Please use valid URL'
    }
  }

  if(!isEmpty(data.youtube)){
    if(!Validator.isURL(data.youtube)){
      errors.youtube = 'Please use valid URL'
    }
  }

  if(!isEmpty(data.linkedin)){
    if(!Validator.isURL(data.linkedin)){
      errors.linkedin = 'Please use valid URL'
    }
  }

  if(!isEmpty(data.facebook)){
    if(!Validator.isURL(data.facebook)){
      errors.facebook = 'Please use valid URL'
    }
  }

  if(!isEmpty(data.instagram)){
    if(!Validator.isURL(data.instagram)){
      errors.instagram = 'Please use valid URL'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}