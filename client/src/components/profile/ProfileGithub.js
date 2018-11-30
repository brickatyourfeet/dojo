import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class ProfileGithub extends Component {
  constructor(props){
    super(props)
    this.state = {
      clientId: process.env.GITHUB_CLIENT,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      count: 6,
      sort: 'created: asc',
      repos: []
    }
  }

  render() {
    return (
      <div>
        <p>repos here</p>
      </div>
    )
  }
}

export default ProfileGithub