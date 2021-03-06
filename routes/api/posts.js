const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Bringing in Post model
const Post = require('../../models/Post')

//Bringing in Profile model
const Profile = require('../../models/Profile')

// Bringing in validation
const validatePostInput = require('../../validation/post')

// @route GET api/posts/test
// @desc Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "posts test route" }))

// @route GET api/posts
// @desc Get all posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
  .sort({ date: -1 })
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({ nopostsfound: err }))
})

// @route GET api/posts/:id
// @desc Get post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({ 
    error: 'no post with that id',
    fullerror: err 
}))
})

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

// @route DELETE api/posts/:id
// @desc Delete post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      //check post owner
      if(post.user.toString() !== req.user.id){
        return res.status(401).json({ user: 'not authorized' })
      }

      //delete user
      post.remove()
      .then(() => res.json({ user: 'post deleted' }))
      .catch(err => res.status(404).json({ postnotfound: err }))
    })
  })
})

// @route POST api/posts/like/:id
// @desc post like to a comment
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({ liked: 'user already liked this post' })
      }
      //add user is to post likes
      post.likes.unshift({ user: req.user.id })

      post.save()
      .then(post => res.json(post))
    })
      .catch(err => res.status(404).json({ postnotfound: err }))
    })
  })

  // @route POST api/posts/unlike/:id
// @desc post unlike to a comment
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({ liked: 'cannot unlike, not yet liked' })
      }
      //get index to remove
      const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

      //splice like out of array
      post.likes.splice(removeIndex, 1)

      post.save()
      .then(post => res.json(post))
    })
      .catch(err => res.status(404).json({ postnotfound: err }))
    })
  })

// @route POST api/posts/comment/:id
// @desc add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  if(!isValid){
    //if errors, send 400 and error json
    return res.status(400).json(errors)
  }
  Post.findById(req.params.id)
  .then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }

    //add to comments array
    post.comments.unshift(newComment)

    post.save()
    .then(post => res.json(post))
  })
  .catch(err => res.status(404).json({ postnotfound: err }))
})

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), 
(req, res) => {

  Post.findById(req.params.id)
  .then(post => {
    //check that comment exists
    if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
      return res.status(404).json({ nocomment: err })
    }

    //retrieve index to remove
    const removeIndex = post.comments
      .map(item => item._id.toString())
      .indexOf(req.params.comment_id)

    //splice out of array
    post.comments.splice(removeIndex, 1)

    post.save()
    .then(post => res.json(post))
  })
  .catch(err => res.status(404).json({ postnotfound: err }))
})

module.exports = router