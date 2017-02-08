import React, {Component} from 'react';

class BookingApplications extends Component {
  componentWillMount() {
    this.setState({shownAppId: '', approveReject: ''})
  }
  handleClick() {
    this[0].state.shownAppId === this[1].applicationId
      ? this[0].setState({shownAppId: '', shownApp: ''})
      : this[0].setState({shownAppId: this[1].applicationId, shownApp: this[1]})
    if (!this[1].reviewed) {
      const application = this[1];
      $.ajax({
        url: `/api/listings/reviewedapplication`,
        type: 'PUT',
        data: application
      }).done((response) => {
        console.log(response)
      }).fail((err) => {
        console.log(err)
      })
    }
  }
  approve() {
    this[0].state.shownAppId === this[1].applicationId
      ? this[0].setState({shownAppId: '', shownApp: ''})
      : this[0].setState({shownAppId: this[1].applicationId, shownApp: this[1]})
    const application = this[1];
    application.approved = this[2];
    $.ajax({
      url: `/api/listings/approverejectapplication`,
      type: 'PUT',
      data: application
    }).done((response) => {
      const url = `/listings/${application.listingId}`
      const message = `
        Congratulations. Your listing request has been approved for listing
        <a href=${url}>HERE</a> for ${application.arrivalDate} to ${application.departureDate}.
        `
      const data = {
        senderId: this[0].props.userInfo._id,
        senderUsername: this[0].props.userInfo.username,
        recipientId: application.userId,
        recipientUsername: application.username,
        message,
      }
      $.ajax({
        url: `/api/messages/newmessage`,
        type: 'POST',
        data: data
      }).done((responseTwo) => {
        console.log(responseTwo)
      }).fail((err) => {
        console.log(err)
      })
    }).fail((err) => {
      console.log(err)
    })
  }
  render() {
    const applications = this.props.applications
    return (
      <div>
        {this.state.shownAppId === '' && applications && applications.length > 0 && <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Listing Title</th>
              <th>Listing Country</th>
              <th>Planned Date of Arrival</th>
              <th>Planned Date of Departure</th>
              <th>Reviewed</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(function(result) {
              return (
                <tr key={result.applicationId} className='table-row'>
                  <td onClick={this.handleClick.bind([this, result])}>{result.listingTitle}</td>
                  <td onClick={this.handleClick.bind([this, result])}>{result.listingLocation.country}</td>
                  <td onClick={this.handleClick.bind([this, result])}>{result.arrivalDate}</td>
                  <td onClick={this.handleClick.bind([this, result])}>{result.departureDate}</td>
                  <td onClick={this.handleClick.bind([this, result])}>{result.reviewed ? 'Yes' : 'No'}</td>
                  <td onClick={this.handleClick.bind([this, result])}>{result.approved==='approved' ? 'Approved' : result.approved === 'rejected' ? 'Rejected' : 'No'}</td>
              </tr>
              )
            }.bind(this))}
          </tbody>
        </table>}
        {this.state.shownAppId.length > 0 && <div>
          <ul>
            <li>Applicant's Name: {this.state.shownApp.firstName} {this.state.shownApp.lastName}</li>
            <li>Username: {this.state.shownApp.username}</li>
            <li>Country: {this.state.shownApp.listingLocation.country}</li>
            {this.state.shownApp.listingLocation.country === 'united states' && <div>
              <li>City: {this.state.shownApp.listingLocation.usCity}</li>
              <li>State: {this.state.shownApp.listingLocation.city}</li>
            </div>
            }
            {this.state.shownApp.listingLocation.country !== 'united states' &&
              <li>City: {this.state.shownApp.listingLocation.city}</li>
            }
            <li>Address: {this.state.shownApp.listingLocation.address}</li>
            <li>Arrival Date: this.state.shownApp.arrivalDate</li>
            <li>Departure Date: this.state.shownApp.departureDate</li>
            <li>
              <h4>Message: </h4>
              <p>{this.state.shownApp.message}</p>
            </li>
            <button onClick={this.approve.bind([this, this.state.shownApp, 'approved'])}>Approve</button>
            <button onClick={this.approve.bind([this, this.state.shownApp, 'rejected'])}>Reject</button>
          </ul>
          <button onClick={this.handleClick.bind([this, this.state.shownApp])}> Return</button>
        </div>}
      </div>
    )
  }
}
module.exports = BookingApplications
