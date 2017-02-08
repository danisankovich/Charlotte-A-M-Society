import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../actions';
import BasicInfo from './info/basic';

class Welcome_Container extends Component {
  componentDidMount() {
    this.props.fetchInfo();
  }
  render() {
    return (
      <div>
        <div id="headerImage">

        </div>
        <div className='center-div'>
          <div className="transbox">
            <h1>CAMS</h1>
          </div>
        </div>

        <div className="container background-down">
          <div className="row">
            <BasicInfo />
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    userInfo: state.auth.userInfo
  };
}
export default connect(mapStateToProps, actions)(Welcome_Container);
