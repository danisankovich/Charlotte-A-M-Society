import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import { reduxForm } from 'redux-form';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editEmail: false,
      editPhone: false,
      editUser: false,
    };
  }
  componentWillMount() {
    this.setState({
      editEmail: false,
      editPhone: false,
      editUser: false,
    });
  }
  componentDidMount() {
    this.props.fetchInfo();
  }

  // handle hide/show clicks
  handleClick(type) {
     this.setState(type);
     if (Object.keys(type)[0] === 'editUser') {
       this.setState({username: this.props.userInfo.userName})
     }
  }
  onEmailChange(event) {
    this.props.userInfo.username =+ event.target.value
  }

  handleFormSubmitPhoneNumber(formProps) { //called with props from submit form
    this.props.editUser(formProps, this.props.userInfo._id);
    this.props.fetchInfo();
    this.setState({editPhone: false})
  }
  handleFormSubmitEmail(formProps) { //called with props from submit form
    this.props.editUser(formProps, this.props.userInfo._id);
    this.props.fetchInfo();
    this.setState({editEmail: false})
  }
  handleLangClick(formProps) {
    this.props.editUser(formProps, this.props.userInfo._id);
    this.props.fetchInfo();
  }
  previewFile() {
    var self = this;
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    var image;
    reader.addEventListener("load", function () {
      image = reader.result;
      self.setState({file: image})
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  uploadAvatar() {
    let avatar = this.state.file;
    this.props.uploadAvatar(avatar, this.props.userInfo._id)
    this.props.fetchInfo();
    this.setState({file: ''})
  }
  render() {
    let self = this;
    const { handleSubmit, fields: {phoneNumber, email }} = this.props;

    let {userInfo} = this.props;

    let avatar = this.state.file
    if(userInfo) {
      return (
        <div className="toppush">
          <h3>Settings</h3>
          <p>Edit User Info: </p>
          <ul>
            <li>
              Username: {this.props.userInfo.username}
            </li>
            <li>Click On the Properties Below to Edit</li>
            <li
              className={this.state.editPhone ? 'hidden' : ''}
              onClick={function(){
                this.handleClick({editPhone: true})
              }.bind(this)}>
              Phone Number: {this.props.userInfo.phoneNumber || 'Set Number'}
            </li>
            <li className={this.state.editPhone ? '' : 'hidden'}>
              <form>
                <fieldset className="form-group">
                  <label>Phone Number: {this.props.userInfo.phoneNumber}</label>
                  {phoneNumber.touched && phoneNumber.error && <div className="error">{phoneNumber.error}</div>}
                  <input className="form-control" type="tel" {...phoneNumber}/>
                </fieldset>
                <button type='button' className="btn btn-danger"
                  onClick={function(){
                    this.handleClick({editPhone: false})
                  }.bind(this)}>
                  hide
                </button>
                <button onClick={handleSubmit(this.handleFormSubmitPhoneNumber.bind(this))} className="btn btn-primary">Save</button>
              </form>
            </li>
            <li
              className={this.state.editEmail ? 'hidden' : ''}
              onClick={function(){
                this.handleClick({editEmail: true})
              }.bind(this)}>
              Email: {this.props.userInfo.email}
            </li>
            <li className={this.state.editEmail ? '' : 'hidden'}>
              <form>
                <fieldset className="form-group">
                  <label>Email: {this.props.userInfo.email}</label>
                  {email.touched && email.error && <div className="error">{email.error}</div>}
                  <input className="form-control" {...email}/>
                </fieldset>
                <button type='button' className="btn btn-danger"
                  onClick={function(){
                    this.handleClick({editEmail: false})
                  }.bind(this)}>
                  hide
                </button>
                <button onClick={handleSubmit(this.handleFormSubmitEmail.bind(this))} className="btn btn-primary">Save</button>
              </form>
            </li>
            <li>
              <form onSubmit={handleSubmit(this.uploadAvatar.bind(this))}>
                <fieldset className="form-group">
                  <img src={userInfo.avatar} height="200px"/>
                  <br />
                  <label>Upload/Change Avatar: <input type="file" onChange={this.previewFile.bind(this)}/> </label>
                </fieldset>
                <button action="submit" className={this.state.file ? '' : 'hidden'}>Change Avatar</button>
              </form>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <div>Loading........ </div>
    );
  };
}

function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}

export default reduxForm({
  form: 'settings',
  fields: ['email', 'phoneNumber', 'avatar'],
}, mapStateToProps, actions)(Settings);
