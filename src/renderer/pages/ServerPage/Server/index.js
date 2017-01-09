import React from 'react';
import { connect } from 'react-redux';
import FilePicker from '../../../expectations/addFromFile/FilePicker';
import HttpLoadedExpectationList from '../../../mainView/HttpLoadedExpectationList';
import HttpUnloadedExpectationList from '../../../mainView/HttpUnloadedExpectationList';
import WsLoadedExpectationList from '../../../mainView/WsLoadedExpectationList';
import WsUnloadedExpectationList from '../../../mainView/WsUnloadedExpectationList';
import { isRunning, getSelectedServerDetails } from '../../../servers/selectors';
import StartButton from '../../../servers/startServer/StartButton';
import StopButton from '../../../servers/stopServer/StopButton';

const Server = ({ running, serverDetails }) => {
  const { type, name, port } = serverDetails;

  return (
    <div className="server">
      <div className="server__details">
        <div>
          Name: {name}
        </div>
        <div>
          Port: {port}
        </div>
        <div>
          Type: {type}
        </div>
        <div>
          { running ? 'ACTIVE' : 'NOT ACTIVE' }
        </div>
        <div>
          <FilePicker />
        </div>
        <div>
          { running ? <StopButton /> : <StartButton /> }
        </div>
      </div>
      <div className="server__expectations server-expectations">
        <div className="server-expectations-type server-expectations__type">
          <h2 className="server-expectations-type__header">
            Not loaded:
          </h2>
          <div className="server-expectations-type__list">
            { type === 'http' ? <HttpUnloadedExpectationList /> : null }
            { type === 'ws' ? <WsUnloadedExpectationList /> : null }
          </div>
        </div>
        <div className="server-expectations-type server-expectations__type">
          <h2 className="server-expectations-type__header">
            Loaded:
          </h2>
          <div className="server-expectations-type__list">
            { type === 'http' ? <HttpLoadedExpectationList /> : null }
            { type === 'ws' ? <WsLoadedExpectationList /> : null }
          </div>
        </div>
      </div>
    </div>
  );
};

Server.propTypes = {
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

export default connect(mapStateToProps)(Server);
