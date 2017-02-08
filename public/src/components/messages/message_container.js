import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../../actions';
import MyMessageChains from './my_message_chains';
import $ from 'jquery';
//Messaging PAGE
class Message_Container extends Component {

  render() {
    const {userInfo} = this.props;
    return (
      <div className='container toppush'>
        <div className="row">
          <h1 className='text-center'>Messages</h1>
          {userInfo &&
            <MyMessageChains
              userInfo={userInfo}
            />
          }
        </div>
        <br />
      </div>
    );
  };
}
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    userInfo: state.auth.userInfo
  };
}
export default connect(mapStateToProps, actions)(Message_Container);
