const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validateHobbyInput(data){
  let errors = {}

  data.description = !isEmpty(data.description) ? data.description : ''

  if(Validator.isEmpty(data.description)){
    errors.description = 'description is a required field'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}