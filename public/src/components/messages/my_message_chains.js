import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../../actions';
import SingleMessageChain from './single_message_chain';
import $ from 'jquery';

//Messaging PAGE
class MyMessageChain extends Component {
  componentWillMount() {
    this.setState({renderedMessage: {}, newMessage: ''})
  }
  handleResponse(data) {
    this.setState({renderedMessage: data});
  }
  submitNewMessage() {
    const message = this.state.newMessage.replace(/<script/g, '');
    const renderedMessage = this.state.renderedMessage
    const recipientId = renderedMessage.userIds.indexOf(
      this.props.userInfo._id) === 0 ? renderedMessage.userIds[1] : renderedMessage.userIds[0];
    const recipientUsername = renderedMessage.usernames.indexOf(
      this.props.userInfo.username) === 0 ? renderedMessage.usernames[1] : renderedMessage.usernames[0];
    const data = {
      senderId: this.props.userInfo._id,
      senderUsername: this.props.userInfo.username,
      recipientId,
      recipientUsername,
      message,
    }
    $.ajax({
      url: `/api/messages/newmessage`,
      type: 'POST',
      data: data
    }).done((response) => {
      this.setState({renderedMessage: response});
    }).fail((err) => {
      console.log(err)
    })
  }
  render() {
    const {userInfo} = this.props
    const {renderedMessage} = this.state || {};
    return (
      <div className="col-sm-12">
        <div className="col-sm-3 chainList">
          <h4>Click User To Open Chat</h4>
          {userInfo && userInfo.messagesChainIds.map((message) => {
            return (
              <div key={message}>
                <SingleMessageChain
                  handleResponse={this.handleResponse.bind(this)}
                  userInfo={userInfo}
                  message={message}
                />
              </div>
            )
          })}
        </div>
        {renderedMessage && renderedMessage.messages && <div className="col-sm-9">
          <div className="textScroller">
          {renderedMessage.messages.map((message) => {
            return (
              <div key={message.dateSent} className="messagepush row">
                <div
                  className={(message.senderId === userInfo._id
                    ? "myMessage"
                    : "theirMessage")}
                  dangerouslySetInnerHTML={{__html: message.message}}
                >
                </div>
                <br />
              </div>
            )
          })}
          </div>
          <textarea
            className="form-control"
            id='sendMessageTextArea'
            onChange={(e)=>{this.state.newMessage = e.target.value}} cols='30'>
          </textarea>
          <button onClick={this.submitNewMessage.bind(this)}>Send</button>
        </div>}
      </div>
    );
  };
}
module.exports = MyMessageChain;
