const Validator = require('validator')
const isEmpty = require('./is-empty') 

module.exports = function validatePostInput(data){
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ''

  if(!Validator.isLength(data.text, { min: 5, max: 1000 })){
    errors.text = 'Posts should be between 5-1000 characters'
  }

  if(Validator.isEmpty(data.text)){
    errors.text = 'text is a required field'
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}