import $ from 'jquery';
import { browserHistory } from 'react-router'; // commits info about url to react router, and to make changes to url
import {
  NEW_BLOG,
  FETCH_SINGLE_BLOG,
  FETCH_ALL_BLOGS,
  FETCH_INFO
} from '../types';

// const ROOT_URL = 'http://localhost:3000/api';

exports.createBlog = function(data, dispatch) {
  $.ajax({
     url: `/api/blogs/new`,
     type: "POST",
     data: data
  }).done((response) => {
    console.log(response)
    dispatch({
      type: FETCH_INFO,
      payload: response
    })
    browserHistory.push('/blogs/mine'); // success pushes you to /information.
  }).fail((err) => {
    console.log(err)
  });
}

exports.getBlog = function(id, dispatch) {
  $.ajax({
     url: `/api/blogs/blog/${id}`,
     type: "GET",
  }).done((response) => {
    dispatch({
      type: FETCH_SINGLE_BLOG,
      payload: response
    })
  });
}

exports.getAllBlogs = function(dispatch, queryString, type) {
  $.ajax({
     url: `/api/blogs/${queryString}?type=${type}`,
     type: "GET",
  }).done((response) => {
    dispatch({
      type: FETCH_ALL_BLOGS,
      payload: response
    })
  });
}
