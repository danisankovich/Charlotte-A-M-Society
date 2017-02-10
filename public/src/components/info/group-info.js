import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import urls from './urls';
class GroupInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }
  componentDidMount() {
    $.get({
      url: `/api/test`,
      type: "GET",
    }).done((response) => {
      this.setState({group: response});
    }).fail((error) => {
      console.log(error)
    });
  }
  render() {
    function createMarkup(str) { return {__html: str}; };
    const {group} = this.state;
    return (
      <div>
        {group && group.description && <div>
          <div dangerouslySetInnerHTML={createMarkup(group.description)}></div>
        </div>
      }</div>
    );
  }
}
module.exports = GroupInfo
