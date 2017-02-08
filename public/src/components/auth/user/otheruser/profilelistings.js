import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'
class MyListings extends Component {
  componentWillMount() {
    let listings = this.props.userProfile.myListings
    this.props.fetchMyListings(listings)
  }
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/listings/${clickResult}`);
  }
  saveClickHandle(e) {
    e.preventDefault();
    let clickResult = this[1]._id;
    let array = this[0].userProfile.myListings;
    let index = this[0].userProfile.myListings.indexOf(clickResult)
    array.splice(index, 1)
    console.log('this will save listing to favorites')
  }
  render() {
    let listings = this.props.mylistings || []
    if(listings) {
      return (
        <div>
          {listings && listings.length > 0 && <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Listing Name</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Address</th>
                <th>Price Per Night</th>
                <th>Rating</th>
                <th>Save Listing</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(function(result) {
                console.log(result)
                return (
                  <tr key={result._id} className='table-row'>
                    <td onClick={this.handleClick.bind(result)}>{result.title}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.location.country}</td>
                    {result.location.country === 'united states' && <td onClick={this.handleClick.bind(result)}>{result.location.city}</td>}
                    {result.location.country !== 'united states' && <td onClick={this.handleClick.bind(result)}>X</td>}
                    {result.location.usCity !== 'not valid' && <td onClick={this.handleClick.bind(result)}>{result.location.usCity}</td>}
                    {result.location.usCity === 'not valid' && <td onClick={this.handleClick.bind(result)}>{result.location.city}</td>}
                    <td onClick={this.handleClick.bind(result)}>{result.location.address}</td>
                    <td onClick={this.handleClick.bind(result)}>${result.pricePerNight}</td>
                    <td onClick={this.handleClick.bind(result)}>rating</td>
                    <td onClick={this.saveClickHandle.bind([this.props, result])}><button>X</button></td>
                  </tr>)
              }.bind(this))}
            </tbody>
          </table>}
        </div>
      )
    } else {
      return <div>LOADING...</div>
    }

  }
}

function mapStateToProps(state) {
  return {userProfile: state.auth.userProfile, mylistings: state.listing.mylistings};
}
export default connect(mapStateToProps, actions)(MyListings);
