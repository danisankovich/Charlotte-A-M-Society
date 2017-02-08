import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import Listings from './listings';
import {Link} from 'react-router';

//WELCOMING PAGE
class Listings_Container extends Component {
  render() {
      return (
        <div className='container toppush'>
          <div className="row">
            <div className="col-sm-12">
              <h1 className='text-center'>Listings</h1>
              <Link to="/new"><button className="btn btn-success">Post New Listing</button></Link>
            </div>
          </div>
          <br />
          <div className='row'>
            <Listings />
          </div>
        </div>
      );
  };
}

module.exports = Listings_Container
