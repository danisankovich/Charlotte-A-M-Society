import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'


class MySinglePhoto extends Component {
  componentWillMount() {
    this.setState({photo: {}});
  }

  render() {
    let {userInfo} = this.props;
    let photoToShow
    if (userInfo) {
      let photoId = this.props.location.pathname.split('myphotos/')[1];
      userInfo.myPhotos.forEach((e) => {
        if (e._id == photoId) {
          this.state.photo = e;
        }
      });
    }
    if (userInfo) {
      return (
        <div className="col-sm-12">
          <div className='imageHolderCenter'>
            <img src={this.state.photo.image} className='onephotoviewing'/>
          </div>
          <div>
            <ul>
              <li>Tagline: {this.state.photo.tagline}</li>
              <li>Location: {this.state.photo.location}</li>
            </ul>
          </div>
        </div>
      );
    } else {
      return <div>Loading</div>
    }

  }
}

function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(MySinglePhoto);
