import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import StartButtonConnect from '../startServer/StartButton';
import StopButtonConnect from '../stopServer/StopButton';
import { isRunning, getSelectedServerDetails, getSelected, getAllAsList } from '../selectors';
import FilePickerConnect from '../../tasks/addTaskFromFile/FilePicker';
import Queue from '../../queues/Queue';

export const ServerPlaceholder = ({ serverExists }) =>
  <div className="server-placeholder">
    {serverExists ? 'Select server' : 'Add server'}
  </div>;

ServerPlaceholder.propTypes = {
  serverExists: React.PropTypes.bool.isRequired
};

const serverPlaceholderMapStateToProps = state => ({
  serverExists: !getAllAsList(state).isEmpty()
});

const ServerPlaceholderConnect = connect(serverPlaceholderMapStateToProps)(ServerPlaceholder);

export const ServerInspect = ({ running, serverDetails }) => {
  const { name, port, type, id } = serverDetails;

  return (
    <div className="inspect-server">
      <div className="view-header">
        { running ? <StopButtonConnect /> : <StartButtonConnect /> }
        {name}
      </div>
      <div className="inspect-server-spec-bar">
        <div className="inspect-server-spec-bar__cell">
          Port:
          <span className="inspect-server-spec-bar__value">{port}</span>
        </div>
        <div className="inspect-server-spec-bar__cell">
          Type:
          <span className="inspect-server-spec-bar__value">{type}</span>
        </div>
      </div>
      <main className="inspect-server-main inspect-server__main">
        <div className="inspect-server-details">
          <div className="inspect-server-details__row">
            <div className="inspect-server-details__cell">
              <Link to="/add-task" className="button">
                <i className="fa fa-plus" /> Add task
              </Link>
            </div>
            <div className="inspect-server-details__cell">
              Add from file: <FilePickerConnect serverId={id} />
            </div>
          </div>
        </div>
        <div className="inspect-server-queue">
          <Queue id={id} />
        </div>
      </main>
    </div>
  );
};

ServerInspect.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({})
};

export const Server = ({ selected, running, serverDetails }) => (
  selected
    ? <ServerInspect running={running} serverDetails={serverDetails} />
    : <ServerPlaceholderConnect />
);

Server.propTypes = {
  selected: React.PropTypes.string,
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({})
};

const serverMapStateToProps = state => ({
  selected: getSelected(state),
  running: isRunning(state),
  serverDetails: getSelectedServerDetails(state)
});

export default connect(serverMapStateToProps)(Server);
