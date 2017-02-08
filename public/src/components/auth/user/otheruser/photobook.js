import React, {Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'


class PhotoBook extends Component {
  componentWillMount() {
    this.setState({file: ''});
  }
  render() {
    const { userProfile } = this.props;
    let photos = userProfile.myPhotos || [];
    let notHiddenClass = this.state.file ? 'form-group' : 'form-group init-hidden'
    return (
      <div className="col-sm-12">
        <div className="col-sm-10 col-sm-offset-1">
          {photos.map((e) => {
            return (
              <div className="col-sm-4" key={e._id} onClick={() => {browserHistory.push(`/myphotos/${e._id}`)}}>
                <ul className="photoBookBorder">
                  <li>{e.location}</li>
                  <li>{e.tagline}</li>
                  <li><img className="photoBookImage" src={e.image}/></li>
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
  return {userProfile: state.auth.userProfile};
}
export default connect(mapStateToProps, actions)(PhotoBook);
