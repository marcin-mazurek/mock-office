import React from 'react';
import { connect } from 'react-redux';
import { Chip } from 'react-mdl';
import FilePicker from '../../../expectations/addFromFile/FilePicker';
import ScriptPicker from '../../../serverScripts/addFromFile/FilePicker';
import HttpLoadedExpectationList from '../../../layout/main/HttpLoadedExpectationList';
import HttpUnloadedExpectationList from '../../../layout/main/HttpUnloadedExpectationList';
import WsLoadedExpectationList from '../../../layout/main/WsLoadedExpectationList';
import WsUnloadedExpectationList from '../../../layout/main/WsUnloadedExpectationList';
import { isRunning, getSelectedServerDetails } from '../../../servers/selectors';
import StartButton from '../../../servers/startServer/StartButton';
import StopButton from '../../../servers/stopServer/StopButton';

const ServerPanel = ({ running, serverDetails }) => {
  const { type, name, port } = serverDetails;

  return (
    <div className="server-panel">
      <header className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">
            {name}
          </span>
        </div>
      </header>
      <div className="server-panel-details server__details">
        <div className="server-panel-details__row">
          <div className="server-panel-details__cell">
            <Chip>
              Port: {port}
            </Chip>
          </div>
          <div className="server-panel-details__cell">
            <Chip>
              Type: {type}
            </Chip>
          </div>
        </div>
        <div className="server-panel-details__row">
          <div className="server-panel-details__cell">
            { running ? <StopButton /> : <StartButton /> }
          </div>
          <div className="server-panel-details__cell">
            <ScriptPicker />
            <FilePicker />
          </div>
        </div>
      </div>
      <div className="server-panel__expectations server-panel-expectations">
        <div className="server-panel-expectations-type server-panel-expectations__type">
          <span>Not loaded:</span>
          <div className="server-panel-expectations-type__list">
            { type === 'http' ? <HttpUnloadedExpectationList /> : null }
            { type === 'ws' ? <WsUnloadedExpectationList /> : null }
          </div>
        </div>
        <div className="server-panel-expectations-type server-panel-expectations__type">
          <span>Loaded:</span>
          <div className="server-panel-expectations-type__list">
            { type === 'http' ? <HttpLoadedExpectationList /> : null }
            { type === 'ws' ? <WsLoadedExpectationList /> : null }
          </div>
        </div>
      </div>
    </div>
  );
};

ServerPanel.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    port: React.PropTypes.number.isRequired
  })
};

const mapStateToProps = state => ({
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

export default connect(mapStateToProps)(ServerPanel);
