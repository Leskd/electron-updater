import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow, Menu } from 'electron';
import path from 'path';
import log from 'electron-log';
import _ from 'lodash';
import { version } from '../../package.json';


const isDev = process.env.NODE_ENV === 'development';
autoUpdater.autoDownload = false;

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('Auto updater starting');
class AutoUpdaterController {
  constructor () {
    this.updaterWin = null;
    this.state = {};
    
    autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this))
    autoUpdater.on('update-not-available', this.handleUpdateNotAvailable.bind(this));
    autoUpdater.on('checking-for-update', this.handleCheckingForUpdate.bind(this));
    autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this));
    autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this));
    autoUpdater.on('error', this.handleError.bind(this));

    ipcMain.on('update-state-request', (e)=> e.sender.send('update-state-change', this.state));
    ipcMain.on('update-download', this.downloadUpdate.bind(this));
    ipcMain.on('update-quit-and-install', autoUpdater.quitAndInstall || _.noop);
  }

  setMainWindow (mainWindow) {
    this.mainWindow = mainWindow;
  }

  downloadUpdate () {
    this.updaterWin.setSize(500, 150);
    this.setState({
      downloadProgress: {
        percent:0
      }
    });
    autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
  }

  
  handleUpdateAvailable (updateInfo) {
    console.log('Found update', updateInfo);
    this.openUpdaterWindow(this.mainWindow);
    this.forceFocus();
    this.setState({
      hasUpdateAvailable: true,
      updateInfo,
    });
  }

  handleUpdateNotAvailable () {
    console.info('No update available');
    this.setState({
      hasNoUpdateAvailable: true,
    });
  }

  handleCheckingForUpdate () {
    console.info('Looking for updates');
    this.setState({
      checkingForUpdate: true,
    });
  }

  handleDownloadProgress (downloadProgress) {
    log.info('Downloading...', downloadProgress);
    this.setState({
      status: 'Downloading',
      downloadProgress
    });
  }

  handleUpdateDownloaded (updateInfo) {
    console.info('Download complete', updateInfo);
    // Focus on window when the download is done to get the user's attention
    this.forceFocus();
    this.setState({
      updateDownloaded: true,
      updateInfo,
    });
  }

  handleError (error) {
    console.info('Updater error occurred', error);
    this.updaterWin.setSize(500, 125);
    this.setState({
      error,
    });
  }

  // 窗口聚焦
  forceFocus () {
    if (this.updaterWin) {
      this.updaterWin.focus();
    }
  }


  checkForUpdates () {
    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const SQUIRREL_FIRST_RUN = 'SQUIRREL_FIRST_RUN';

    if (isMac || isWin) {
      console.info('Checking for updates');


      this.setState({
        isCheckingForUpdates: true,
      })

      autoUpdater.checkForUpdates();
    } else {
      this.setState({
        unsupported: true,
      });
    }
  }

  setState (newSate) {
    this.state = {...newSate};
    if (this.updaterWin) {
      console.log('this.updaterWin setstate')
      this.updaterWin.send('update-state-change', this.state);
    }
  }

  openUpdaterWindow (mainWindow) {
    let updaterWin = this.updaterWin;
    if (updaterWin) {
      return;
    }

    this.updaterWin = updaterWin = new BrowserWindow({
      width: 550, 
      height: 450, 
      title: "Update Available", 
      backgroundColor: "#f2f2f2", 
      webPreferences: {
        devTools: true
      },
      resizable: true,
    })

    // let updaterHTMLPath = path.resolve(__dirname, isDev ? '..' : 'src', '', 'index.html');
    // updaterHTMLPath = updaterHTMLPath.replace("\\", "/");
    // updaterHTMLPath += '#/updater';
    // updaterWin.loadURL(`file://${updaterHTMLPath}`);
    let indexpath = path.resolve(__dirname, 'build');
    let index = isDev ? `http://localhost:3100/#/updater` : `file://${indexpath}/index.html#/updater`
    updaterWin.loadURL(index)
    updaterWin.show();

    updaterWin.once('closed', () => {
      this.updaterWin = null;
    });
    updaterWin.openDevTools();

    updaterWin.webContents.on('context-menu', (e, props) => {
      const {x, y} = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click () {
          updaterWin.inspectElement(x, y);
        }
      }]).popup(updaterWin);
    });

    mainWindow.on('closed', updaterWin.close);
  }
}

let autoUpdaterInstance = new AutoUpdaterController();
export default autoUpdaterInstance;





