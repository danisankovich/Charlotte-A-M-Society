import $ from 'jquery';
import { browserHistory } from 'react-router'; // commits info about url to react router, and to make changes to url
import {
  FETCH_LISTINGS,
  FETCH_MY_LISTINGS,
  NEW_LISTING,
  FETCH_SINGLE_LISTING,
  EDIT_LISTING,
} from '../types';
// const ROOT_URL = 'http://localhost:3000/api';

exports.getListing = function(id, dispatch) {
  var token = localStorage.getItem('token')

  $.ajax({
     url: `/api/listings/${id}`,
     type: "GET",
     headers: {
        "authorization": token
     }
  }).done((response) => {
    dispatch({
      type: FETCH_SINGLE_LISTING,
      payload: response
    })
  });
}
exports.getAllListings = function(term, otherParams, dispatch) {
  $.ajax({
     url: `/api/listings/location/${term}`,
     type: "GET",
     data: otherParams
  }).done((response) => {
    dispatch({
      type: FETCH_LISTINGS,
      payload: response
    })
  });
}
exports.getMyListings = function(array, dispatch) {
  $.ajax({
     url: '/api/listings/mylistings',
     type: "POST",
     data: {data: JSON.stringify(array)}
  }).done((response) => {
    dispatch({
      type: FETCH_MY_LISTINGS,
      payload: response
    })
  });
}
exports.createListing = function(data, dispatch) {
  var token = localStorage.getItem('token')
  $.ajax({
     url: `/api/listings/new`,
     type: "POST",
     headers: {
        "authorization": token
     },
     data: data
  }).done((response) => {
    dispatch({
      type: NEW_LISTING,
      payload: response
    })
  })
}
exports.edit = function(listing, userId, dispatch) {
  var token = localStorage.getItem('token')
  let data = JSON.stringify(listing)
  $.ajax({
     url: `/api/listings/editListing`,
     type: "POST",
     headers: {
        "authorization": token
     },
     data: {data}
  }).done((response) => {
    dispatch({
      type: EDIT_LISTING,
      payload: response
    })
  })
}
