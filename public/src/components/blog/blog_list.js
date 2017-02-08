import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import { browserHistory } from 'react-router'
import $ from 'jquery';

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchAllBlogs();
  }
  handleChange(e) {
    this.setState({'searchField': e.target.value})
  }
  searchHandler(e) {
    e.preventDefault();
    if (!this.state || !this.state.searchField) {
      alert('Search Term Required');
      return;
    }
    let searchString = this.state.searchField;
    let searchQuery = searchString.replace(' ', '_');
    if (!this.state || !this.state.type) {
      this.state.type = 'inclusive'
    }
    console.log(this.state)
    this.props.fetchAllBlogs(searchQuery, this.state.type)
  }
  render() {
    let {userInfo, blogs} = this.props;
    // if(blogs && blogs.length) {
      return (
        <div className="col-sm-12">
          <div className="col-sm-10 col-sm-offset-1">
            <div>
              <form onSubmit={this.searchHandler.bind(this)} className='form-group'>
                <fieldset>
                  <label>Search Keywords: </label>
                  <input className='form-control' placeholder='Separate keywords by a space' onChange={this.handleChange.bind(this)}/>
                </fieldset>
                <fieldset>
                  <input type='radio' onChange={() => {this.setState({type: 'inclusive'})}} /> Inclusive
                  <input type='radio' onChange={() => {this.setState({type: 'exclusive'})}}/> Exclusive
                </fieldset>
                <button type='submit' className="btn btn-primary">Search</button>
              </form>
            </div>
            <div className="col-sm-12">
              {blogs && blogs.length > 0 && blogs.map((e) => {
                return (
                  <div className="col-sm-3" key={e._id} onClick={() => {browserHistory.push(`/blogs/${e._id}`)}}>
                    <ul className="blogListingBorder">
                      <li>Title: {e.title}</li>
                      <li>Tag: {e.tagline}</li>
                      <li>by: {e.creator.username}</li>
                    </ul>
                  </div>
                )
              })}
              {blogs && blogs.length === 0 && <h2>No Results Found</h2>}
            </div>
          </div>
        </div>
      );
    // } else {
    //   return <div className="toppush"><h1>No Blogs Found</h1></div>
    // }

  }
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo, blogs: state.blogs.blogs};
}
export default connect(mapStateToProps, actions)(BlogList);
