import React from 'react';
import { connect } from 'react-redux';
import { Chip } from 'react-mdl';
import FilePicker from '../../../expectations/addFromFile/FilePicker';
import HttpLoadedExpectationList from '../../../layout/main/HttpLoadedExpectationList';
import HttpUnloadedExpectationList from '../../../layout/main/HttpUnloadedExpectationList';
import WsLoadedExpectationList from '../../../layout/main/WsLoadedExpectationList';
import WsUnloadedExpectationList from '../../../layout/main/WsUnloadedExpectationList';
import { isRunning, getSelectedServerDetails } from '../../../servers/selectors';
import StartButton from '../../../servers/startServer/StartButton';
import StopButton from '../../../servers/stopServer/StopButton';

const Server = ({ running, serverDetails }) => {
  const { type, name, port } = serverDetails;

  return (
    <div className="server">
      <header className="mdl-layout__header">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">
            {name}
          </span>
        </div>
      </header>
      <div className="server-details server__details">
        <div className="server-details__row">
          <div className="server-details__cell">
            <Chip>
              Port: {port}
            </Chip>
          </div>
          <div className="server-details__cell">
            <Chip>
              Type: {type}
            </Chip>
          </div>
        </div>
        <div className="server-details__row">
          <div className="server-details__cell">
            { running ? <StopButton /> : <StartButton /> }
          </div>
          <div className="server-details__cell">
            <FilePicker />
          </div>
        </div>
      </div>
      <div className="server__expectations server-expectations">
        <div className="server-expectations-type server-expectations__type">
          <span>Not loaded:</span>
          <div className="server-expectations-type__list">
            { type === 'http' ? <HttpUnloadedExpectationList /> : null }
            { type === 'ws' ? <WsUnloadedExpectationList /> : null }
          </div>
        </div>
        <div className="server-expectations-type server-expectations__type">
          <span>Loaded:</span>
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
