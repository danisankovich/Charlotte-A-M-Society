import React, {Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'


class PhotoBook extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    this.setState({file: ''});
  }
  uploadPhotos(formprops) {
    formprops.image = this.state.file;
    this.props.uploadMyPhoto(formprops, this.props.userInfo._id)
    this.props.fetchInfo();
  }
  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Error!!! </strong> {this.props.errorMessage}
        </div>
      )
    }
  }
  previewFile() {
    var self = this;
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    var image;
    reader.addEventListener("load", function () {
      image = reader.result;
      self.setState({file: image})
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }

  }
  render() {
    const { handleSubmit, userInfo, fields: {image, tagline, location }} = this.props;
    let photos = userInfo.myPhotos || [];
    let notHiddenClass = this.state.file ? 'form-group' : 'form-group init-hidden'
    return (
      <div className="col-sm-12">
        <h4>Upload Photos to Your Photo Album</h4>
        <form onSubmit={handleSubmit(this.uploadPhotos.bind(this))}>
          <fieldset className="form-group">
            <input type="file" onChange={this.previewFile.bind(this)} />
          </fieldset>
          <fieldset className={notHiddenClass}>
            <label>Tagline: </label>
            <input className="form-control" type="text" {...tagline} />
            {tagline.touched && tagline.error && <div className="error">{tagline.error}</div>}
          </fieldset>
          <fieldset className={notHiddenClass}>
            <label>Location: </label>
            <input className="form-control" type="text" {...location} />
            {location.touched && location.error && <div className="error">{location.error}</div>}
          </fieldset>
          {this.renderAlert()}
          <button action="submit" className={this.state.file ? "btn btn-primary" : "hidden"}>Upload Photo</button>
        </form>
        <div className="col-sm-10 col-sm-offset-1">
          {photos.map((e) => {
            return (
              <div className="col-sm-4" key={e._id} onClick={() => {browserHistory.push(`/myphotos/${e._id}`)}}>
                <ul className="photoBookBorder">
                  <li>{e.location}</li>
                  <li>{e.tagline}</li>
                  <li><img className="photoBookImage" src={e.image}/></li>
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
function validate(formProps) {
  const errors = {};

  if (!formProps.tagline) {
    errors.tagline = 'Please Enter a Tagline';
  }
  return errors;
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default reduxForm({
  form: 'photoBook',
  fields: ['image', 'tagline', 'location'],
  validate,
}, mapStateToProps, actions)(PhotoBook);
