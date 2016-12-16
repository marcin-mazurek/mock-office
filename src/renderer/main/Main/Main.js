import React from 'react';
import { ipcRenderer } from 'electron';
import Server from '../Server';
import ServerList from '../ServerList';
import { SERVER_START, SERVER_STOP } from '../../../common/messageNames';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLive = this.toggleLive.bind(this);
    this.state = {
      live: false
    };
  }

  toggleLive() {
    const currentLive = !this.state.live;
    const message = currentLive ? SERVER_START : SERVER_STOP;
    ipcRenderer.send(message);

    this.setState({
      live: currentLive
    });
  }

  render() {
    return (
      <div className="main">
        <div className="main-server-list">
          <div>List of servers:</div>
          <ServerList />
        </div>
        <Server
          toggleLive={this.toggleLive}
          buttonText={
            this.state.live
              ? 'Stop'
              : 'Start'
          }
        />
      </div>
    );
  }
}

Main.propTypes = {};
