import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import * as actions from '../../../actions';
import ReactMarkdown from 'react-markdown';


class NewBlog extends Component {
  handleFormSubmit(formProps) { //called with props from submit form
    var data = formProps
    console.log(data)
    data.username = this.props.userInfo.username;
    if (data.tagline.length > 25) {
      alert('Tagline must be 25 characters or fewer');
      return;
    }
    data.id = this.props.userInfo._id;
    data.image = []
    this.props.newBlog(data);
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
  markdown() {
    this.setState({text: ''})
  }
  render() {

    const { handleSubmit, userInfo, fields: { tagline, title, body, keywords }} = this.props;
    var input = '# This is a header\n\nAnd this is a paragraph';
    if(typeof this.props.userInfo !== 'object') {
      this.props.fetchInfo();
    }
    if(this.props.userInfo) {
      return (
        <div className='toppush'>
          <div className='col-sm-12'>
            <div className='col-sm-6'>
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <fieldset className="form-group">
                  <label>Title: </label>
                  <input className="form-control" type="text" {...title} />
                  {title.touched && title.error && <div className="error">{title.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <label>Tagline: </label>
                  <input className="form-control" type="text" {...tagline} />
                  {tagline.touched && tagline.error && <div className="error">{tagline.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <label>Keywords: </label>
                  <input className="form-control" type="text" {...keywords} placeholder="separate keywords by a space" />
                  {keywords.touched && keywords.error && <div className="error">{keywords.error}</div>}
                </fieldset>
                <fieldset className="form-group">
                  <label>Body: </label>
                  <textarea className="form-control" type="text" {...body} onInput={this.markdown.bind(this)}></textarea>
                  {body.touched && body.error && <div className="error">{body.error}</div>}
                </fieldset>
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Post Blog</button>
              </form>
            </div>
            <div className='col-sm-6 previewMarkdown'>
              <ReactMarkdown source={body.value} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Loading....</div>
    }

  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.title) {
    errors.title = 'Please Enter a Title';
  }
  if (!formProps.tagline) {
    errors.tagline = 'Please Enter a Tagline';
  }
  if (!formProps.keywords) {
    errors.keywords = 'Please Enter at least one keyword';
  }
  if (formProps.keywords && formProps.keywords.length > 100) {
    errors.keywords = '100 Character maximum';
  }
  if (formProps.keywords && formProps.keywords.split(' ').length > 7) {
    errors.keywords = '7 keyword maximum';
  }
  if (!formProps.body) {
    errors.body = 'Please Enter a Body for your Blog';
  }
  if (formProps.body && formProps.body.length < 200) {
    errors.body = 'Blog post must be at least 200 characters'
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    userInfo: state.auth.userInfo
  };
}

export default reduxForm({
  form: 'newBlog',
  fields: ['image', 'body', 'title', 'tagline', 'keywords'],
  validate,
}, mapStateToProps, actions)(NewBlog);
