import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import PhotoBook from './photobook';
import ProfileListings from './profilelistings';
import BlogList from './bloglist';
import $ from 'jquery';

class UserProfile extends Component {
  componentWillMount() {
    this.setState({showPhotos: false, showListings: false})
  }
  componentDidMount() {
    this.props.fetchInfo();
    let id = this.props.location.pathname.split('userprofile/')[1]
    this.props.fetchProfileInfo(id);
  }
  unfollowOrFollowUser() {
    var token = localStorage.getItem('token');
    var url = this[1];
    $.ajax({
       url,
       type: "PUT",
       data: {user: this[0].props.userProfile._id},
       headers: {
          "authorization": token
       }
    }).done((response) => {
      if (url === '/api/addfollower') alert(this[0].props.userProfile.username + ' has been added to your following list')
      if (url === '/api/removefollower') alert(this[0].props.userProfile.username + ' has been removed from your following list')
      this[0].props.fetchInfo();
    }).fail((err) => {
      console.log('error', err)
    });
  }
  showAlbums() {
    this.state.showListings = false
    this.state.showPhotos ? this.setState({showPhotos: false}) : this.setState({showPhotos: true})
  }
  showListings() {
    this.state.showPhotos = false
    this.state.showListings ? this.setState({showListings: false}) : this.setState({showListings: true})
  }
  showBlogs() {
    this.state.showPhotos = false;
    this.state.showListings = false;
    this.state.showBlogs ? this.setState({showBlogs: false}) : this.setState({showBlogs: true})
  }
  render() {
    let {userProfile, userInfo} = this.props;
    if(userProfile && userProfile.languages) {
      let photos = userProfile.myPhotos;
      return (
        <div className="toppush container">
          <div className='row'>
            <div className="col-sm-10 col-sm-offset-1">
              <h2>{userProfile.username + "'s"} Profile</h2>
              {userInfo && userInfo.following.indexOf(userProfile._id) === -1 && <h3>
                <button className='btn btn-primary' onClick={this.unfollowOrFollowUser.bind([this, '/api/addfollower'])}>Follow +</button></h3>}
              {userInfo && userInfo.following.indexOf(userProfile._id) > -1 && <h3>
                <button className='btn btn-danger' onClick={this.unfollowOrFollowUser.bind([this, '/api/removefollower'])}>Unfollow -</button></h3>}
              <h3>Email: {userProfile.email}</h3>
              <h3>Phone Number: {userProfile.phoneNumber}</h3>
              <h4>
                Languages: {
                  userProfile.languages.map((lang, i) => {
                    if (i === this.props.userProfile.languages.length -1) {
                      return lang;
                    }
                    return lang + ', '
                  })
                }
              </h4>
              <img src={this.props.userProfile.avatar} height='200px'/>
            </div>
          </div>
          <div className='row'>
            <div className="col-sm-10 col-sm-offset-1">
              <button onClick={this.showAlbums.bind(this)}>Show Albums</button>
              <button onClick={this.showListings.bind(this)}>Show Listings</button>
              <button onClick={this.showBlogs.bind(this)}>Show Blogs</button>
            </div>
            <div className="col-sm-10 col-sm-offset-1">
              {this.state.showPhotos && <PhotoBook userProfile={this.props.userProfile}></PhotoBook>}
              {this.state.showListings && <ProfileListings userProfile={this.props.userProfile} userInfo={this.props.userInfo}></ProfileListings>}
              {this.state.showBlogs && <BlogList userInfo={this.props.userProfile}></BlogList>}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>Loading........ </div>
    );
  };
}
function mapStateToProps(state) {
  return {userProfile: state.auth.userProfile, userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(UserProfile);
