import React, { Component } from 'react';
import CheckForUpdates from './CheckForUpdates';
import FoundUpdate from './FoundUpdate';
import DownloadUpdate from './DownloadUpdate';
import UpdateError from './UpdateError';
import { ipcRenderer } from 'electron';
import UpdaterStyles from './Updater.css';

export default class Updater extends Component {
  state = {
      info: {}
  };

  setUpdateState = (updateState) => {
    this.setState({ info: { ...updateState } });
  };

  componentDidMount () {
    ipcRenderer.send('update-state-request');
    this.handleUpdateStateChange = this.handleUpdateStateChange.bind(this);
    ipcRenderer.on('update-state-change', this.handleUpdateStateChange);
  }

  handleUpdateStateChange (e, state) {
    this.setUpdateState(state);
  }

  render () {
    console.log('this.state', this.state);
    return <div className={UpdaterStyles['updater-container']}>
    12312344
      <CheckForUpdates setUpdateState={this.setUpdateState} {...this.state.info} />
      <FoundUpdate setUpdateState={this.setUpdateState} {...this.state.info} />
      <DownloadUpdate setUpdateState={this.setUpdateState} {...this.state.info} />
      <UpdateError setUpdateState={this.setUpdateState} {...this.state.info} />
    </div>;
  }
}
