import React from 'react';
import { ipcRenderer } from 'electron';
import UnloadedMockList from '../MockList/UnloadedMockList';
import LoadedMockList from '../MockList/LoadedMockList';
import FilePicker from '../../mocks/addFromFile/FilePicker';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.toggleLive = this.toggleLive.bind(this);
    this.state = {
      live: false
    };
  }

  toggleLive() {
    const currentLive = !this.state.live;
    ipcRenderer.send('go-live', currentLive);

    this.setState({
      live: currentLive
    });
  }

  render() {
    return (
      <div className="dashboard">
        <FilePicker />
        <div className="dashboard-columns">
          <div>
            <h2>Mocks:</h2>
            <UnloadedMockList buttonText="Load" />
          </div>
          <div>
            <h2>Loaded:</h2>
            <LoadedMockList buttonText="Unload" />
          </div>
        </div>
        <button className="dashboard__button" onClick={this.toggleLive}>
          {
            this.state.live
              ? 'Stop'
              : 'Start'
          }
        </button>
      </div>
    );
  }
}

Dashboard.propTypes = {};
