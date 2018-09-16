import React, { Component } from 'react'

export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4">Dojo
              </h1>
              <p className="lead"> Create your student or Instructor / Dev / Admin profile </p>
              <hr />
              <a href="register.html" class="btn btn-lg btn-info mr-2">Sign Up</a>
              <a href="login.html" class="btn btn-lg btn-light">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
