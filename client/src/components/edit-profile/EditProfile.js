import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TextFieldGroup from '../reusable/TextFieldGroup'
import TextAreaFieldGroup from '../reusable/TextAreaFieldGroup'
import InputGroup from '../reusable/InputGroup'
import SelectListGroup from '../reusable/SelectListGroup'
import { createProfile, getCurrentProfile } from '../../actions/profileActions'
import isEmpty from '../../validation/is-empty'


class CreateProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      hobbies: '',
      github: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.props.getCurrentProfile()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }

    if(nextProps.profile.profile){
      const profile = nextProps.profile.profile

      // turn skills and hobbies arrays to comma separated values
      const skillsCSV = profile.skills.join(',')
      const hobbiesCSV = profile.hobbies.join(',')
      // no need to set these to empty strings because they would be anyway 

      // check for empties, if empty - ''
      profile.company = !isEmpty(profile.company) ? profile.company : ''
      profile.website = !isEmpty(profile.website) ? profile.website : ''
      profile.location = !isEmpty(profile.location) ? profile.location : ''
      profile.github = !isEmpty(profile.github) ? profile.github : ''
      profile.bio = !isEmpty(profile.bio) ? profile.bio : ''
      profile.social = !isEmpty(profile.social) ? profile.social : {}
      profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : ''
      profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : ''
      profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : ''
      profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : ''

      // set component fields state
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        hobbies: hobbiesCSV,
        github: profile.github,
        bio: profile.bio,
        twitter: profile.twitter,
        facebook: profile.facebook,
        linkedin: profile.linkedin,
        youtube: profile.youtube

      })
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      hobbies: this.state.hobbies,
      github: this.state.github,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    }

    this.props.createProfile(profileData, this.props.history)

    console.log('form submit')
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    const { errors, displaySocialInputs } = this.state

    let socialInputs

    if(displaySocialInputs){
      socialInputs= (
        <div>
          <InputGroup 
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup 
            placeholder="Facebook Profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup 
            placeholder="LinkedIn Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup 
            placeholder="Youtube channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={errors.youtube}
          />
          <InputGroup 
            placeholder="Instagram URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={errors.instagram}
          />
        </div>
      )
    }

    //options for status
    const options = [
      {label: 'Select Administrator or Student', value: 0},
      {label: 'Admin (Instructor/Developer)', value: 'Admin'},
      {label: 'Student', value: 'Student'}
    ]

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
            <Link to="/dashboard" className="btn btn-light">
              Back
            </Link>
              <h1 className="display-4 text-center"> Edit Your Profile </h1>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup 
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="Unique user name and name fields for your profile"
                />
                <SelectListGroup 
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  options={options}
                  error={errors.status}
                  info="Please select if you are a student or volunteer/admin, parents can select student for their child"
                />
                <TextFieldGroup 
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Option to include company you work for"
                />
                <TextFieldGroup 
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Option to include your website"
                />
                <TextFieldGroup 
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="Option to include city and state"
                />
                <TextFieldGroup 
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="Option to include company you work for"
                />
                {/* have skills and hobbies change for student/admin*/}
                <TextFieldGroup 
                  placeholder="Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Use comma separated values for skills such as Python, JavaScript, HTML, etc"
                />
                <TextFieldGroup 
                  placeholder="Github Name"
                  name="github"
                  value={this.state.github}
                  onChange={this.onChange}
                  error={errors.github}
                  info="We can include your latest repos if you add your GitHub handle"
                />
                {/* or hobbies could be in bio? */}
                <TextAreaFieldGroup 
                  placeholder="Short bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="This is a spot to share something about yourself"
                />

                <div className="mb-3">
                  <button 
                    type="button"
                    onClick={()=> {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }))
                    }}
                    className="btn btn-light">
                    Option to add social network links
                  </button>
                </div>
                {socialInputs}
                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, {createProfile, getCurrentProfile})(
  withRouter(CreateProfile))