const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//load profile validation
const validateProfileInput = require('../../validation/profile')

// load profile and user models
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({msg: "profile test route"}))

// @route GET api/profile
// @desc get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  const errors = {}

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.nouserprofile = 'No profile exists for that user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route POST api/profile
// @desc Create / Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  const { errors, isValid } = validateProfileInput(req.body)

  //check valid
  if(!isValid){
    return res.status(400).json(errors)
  }

  //Get fields
  const profileObj = {}
  profileObj.user = req.user.id
  if(req.body.handle) profileObj.handle = req.body.handle
  if(req.body.company) profileObj.company = req.body.company
  if(req.body.website) profileObj.website = req.body.website
  if(req.body.location) profileObj.location = req.body.location
  if(req.body.status) profileObj.status = req.body.status
  if(req.body.bio) profileObj.bio = req.body.bio
  if(req.body.github) profileObj.github = req.body.github
  //skill array - will take in comma separated values
  if(typeof req.body.skills !== 'undefined'){
    profileObj.skills = req.body.skills.split(',')
  }
  if(typeof req.body.hobbies !== 'undefined'){
    profileObj.hobbies = req.body.hobbies.split(',')
  }
  
  //social
  profileObj.social = {}
  if(req.body.linkedin) profileObj.social.linkedin = req.body.linkedin
  if(req.body.instagram) profileObj.social.instagram = req.body.instagram
  if(req.body.youtube) profileObj.social.youtube = req.body.youtube
  if(req.body.facebook) profileObj.social.facebook = req.body.facebook
  if(req.body.twitter) profileObj.social.twitter = req.body.twitter
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile){
        //if profile then update
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileObj }, { new: true })
        .then(profile => res.json(profile))
      } else {
        //else create profile

        //check to see if handle exists
        Profile.findOne({ handle: profileObj.handle })
        .then(profile => {
          if(profile){
            errors.handle = 'Username already exists'
            res.status(400).json(errors)
          }

          //save profile
          new Profile(profileObj).save()
          .then(profile => res.json(profile))
        })
      }
    })

}
)

module.exports = router