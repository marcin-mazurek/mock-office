import React from 'react';
import { ipcRenderer } from 'electron';
import MockList from '../MockList';

const MOCKS = [
  {
    id: 1,
    request: {
      url: '/bets'
    },
    response: {
      body: {
        bets: [
          'bet1',
          'bet3'
        ]
      }
    }
  }
];

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.toggleLive = this.toggleLive.bind(this);
    this.state = {
      mocks: MOCKS,
      loaded: [],
      live: false
    };
  }

  load(id) {
    const { mocks, loaded } = this.state;
    const mockForLoadIndex = mocks.findIndex(mock => mock.id === id);
    if (mockForLoadIndex < 0) {
      return;
    }

    const mockForLoad = mocks[mockForLoadIndex];

    loaded.push(mockForLoad);
    mocks.splice(mockForLoadIndex, 1);

    this.forceUpdate();
  }

  unload(id) {
    const { mocks, loaded } = this.state;
    const mockForUnLoadIndex = loaded.findIndex(mock => mock.id === id);
    if (mockForUnLoadIndex < 0) {
      return;
    }

    const mockForLoad = loaded[mockForUnLoadIndex];

    mocks.push(mockForLoad);
    loaded.splice(mockForUnLoadIndex, 1);

    this.forceUpdate();
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
        <div className="dashboard-columns">
          <div>
            <h2>Mocks:</h2>
            <MockList mocks={this.state.mocks} action={this.load} buttonText="Load" />
          </div>
          <div>
            <h2>Loaded:</h2>
            <MockList mocks={this.state.loaded} action={this.unload} buttonText="Unload" />
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
