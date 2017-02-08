import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router';
import _ from 'lodash';

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = { city: '', country: ''};
  }
  render() {
    return (
      <div>
        <h1>Here toooooo</h1>
      </div>
    );
  };
}
function mapStateToProps(state) {
  return {listings: state.listing.listings};
}
export default connect(mapStateToProps, actions)(Listing);
