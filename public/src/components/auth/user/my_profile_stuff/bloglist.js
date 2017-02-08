import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'
class MyBlogs extends Component {
  componentWillMount() {
    this.setState({blogs: []})
  }
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/blogs/${clickResult}`);
  }
  deleteClickHandle(e) {
    e.preventDefault();
    let clickResult = this[1]._id;
    let array = this[2].state.blogs;
    let index = this[2].state.blogs.indexOf(clickResult)
    this[2].state.blogs.splice(index, 1)
    console.log(this[2].state.blogs)
    this[0].removeBlog(clickResult);
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.blogs.map(function(result) {
                return (
                  <tr key={result._id} className='table-row'>
                    <td onClick={this.handleClick.bind(result)}>{result.title}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.keywords}</td>
                    <td onClick={this.handleClick.bind(result)}>({result.comments.length})</td>
                    <td onClick={this.deleteClickHandle.bind([this.props, result, this])}>
                      <button type="button" className="btn btn-default">
                         Remove <span
                          className="glyphicon glyphicon-remove-circle" aria-hidden="true"
                          onClick={(this.deleteClickHandle.bind([this.props, result, this]))}
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
      return <div>No Blogs Found</div>
    }

  }
}

function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(MyBlogs);
