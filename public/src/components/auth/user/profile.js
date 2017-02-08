import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import PhotoBook from './my_profile_stuff/photobook';
import MyListings from './my_profile_stuff/myListings';
import MyBlogs from './my_profile_stuff/bloglist';

class Profile extends Component {
  componentWillMount() {
    this.setState({
      showPhotos: false,
      showListings: false,
      showBlogs: false,
      showApplications: false,
      showInfo: true
    })
  }
  componentDidMount() {
    this.props.fetchInfo();
  }
  show() {
    const self = this[0];
    const type = this[1];
    const hide = self.state[type] === true ? true : false
    const resetObj = {
      showPhotos: false,
      showListings: false,
      showBlogs: false,
      showApplications: false,
      showInfo: false
    }
    if (!hide) {
      resetObj[type] = true;
    } else {
      resetObj.showInfo = true;
    }
    self.setState(resetObj);
  }
  render() {
    let {userInfo} = this.props;
    return (
      <div className="toppush container">
        {userInfo && <div>
          <div className='row'>
            <div className="col-sm-3 col-sm-offset-1">
              <img src={this.props.userInfo.avatar} height='200px'/>
            </div>
            <div className='col-sm-3 col-sm-offset-2'>
              <h1>{userInfo.username + "'s"} Profile</h1>
            </div>
          </div>
          <div className='row'>
            <div className="col-sm-2 col-sm-offset-1">
              <button className='btn btn-primary' onClick={this.show.bind([this, 'showInfo'])}>Show Info</button>
              <button className='btn btn-primary' onClick={this.show.bind([this, 'showPhotos'])}>Show Photos</button>
              <button className='btn btn-primary' onClick={this.show.bind([this, 'showListings'])}>Show Listings ({this.props.userInfo.myListings.length})</button>
              <button className='btn btn-primary' onClick={this.show.bind([this, 'showBlogs'])}>Show Blogs ({this.props.userInfo.blogs.length})</button>
            </div>
            <div className="col-sm-8 col-sm-offset-1">
              {this.state.showInfo && <div className="col-sm-offset-1">
                <h3>Email: {userInfo.email}</h3>
                <h3>Phone Number: {userInfo.phoneNumber}</h3>
              </div>}
              {this.state.showPhotos && <PhotoBook userInfo={this.props.userInfo}></PhotoBook>}
              {this.state.showListings && <MyListings userInfo={this.props.userInfo}></MyListings>}
              {this.state.showBlogs && <MyBlogs userInfo={this.props.userInfo}></MyBlogs>}
            </div>
          </div>
        </div>}
        {!userInfo && <div>No User Found</div>}
      </div>
    );
  };
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(Profile);
