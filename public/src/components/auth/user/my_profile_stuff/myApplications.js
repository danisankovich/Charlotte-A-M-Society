import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import { browserHistory } from 'react-router'
class MyApplications extends Component {
  componentWillMount() {
    this.setState({applications: []})
  }
  handleClick() {
    let clickResult = this._id;
    browserHistory.push(`/applications/${clickResult}`);
  }
  deleteClickHandle(e) {
    e.preventDefault();
    let clickResult = this[1]._id;
    let array = this[2].state.applications;
    let index = this[2].state.applications.indexOf(clickResult)
    this[2].state.applications.splice(index, 1)
    console.log(this[2].state.applications)
    this[0].removeApplication(clickResult);
  }
  render() {
    let {userInfo} = this.props
    this.state.applications = userInfo.applications || []
    if(this.state.applications) {
      return (
        <div>
          {this.state.applications && this.state.applications.length > 0 && <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Listing Title</th>
                <th>Listing Country</th>
                <th>Planned Date of Arrival</th>
                <th>Planned Date of Departure</th>
                <th>Reviewed</th>
                <th>Approved</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.applications.map(function(result) {
                return (
                  <tr key={result.applicationId} className='table-row'>
                    <td onClick={this.handleClick.bind(result)}>{result.listingTitle}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.listingLocation.country}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.arrivalDate}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.departureDate}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.reviewed ? 'Yes' : 'No'}</td>
                    <td onClick={this.handleClick.bind(result)}>{result.approved ? 'Yes' : result.approved === 'rejected' ? 'Rejected' : 'No'}</td>
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
      return <div>No applications Found</div>
    }

  }
}

function mapStateToProps(state) {
  return {userInfo: state.auth.userInfo};
}
export default connect(mapStateToProps, actions)(MyApplications);
