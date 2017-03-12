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
    <div className="server-inspect">
      <header className="server-inspect__header">
        {name}
      </header>
      <main className="server-inspect-main server-inspect__main">
        <div className="server-inspect-details">
          <div className="server-inspect-details__row">
            { running ? <StopButtonConnect /> : <StartButtonConnect /> }
          </div>
          <div className="server-inspect-details__row">
            <div className="server-inspect-details__cell">
              Port: {port}
            </div>
            <div className="server-inspect-details__cell">
              Type: {type}
            </div>
          </div>
          <div className="server-inspect-details__row">
            <div className="server-inspect-details__cell">
              <Link to="/add-task">Add task</Link>
            </div>
          </div>
          <div className="server-inspect-details__row">
            <div className="server-inspect-details__cell">
              Add from file: <FilePickerConnect serverId={id} />
            </div>
          </div>
        </div>
        <div className="server-inspect-queue">
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
