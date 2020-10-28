import React from 'react'
import { render } from 'react-dom'
import electron from 'electron'

import { GlobalStyle } from './styles/GlobalStyle'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

interface WorkerSize {
  width:number | string,
  height:number | string
}

interface States {
  workerSize:WorkerSize
}

class App extends React.Component<null, States> {
  constructor (props: null) {
    super(props)
    this.state = {
      workerSize: electron.ipcRenderer.sendSync('get-worker-size')
    }
    electron.ipcRenderer.on('resize-event', (e, data) => {
      const { width, height } = JSON.parse(data)
      this.setState({ workerSize: { width, height } })
    })
  }

  render () {
    const { workerSize } = this.state
    return (
      <>
        <GlobalStyle />
        <webview src="https://www.electronjs.org/" style={{ width: workerSize.width, height: workerSize.height }}/>
      </>
    )
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
render(<App/>, mainElement)
