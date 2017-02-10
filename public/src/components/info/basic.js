import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router'
import GroupInfo from './group-info';

class BasicInfo extends Component {

  render() {

    return (
      <div className='container'>
        <div className='row'>
          <div className="col-sm-12">
            <div className='mainContent'>
              <h1>Welcome to the Charlotte Anime and Manga Society</h1>
              <div>
                <GroupInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = BasicInfo
