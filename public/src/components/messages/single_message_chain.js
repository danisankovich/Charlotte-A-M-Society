import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../../actions';
import $ from 'jquery';

//Messaging PAGE
class MyMessageChains extends Component {
  componentDidMount() {
    $.ajax({
       url: `/api/messages/${this.props.message}/${this.props.userInfo._id}`,
       type: "GET",
    }).done((response) => {
      this.setState({messageChain: response});
      this.props.fetchInfo();
    }).fail((err) => {
      console.log(err)
    });
  }
  getMessageData() {
    this.props.handleResponse(this.state.messageChain);
  }
  render() {
    const {messageChain} = this.state || []
    const {userInfo} = this.props

    return (
      <div className="borderBottom messageChainUser" onClick={this.getMessageData.bind(this)}>
        {
          messageChain &&
          <h3>Username: {userInfo.username === messageChain.usernames[0]
              ? messageChain.usernames[1]
              : messageChain.usernames[0]
            }
          </h3>
        }
      </div>
    );
  };
}
function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    userInfo: state.auth.userInfo
  };
}
export default connect(mapStateToProps, actions)(MyMessageChains);
