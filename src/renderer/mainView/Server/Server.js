import React from 'react';
import { connect } from 'react-redux';
import FilePicker from '../../expectations/addFromFile/FilePicker';
import HttpLoadedExpectationList from '../HttpLoadedExpectationList';
import HttpUnloadedExpectationList from '../HttpUnloadedExpectationList';
import WsLoadedExpectationList from '../WsLoadedExpectationList';
import WsUnloadedExpectationList from '../WsUnloadedExpectationList';
import { isRunning, getSelectedServerType } from '../../servers/selectors';
import StartButton from '../../servers/startServer/StartButton';
import StopButton from '../../servers/stopServer/StopButton';

const Server = ({ running, selectedServerType }) => (
  <div className="server">
    <FilePicker />
    <h1>{selectedServerType}</h1>
    <h2>Not loaded:</h2>
    { selectedServerType === 'http' ? <HttpUnloadedExpectationList /> : null }
    { selectedServerType === 'ws' ? <WsUnloadedExpectationList /> : null }
    <h2>Loaded:</h2>
    { selectedServerType === 'http' ? <HttpLoadedExpectationList /> : null }
    { selectedServerType === 'ws' ? <WsLoadedExpectationList /> : null }
    { running ? <StopButton /> : <StartButton /> }
  </div>
);

const mapStateToProps = state => ({
  running: isRunning(state),
  selectedServerType: getSelectedServerType(state)
});

Server.propTypes = {
  running: React.PropTypes.bool.isRequired,
  selectedServerType: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Server);
