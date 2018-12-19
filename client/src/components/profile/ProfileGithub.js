import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
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

  componentDidMount(){
    const { username } = this.props
    const { count, sort, clientId, clientSecret } = this.state

    // change sort to pinned?
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
      )
      .then(res => res.json())
      .then(data => {
        if(this.refs.mounted) this.setState({repos: data})
      })
      .catch(err => console.log(err))
  }

  render() {
    const { repos } = this.state
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          {/* change these to commits, lines of code?
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
          */}
        </div>
      </div> 
    ))

    return (
      <div ref="mounted">
        <hr />
        <h3 className="mb-4">Recent GitHub Repos</h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGithub