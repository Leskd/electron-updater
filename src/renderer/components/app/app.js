import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
  static propTypes = {
    children : PropTypes.element.isRequired
  }

  render () {
    return <div className='app-container'>
      {this.props.children}
    </div>
  }
}