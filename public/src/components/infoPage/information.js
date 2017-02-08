import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import {Link} from 'react-router';

class Information extends Component {
  componentDidMount() {
    this.props.fetchInfo();
  }
  render() {
    let {userInfo} = this.props;
    if(userInfo) {
      return (
        <div className='container toppush'>
          <h1>Welcome To the Charlotte Anime and Manga Society</h1>
          <p className="infoPara">
            Thank you for signing up to our website. We hope to see you at our meetups. Please feel
            free to contact the site admins and group organisers if you have any questions or concerns.
          </p>
        </div>
      );
    }
    return (
      <div>Loading...... </div>
    );
  };
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(Information);
