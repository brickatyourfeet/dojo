import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions'
import Spinner from '../reusable/Spinner'
import ProfileChanges from './ProfileChanges'
import Experience from './Experience'

class Dashboard extends Component {
  componentDidMount(){
    this.props.getCurrentProfile()
  }

  onDeleteClick(e){
    this.props.deleteAccount()
  }

  render() {
    const { user } = this.props.auth
    const { profile, loading } = this.props.profile

    let dashboardContent

    //check for no profile or loading 
    if(profile === null || loading){
      dashboardContent = <Spinner />
    } else {
      // check if user has profile data
      if(Object.keys(profile).length > 0){
        dashboardContent = (
          <div>
          <p className="lead text-muted">
          Hey <Link to={`/profile/${profile.handle}`}>{ user.name }</Link>
          </p>
          <ProfileChanges />
          <Experience experience={profile.experience} />
          <div style={{marginBottom: '60px'}}/>
          <button 
            onClick={this.onDeleteClick.bind(this)}
            className="btn btn-danger">Delete Account</button>
          </div>
        )
      } else {
        // user logged in but hasn't created profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Hey { user.name }</p>
            <p> Please set up a profile to continue </p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile!
            </Link>
          </div>
        )
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4"> Dashhhhboard </h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
