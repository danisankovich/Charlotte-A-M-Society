import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router'


class BasicInfo extends Component {

  render() {

    return (
      <div className='container'>
        <div className='row'>
          <div className="col-sm-12">
            <div className="col-sm-6">
              <p className="textSegment">Here at HFH, we aim to open up the world to people and
                make travelling a simpler, more enjoyable process for all.
              </p>
              <p className="textSegment">So read a blog, book a place to stay, and connect with your fellow members.
                There is a whole world out there to explore.
              </p>
            </div>
            <div className="col-sm-4">
              <img className="photoOne" src="../../../images/japan.jpg"></img>
            </div>
          </div>
        </div>
        <div className="top-buffer"></div>
        <div className='row'>
          <div className="col-sm-12">
            <div className="col-sm-3">
              <img className="photoBlock" src="../../../images/camels.jpg"></img>
            </div>
            <div className="col-sm-7 col-sm-offset-2">
              <img className="photoBlock" src="../../../images/scotland.jpg"></img>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
module.exports = BasicInfo
