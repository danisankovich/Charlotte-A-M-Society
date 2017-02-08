import React, {Component} from 'react';
import {connect} from 'react-redux';

// HIGHER ORDER COMPONENT

//wraps other components to add this feature to it: feature => kicks out unauthed users
export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }
    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/');
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('/');
      }
    }
    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }
  }
  function mapStateToProps(state) {
    return {authenticated: state.auth.authenticated};
  }
  return connect(mapStateToProps)(Authentication);
}
