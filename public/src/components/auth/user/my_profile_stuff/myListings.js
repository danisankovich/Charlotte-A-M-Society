import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'
class MyListings extends Component {
  componentWillMount() {
    let listings = this.props.userInfo.myListings
    this.props.fetchMyListings(listings)
    this.setState({listings: []})
  }
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/listings/${clickResult}`);
  }
  deleteClickHandle(e) {
    e.preventDefault();
    let clickResult = this[1]._id;
    let array = this[2].state.listings;
    let index = this[2].state.listings.indexOf(clickResult)
    this[2].state.listings.splice(index, 1)
    this[0].removeListing(clickResult);
  }
  render() {
    this.state.listings = this.props.mylistings || []
    if(this.state.listings) {
      return (
        <div>
          {this.state.listings && this.state.listings.length > 0 && <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Listing Name</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Address</th>
                <th>Price Per Night</th>
                <th>Rating</th>
                <th>Open Applications</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listings.map(function(result) {
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
                    <td onClick={this.handleClick.bind(result)}>{result.rating === 0 ? 'Not Rated' : result.rating}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.applications.length}</td>
                    <td onClick={this.deleteClickHandle.bind([this.props, result, this])}>
                      <button type="button" className="btn btn-default">
                         Remove <span
                          className="glyphicon glyphicon-remove-circle" aria-hidden="true"
                          onClick={this.deleteClickHandle.bind([this.props, result, this])}
                        ></span>
                      </button>
                    </td>
                  </tr>
                )
              }.bind(this))}
            </tbody>
          </table>}
        </div>
      )
    } else {
      return <div>No Listings Found</div>
    }

  }
}

function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo, mylistings: state.listing.mylistings, userStuff: state.auth};
}
export default connect(mapStateToProps, actions)(MyListings);
