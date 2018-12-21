import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Landing extends Component {

  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard')
    }
  }
  
  render() {
    return (
      <div className="landing">
      <div className="landing-inner text-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4 welcome">Welcome to Bellevue CoderDojo!
              </h1>
              {/* <p className="lead"> Create your student or Instructor / Dev / Admin profile </p> */}
              <hr />
              <div>
                <Link to="/register" className="btn btn-lg btn-info mr-2 signup-button">Sign Up</Link>
              </div>
              <div>
                <Link to="/login" className="btn btn-lg btn-light login-button">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Landing)