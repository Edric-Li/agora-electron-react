import { app, BrowserWindow, screen, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow: Electron.BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    },
    frame: false,
    resizable: false,
    fullscreen: true
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('resize', () => {
    const size = mainWindow?.getContentBounds()
    // eslint-disable-next-line no-unused-expressions
    mainWindow?.webContents.send('resize-event', JSON.stringify(size))
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })

ipcMain.on('get-worker-size', function (event) {
  event.returnValue = screen.getPrimaryDisplay().workAreaSize
})

app.allowRendererProcessReuse = true
