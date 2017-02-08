import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router'
import ReactMarkdown from 'react-markdown';
import BookingApplications from './booking_applications';
import $ from 'jquery';

class SingleListing extends Component {
  componentWillMount() {
    this.setState({listing: '', inputValue: '', application: {}})
  }
  componentDidMount() {
    let id = this.props.location.pathname.split('listings/')[1]
    this.props.fetchSingleListing(id);
  }
  handleClick(type) {
    if(this.props.userInfo._id = this.props.listing.creator.id) {
      this.setState(type);
    }
  }
  changeUsCity(event) {
    this.setState({usCity: event.target.value, type:'usCity'});
  }
  handleFormSubmit(e) { //called with props from submit form
    e.preventDefault();
    let listing = this.state.listing
    listing.type = this.state.type
    if(listing.type === 'address') {
      listing.location[listing.type] = this.state.inputValue
    }
    else if(listing.type === 'usCity') {
      listing.location[listing.type] = this.state.usCity
    }
    else {
      listing[listing.type] = this.state.inputValue
      if(listing.type === 'pricePerNight' && isNaN(listing[listing.type])) {
        alert('Must supply a valid number');
        return;
      }
    }
    this.props.editListing({listing}, this.props.userInfo._id)
    this.setState({editAddress: false, editusCity: false, editPrice: false})
  }
  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
  applyForBooking(e) {
    // e.preventDefault();
    var token = localStorage.getItem('token');
    const application = this.state.application;
    application.listerId = this.state.listing.creator.id;
    application.listingTitle = this.state.listing.title;
    const locations = this.state.listing.location;
    application.listingLocation = JSON.stringify(locations);

    if(!application.firstName ||
      !application.lastName ||
      !application.arrivalDate ||
      !application.departureDate ||
      !application.message) {
      e.preventDefault();
      alert('All Fields Are Required');
      return;
    }
    application.username = this.props.userInfo.username;
    $.ajax({
      url: `/api/listings/apply/${this.props.listing._id}`,
      type: 'PUT',
      data: application,
      headers: {
        "authorization": token
      }
    }).done((response) => {
      alert('Application made. The owner of the listing should be back with you within a few days')
      this.state.application = {};
    }).fail((err) => {
      console.log(err)
    })
  }
  render() {
    let {listing, userInfo} = this.props;
    let usCities = []
    if(listing && listing.location.country === 'united states') {
      let usState = listing.location.city.toUpperCase();
      usCities = us_cities_by_state[usState]
    }
    let incrementKey = 0
    if(listing && listing.location && userInfo) {
      this.state.listing = listing
      return (
        <div>
          <div className="col-sm-10 col-sm-offset-1">
            <div className="">
              <div className="thumbnail">
                <img className="img-responsive center-block"
                  src={listing.image}
                />
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12">
                  <div className="col-sm-5 col-sm-offset-1">
                    <h3>Listing Location: </h3>
                    <ul>
                      <li
                        className={ this.state.editAddress ? 'hidden' : ''}
                        onClick={function(){
                           if (this.props.userInfo._id === this.props.listing.creator.id) {
                             this.handleClick({editAddress: true})
                           }
                        }.bind(this)}
                      >
                        Address: {listing.location.address}
                      </li>
                      {this.props.userInfo._id === this.props.listing.creator.id && <li className={this.state.editAddress ? '' : 'hidden'}>
                        <form onSubmit={this.handleFormSubmit.bind(this)}>
                          <fieldset className="form-group">
                            <label>New Address: </label>
                            <input className="form-control"
                              onChange={function(evt) {
                                this.setState({
                                  inputValue: evt.target.value, type: 'address'
                                });
                              }.bind(this)}/>
                          </fieldset>
                          <button type='button' className="btn btn-danger"
                            onClick={function(){
                              if (this.props.userInfo._id === this.props.listing.creator.id) {
                                this.handleClick({editAddress: false})
                              }
                            }.bind(this)}>
                            hide
                          </button>
                          <button action="submit" className="btn btn-primary">Save</button>
                        </form>
                      </li>}
                      {listing.location.usCity !=='not valid' &&
                        <li
                          className={this.state.editusCity ? 'hidden' : ''}
                          onClick={function(){
                            if (this.props.userInfo._id === this.props.listing.creator.id) {
                              this.handleClick({editusCity: true})
                            }
                          }.bind(this)}
                        >
                          City: {listing.location.usCity}
                        </li>}
                        {this.props.userInfo._id === this.props.listing.creator.id && <li className={this.state.editusCity ? '' : 'hidden'}>
                          <form onSubmit={this.handleFormSubmit.bind(this)}>
                            <fieldset className="form-group">
                              <label>City: </label>
                              <select className="form-control" onChange={this.changeUsCity.bind(this)}>
                                <option key="default">Pick A City</option>
                                {usCities.map((e) => {
                                  if(usCities.length > 0) return <option key={incrementKey+=1} value={e}>{e}</option>
                                })}
                              </select>
                            </fieldset>
                            <button type='button' className="btn btn-danger"
                              onClick={function(){
                                if (this.props.userInfo._id === this.props.listing.creator.id) {
                                  this.handleClick({editusCity: false})
                                }
                              }.bind(this)}>
                              hide
                            </button>
                            <button action="submit" className="btn btn-primary">Save</button>
                          </form>
                        </li>}
                      {listing.location.usCity !=='not valid' && <li>State: {listing.location.city}</li>}
                      {listing.location.usCity ==='not valid' && <li>City: {listing.location.city}</li>}
                      <li>Country: {listing.location.country}</li>
                    </ul>
                    <h3>Listing Details: </h3>
                    <ul>
                      <li
                        className={this.state.editPrice ? 'hidden' : ''}
                        onClick={function(){
                          if (this.props.userInfo._id === this.props.listing.creator.id) {
                            this.handleClick({editPrice: true})
                          }
                        }.bind(this)}
                      >
                        Price: ${listing.pricePerNight} / night
                      </li>
                      {this.props.userInfo._id === this.props.listing.creator.id && <li className={this.state.editPrice ? '' : 'hidden'}>
                        <form onSubmit={this.handleFormSubmit.bind(this)}>
                          <fieldset className="form-group">
                            <label>New Price: </label>
                            <input className="form-control" type="number" min="0.01" step="0.01" max="5000.00"
                              onChange={function(evt) {
                                this.setState({
                                  inputValue: evt.target.value, type: 'pricePerNight'
                                });
                              }.bind(this)}/>
                          </fieldset>
                          <button type='button' className="btn btn-danger"
                            onClick={function(){
                              if (this.props.userInfo._id === this.props.listing.creator.id) {
                                this.handleClick({editPrice: false})
                              }
                            }.bind(this)}>
                            hide
                          </button>
                          <button action="submit" className="btn btn-primary">Save</button>
                        </form>
                      </li>}
                      <li>Email: {listing.creator.email}</li>
                      <li>Phone Number: {listing.creator.phoneNumber}</li>
                    </ul>
                    <h3>Description: </h3>
                    <ReactMarkdown className='body-spacing' source={listing.description} />
                  </div>
                  <div className="col-sm-6">
                    {this.props.userInfo._id !== this.props.listing.creator.id && <form onSubmit={this.applyForBooking.bind(this)}>
                      <fieldset className='form-group'>
                        <div className='col-sm-11 col-sm-offset-1'>
                          <h3>Book This Listing: </h3>
                        </div>
                        <div className='col-sm-12'>
                          <div className='col-sm-6'>
                            <label>First Name: </label>
                            <input
                              className='form-control'
                              onChange={(e) => this.state.application.firstName = e.target.value}
                            />
                          </div>
                          <div className='col-sm-6'>
                            <label>Last Name: </label>
                            <input
                              className='form-control'
                              onChange={(e) => this.state.application.lastName = e.target.value}
                            />
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className='form-group'>
                        <div className='col-sm-12'>
                          <div className='col-sm-6'>
                            <label>Arrival Date: </label>
                            <input
                              type='date'
                              className='form-control'
                              onChange={(e) => this.state.application.arrivalDate = e.target.value}
                            />
                          </div>
                          <div className='col-sm-6'>
                            <label>Departure Date: </label>
                            <input
                              type='date'
                              className='form-control'
                              onChange={(e) => this.state.application.departureDate = e.target.value}
                            />
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className='form-group'>
                        <div className='col-sm-12'>
                          <div className='col-sm-12'>
                            <label>Send a Note to the Owner: </label>
                            <textarea
                              className='form-control'
                              onChange={(e) => this.state.application.message = e.target.value}
                            ></textarea>
                          </div>
                        </div>
                      </fieldset>
                      <button type='submit'>Submit Application</button>
                    </form>}
                    {this.props.userInfo._id === this.props.listing.creator.id && <BookingApplications userInfo={userInfo} applications={listing.applications}/>}
                  </div>
                </div>
              </div>

            </div>
            <br />
          </div>
        </div>
      );
    }
    return (
      <div>Loading...... </div>
    );
  };
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo, listing: state.listing.listing};
}
export default connect(mapStateToProps, actions)(SingleListing);
