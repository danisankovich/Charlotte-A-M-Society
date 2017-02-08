import React, {Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'
class UserBlogs extends Component {
  componentWillMount() {
    this.setState({blogs: []})
  }
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/blogs/${clickResult}`);
  }
  render() {
    let {userInfo} = this.props
    this.state.blogs = userInfo.blogs || []
    if(this.state.blogs) {
      return (
        <div>
          {this.state.blogs && this.state.blogs.length > 0 && <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>keywords</th>
                <th># of Comments</th>
              </tr>
            </thead>
            <tbody>
              {this.state.blogs.map(function(result) {
                return (
                  <tr key={result._id} className='table-row'>
                    <td onClick={this.handleClick.bind(result)}>{result.title}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.keywords.join(', ')}</td>
                    <td onClick={this.handleClick.bind(result)}>({result.comments.length})</td>
                  </tr>
                )
              }.bind(this))}
            </tbody>
          </table>}
        </div>
      )
    } else {
      return <div>No Blogs Found</div>
    }

  }
}

function mapStateToProps(state) {
  return {userProfile: state.auth.userProfile};
}
export default connect(mapStateToProps, actions)(UserBlogs);
