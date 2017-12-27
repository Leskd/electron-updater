import { shell } from 'electron';
import React, { Component } from 'react';
import { Spin } from 'antd';
import UpdaterStyles from './Updater.css';
import { version } from '../../../../package.json';

export default class CheckForUpdates extends Component {

  render () {
    const {isCheckingForUpdates, hasNoUpdateAvailable, unsupported} = this.props;
    let latestReleaseUrl = 'https://github.com/Leskd/electron-updater/releases/latest';

    if (!isCheckingForUpdates && !hasNoUpdateAvailable && !unsupported) {
      return null;
    }

    return <div className={UpdaterStyles['check-for-updates-container']}>
      <div>
        <p>Current Version: {version}</p>
      </div>
      <footer>
        { isCheckingForUpdates && <span>Checking for updates<Spin spinning={isCheckingForUpdates}></Spin></span> }
        { hasNoUpdateAvailable && <span>Appium is up-to-date</span> }
        { unsupported && <span>
          {`Auto update not supported on ${process.platform} platform. Download latest release from `}
          <a href='#' onClick={(e) => e.preventDefault() || shell.openExternal(latestReleaseUrl)}>{latestReleaseUrl}</a>
        </span> }
      </footer>
    </div>;
  }
}
