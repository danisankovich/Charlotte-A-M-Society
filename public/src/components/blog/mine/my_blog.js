import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import { browserHistory } from 'react-router'
import {Link} from 'react-router';


class MyBlog extends Component {

  render() {
    let {userInfo} = this.props;
    let blogs = [];
    if(this.props.userInfo && Array.isArray(this.props.userInfo.blogs)) {
      console.log(userInfo)
      blogs = this.props.userInfo.blogs
    }
    return (
      <div className="col-sm-12 toppush">
        <div className="col-sm-10 col-sm-offset-1">
          This is where my blog stuff will go
        </div>
        <Link to="/blogs/mine/new"><button className="btn btn-success">Post New Blog Article</button></Link>

        <div className="col-sm-12">
          {blogs.map((e) => {
            return (
              <div className="col-sm-3" key={e._id} onClick={() => {browserHistory.push(`/blogs/${e._id}`)}}>
                <ul className="blogListingBorder">
                  <li>{e.title}</li>
                  <li>{e.tagline}</li>
                </ul>
              </div>
            )
          })}
        </div>
  </div>
    );
  }
}
function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(MyBlog);
