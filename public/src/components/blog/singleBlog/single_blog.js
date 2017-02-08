import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import { browserHistory } from 'react-router'
import ReactMarkdown from 'react-markdown';
import { reduxForm } from 'redux-form';
import $ from 'jquery';

class SingleBlog extends Component {
  componentWillMount() {
    this.setState({editTitle: false, editBody: false});
  }
  componentDidMount() {
    let id = this.props.location.pathname.split('blogs/')[1]
    this.props.fetchSingleBlog(id);
  }
  componentWillReceiveProps(nextProps) {
    let id = this.props.location.pathname.split('blogs/')[1]
    if (this.props.blog && id && id !== this.props.blog.blog._id) {
      this.props.fetchSingleBlog(id)
    }
  }
  toBlog() {
    browserHistory.push(`/blogs/${this[1]}`)
    this[0].props.fetchSingleBlog(this[1]);
  }
  handleFormSubmit(formProps) { //called with props from submit form
    var data = formProps
    let id = this.props.location.pathname.split('blogs/')[1]
    data.username = this.props.userInfo.username;
    data.userId = this.props.userInfo._id;
    data.comments = [];
    $.ajax({
       url: `/api/blogs/newComment/${id}`,
       type: "POST",
       data: data
    }).done((response) => {
      this.props.fetchSingleBlog(id);
    }).fail((err) => {
      console.log(err)
    });
  }
  startEdit() {
    if(this[0].props.userInfo._id === this[0].props.blog.blog.creator.id) {
      const setTo = !this[0].state[this[1]] ? true : false;
      this[0].setState({[this[1]]: setTo})
    }
  }
  handleTextAreaChange(e) {
    this.setState({newBody: e.target.value})
  }
  submitEdit(e) {
    e.preventDefault()
    console.log('fired')
    const data = {
      type: this[2],
      change: this[0].state[this[2]],
      id: this[0].props.location.pathname.split('blogs/')[1],
      userId: this[0].props.userInfo._id
    }
    if (!data.change) {alert('Cannot Submit Without Change'); return;}
    if (data.type === 'newBody' && data.change.length < 200) {
      alert('body must be at least 200 characters')
      return;
    }
    $.ajax({
       url: `/api/blogs/editblog`,
       type: "PUT",
       data: data
    }).done((response) => {
      this[0].props.fetchSingleBlog(data.id);
    }).fail((err) => {
      console.log(err)
    });
    this[0].setState({[this[1]]: false});
  }
  hideEdit() {
    this[0].setState({[this[1]]: false});
  }
  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Error!!! </strong> {this.props.errorMessage}
        </div>
      )
    }
  }
  render() {
    const { handleSubmit, blog, userInfo, fields: { comment }} = this.props;
    if(blog && blog.blog) {
      return (
        <div className='toppush container'>
          <div className='row'>
            <div className='col-sm-8 col-sm-offset-2'>
              <h1>
                <span>
                  {!this.state.editTitle &&
                    <div>
                      {blog.blog.title} {userInfo._id == blog.blog.creator.id && <button
                        onClick={this.startEdit.bind([this, 'editTitle'])} className='btn btn-primary'>Edit
                      </button>}
                    </div>
                  }
                  {this.state.editTitle && <div>
                    <div>
                      <input
                        className='form-control'
                        defaultValue={blog.blog.title}
                        onChange={(e) => {this.state.newTitle = e.target.value}}
                      />
                      <button className='btn btn-danger' onClick={this.hideEdit.bind([this, 'editTitle'])}>Hide</button>
                      <button
                        onClick={this.submitEdit.bind([this, 'editTitle', 'newTitle'])}
                        className='btn btn-primary'>
                        Submit
                      </button>
                    </div>
                  </div>}
                </span>   --    by &nbsp; <a onClick={() => {browserHistory.push(`/userprofile/${blog.blog.creator.id}`)}}>
                  {blog.blog.creator.username}
                </a>
              </h1>
              <div>
                {!this.state.editTagline && <h3>
                  {blog.blog.tagline} {userInfo._id == blog.blog.creator.id && <button
                    className='btn btn-primary'
                    onClick={this.startEdit.bind([this, 'editTagline'])}>Edit
                  </button>}
                </h3>}
                {this.state.editTagline && <div>
                  <input
                    className='form-control'
                    defaultValue={blog.blog.tagline}
                    onChange={(e) => {this.state.newTagline = e.target.value}}
                  />
                  <button
                    className='btn btn-danger'
                    onClick={this.hideEdit.bind([this, 'editTagline'])}>
                    Hide
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={this.submitEdit.bind([this, 'editTagline', 'newTagline'])}>
                    Submit
                  </button>
                </div>}
              </div>
              <div>
                <div className='borderBottom'></div>
                  {!this.state.editBody && userInfo._id == blog.blog.creator.id && <button
                    className='btn btn-primary minipush'
                    onClick={this.startEdit.bind([this, 'editBody'])}>Edit Body
                  </button>}
                {!this.state.editBody && <div>
                  <ReactMarkdown
                    className='body-spacing'
                    source={blog.blog.body} />
                </div>
                }
                {this.state.editBody && <div className='minipush'>
                  <textarea
                    rows='10'
                    defaultValue={blog.blog.body}
                    className='form-control'
                    onChange={this.handleTextAreaChange.bind(this)}>
                  </textarea>
                  <button
                    className='btn btn-danger'
                    onClick={this.hideEdit.bind([this, 'editBody'])}>
                    Hide
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={this.submitEdit.bind([this, 'editBody', 'newBody'])}>
                    Submit
                  </button>
                </div>
                }
              </div>
            </div>
            <div className='col-sm-2'>
              <ul>
                {blog.blogList.map((blogEntry) => {
                  return (
                    <li key={blogEntry._id}>
                      <ul className='borderBottom'>
                        <li className="removeListBullet">{blogEntry.dateCreated.split('T')[0]}</li>
                        <li className="removeListBullet" onClick={this.toBlog.bind([this, blogEntry._id])}>{blogEntry.title}</li>
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-sm-8 col-sm-offset-2">
              <p>Comments: </p>
              {this.props.userInfo &&
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <label>New Comment: </label>
                  <textarea id="commentBlog" className="form-control" type="text" {...comment}></textarea>
                  {comment.touched && comment.error && <div className="error">{comment.error}</div>}
                  {this.renderAlert()}
                  <button action="submit" className="btn btn-primary">Submit</button>
                </form>
              }
              <div id='Comment-Section'>
                <ul>
                  {blog.blog.comments.map((comment) => {
                    return <li className="commentBlock" key={comment._id}>
                      <h4>{comment.username} at {comment.dateCreated}</h4>
                      <hr />
                      <p>{comment.comment}</p>
                    </li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='toppush'>LOADING ....... </div>
      )
    }

  };
}

function validate(formProps) {
  const errors = {};

  if (!formProps.comment) {
    errors.comment = 'Do Not Submit Without Supplying a Comment First';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    blog: state.blogs.blog,
    userInfo: state.auth.userInfo
  };
}

export default reduxForm({
  form: 'newBlog',
  fields: ['comment'],
  validate,
}, mapStateToProps, actions)(SingleBlog);
