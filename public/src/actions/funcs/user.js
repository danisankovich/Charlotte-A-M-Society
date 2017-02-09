import $ from 'jquery';
import { browserHistory } from 'react-router'; // commits info about url to react router, and to make changes to url
import {
  AUTH_USER,
  AUTH_ERROR,
  EDIT_USER,
  UPLOAD_PHOTO,
  UPLOAD_AVATAR,
  UNAUTH_USER,
  FETCH_INFO,
  FETCH_PROFILE
} from '../types';

// const ROOT_URL = 'http://localhost:3000/api';

exports.signIn = function(dispatch, {email, password}) {
  $.post(`/api/signin`, { email, password })
    .done(response => {
      dispatch({type: AUTH_USER});
      localStorage.setItem('token', response.token);
      browserHistory.push('/'); // success pushes you to /information.
    })
    .fail(() => {
      // catch does not take you to new page
      dispatch(authError('EMAIL/PASSWORD combo incorrect'));
    })
}

exports.signUp = function(dispatch, {email, password, username}) {
  console.log(email)
  $.ajax({
    url: `/api/signup`,
    type: "POST",
    data: {email, password, username},
  })
    .done(response => {
      dispatch({type: AUTH_USER});

      localStorage.setItem('token', response.token);

      browserHistory.push('/information'); // success pushes you to /information.
    }).fail((error) => {
      console.log(error.responseText)
      dispatch(authError(error.responseText));
    });
}

exports.userEdit = function(dispatch, {phoneNumber, email, lang, aboutMe}, user) {
  dispatch({type: EDIT_USER});
  const data = JSON.stringify({phoneNumber, email, user, lang, aboutMe });
  $.ajax({
    url: `/api/editInfo`,
    type: "POST",
    data: {data},
  })
    .done(response => {
      dispatch({type: FETCH_INFO});
    }).fail((error) => {
      console.log(error)
      dispatch(authError(error.response.error));
    });
}
exports.avatarUpload = function(photo, user, dispatch) {
  dispatch({type: UPLOAD_AVATAR});

  $.ajax({
    url: `/api/uploadavatar`,
    type: "POST",
    data: {image: photo, user},
  })
    .done(response => {
      dispatch({type: FETCH_INFO});
    }).fail((error) => {
      console.log(error)
      dispatch(authError(error.response.error));
    });
}
exports.myPhotoUpload = function(dispatch, photo, user) {
  dispatch({type: UPLOAD_PHOTO});

  $.ajax({
    url: `/api/uploadmyphoto`,
    type: "POST",
    data: {image: photo.image, location: photo.location, tagline: photo.tagline, user},
  })
    .done(response => {
      dispatch({type: FETCH_INFO});
    }).fail((error) => {
      console.log(error)
      dispatch(authError(error.response.error));
    });
}
exports.getUser = function(dispatch) {
  var token = localStorage.getItem('token')
  $.ajax({
     url: '/api/',
     type: "GET",
     headers: {
        "authorization": token
     }
  }).done((response) => {
    dispatch({
      type: FETCH_INFO,
      payload: response
    })
  }).fail((err) => {
    console.log('error', err)
  });
}
exports.getUserProfile = function(dispatch, userId) {
  $.ajax({
     url: `/api/user/${userId}`,
     type: "GET"
  }).done((response) => {
    dispatch({
      type: FETCH_PROFILE,
      payload: response
    })
  }).fail((err) => {
    console.log('error', err)
  });
}
export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

exports.deleteListing = function(id, dispatch) {
  var token = localStorage.getItem('token')
  $.ajax({
     url: `/api/listings/deleteListing/${id}`,
     type: "DELETE",
     headers: {
       "authorization": token
     }
  }).done((response) => {
    dispatch({
      type: FETCH_INFO,
      payload: response
    })
  }).fail((err) => {
    console.log('error', err)
  });
}
exports.deleteBlog = function(id, dispatch) {
  var token = localStorage.getItem('token')
  $.ajax({
     url: `/api/blogs/deleteBlog/${id}`,
     type: "DELETE",
     headers: {
       "authorization": token
     }
  }).done((response) => {
    dispatch({
      type: FETCH_INFO,
      payload: response
    })
  }).fail((err) => {
    console.log('error', err)
  });
}
