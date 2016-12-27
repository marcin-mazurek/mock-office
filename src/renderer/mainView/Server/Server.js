import React from 'react';
import { connect } from 'react-redux';
import FilePicker from '../../expectations/addFromFile/FilePicker';
import LoadedExpectationList from '../LoadedExpectationList';
import UnloadedExpectationList from '../UnloadedExpectationList';
import { isRunning } from '../../servers/selectors';
import StartButton from '../../servers/startServer/StartButton';
import StopButton from '../../servers/stopServer/StopButton';

const Server = ({ running }) => (
  <div className="server">
    <FilePicker />
    <h2>Not loaded:</h2>
    <UnloadedExpectationList />
    <h2>Loaded:</h2>
    <LoadedExpectationList />
    { running ? <StopButton /> : <StartButton /> }
  </div>
);

const mapStateToProps = state => ({
  running: isRunning(state)
});

Server.propTypes = {
  running: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Server);
