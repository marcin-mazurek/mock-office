import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-mdl';
import ConfigTab from './ConfigTab';
import ScriptTab from './ScriptTab';
import StartButtonConnect from '../startServer/StartButton';
import StopButtonConnect from '../stopServer/StopButton';
import { isRunning, getSelectedServerDetails } from '../selectors';

export class Server extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0
    };
  }

  render() {
    const { running, serverDetails } = this.props;
    const { name } = serverDetails;
    const { activeTab } = this.state;

    return (
      <div className="server-page">
        <div className="server-panel">
          <header className="server-panel__header mdl-layout__header">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">
                { running ? <StopButtonConnect /> : <StartButtonConnect /> } {name}
              </span>
            </div>
          </header>
          <main className="server-panel-main server-panel__main">
            <div className="server-panel__tabs">
              <Tabs
                activeTab={this.state.activeTab}
                onChange={tabId => this.setState({ activeTab: tabId })}
                ripple
              >
                <Tab>Config mode</Tab>
                <Tab>Script mode</Tab>
              </Tabs>
            </div>
            <div className="server-panel__tab">
              { activeTab === 0 ? <ConfigTab {...{ running, serverDetails }} /> : null }
              { activeTab === 1 ? <ScriptTab {...{ running, serverDetails }} /> : null }
            </div>
          </main>
        </div>
      </div>
    );
  }
}

Server.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({})
};

const mapStateToProps = state => ({
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

export default connect(mapStateToProps)(Server);
