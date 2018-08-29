const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//load profile validation
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

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

// @route GET api/profile/all
// @desc get all user profiles
// @access Public
router.get('/all', (req, res) => {
  const errors = {}

  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) {
      errors.nouserprofile = 'No profile exists for that user'
      return res.status(400).json()
    }

    res.json(profiles)
  })
  .catch(err => res.status(404).json({profile: 'no profiles'}))
})

// @route GET api/profile/handle/:handle
// @desc get user profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {}

  Profile.findOne({ handle: req.params.handle })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'No profile with that handle'
      res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})

// @route GET api/profile/user/:user_id
// @desc get user profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Profile.findOne({ user: req.params.user_id })
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'No profile with that handle'
      res.status(404).json(errors)
    }
    res.json(profile)
  })
  .catch(err => res.status(404).json({ profile: 'no profile for specified user' }))
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

// @route POST api/profile/experience
// @desc add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }),
(req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body)

  //check valid
  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to experience array
      profile.experience.unshift(newExp)

      profile.save()
      .then(profile => res.json(profile))
    })
})

// @route POST api/profile/education
// @desc add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }),
(req, res) => {
  const { errors, isValid } = validateEducationInput(req.body)

  //check valid
  if(!isValid){
    return res.status(400).json(errors)
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      //Add to experience array
      profile.education.unshift(newEdu)

      profile.save()
      .then(profile => res.json(profile))
    })
})

// @route DELETE api/profile/experience/:exp_id
// @desc delete experience from profile
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }),
(req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get index to remove
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id)

      //Splice out of array
      profile.experience.splice(removeIndex, 1)

      //save
      profile.save()
      .then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
})

// @route DELETE api/profile/education/:edu_id
// @desc delete education from profile
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }),
(req, res) => {

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      //Get index to remove
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id)

      //Splice out of array
      profile.education.splice(removeIndex, 1)

      //save
      profile.save()
      .then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json(err))
})

// @route DELETE api/profile
// @desc delete user and profile
// @access Private
router.delete('/', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
  .then(() => {
    User.findOneAndRemove({ _id: req.user.id })
    .then(() => res.json({ profiledeleted: true }))
  })
 
})

module.exports = router