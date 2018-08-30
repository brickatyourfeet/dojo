const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Bringing in Post model
const Post = require('../../models/Post')

// Bringing in validation
const validatePostInput = require('../../validation/post')

// @route GET api/posts/test
// @desc Tests post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "posts test route"}))

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  if(!isValid){
    //if errors, send 400 and error json
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })

  newPost.save()
  .then(post => res.json(post))
})

module.exports = router