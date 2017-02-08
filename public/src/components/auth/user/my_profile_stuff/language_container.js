import React, {Component} from 'react';

class MyLanguages extends Component {
  render() {
    const languages = this.props.languages.length > 0 ? this.props.languages.join(', ') : 'None Listed';
    return (
      <div>
        <h4>Languages: {languages}</h4>
      </div>
    )
  }
}

export default MyLanguages;
