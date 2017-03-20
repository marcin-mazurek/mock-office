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
      <div className="inspect-server__header inspect-server-header">
        <div className="inspect-server-header__toggle">
          { running ? <StopButtonConnect /> : <StartButtonConnect /> }
        </div>
        <div className="inspect-server-details">
          <div className="inspect-server-details__name">{name}</div>
          <div className="inspect-server-details__spec inspect-server-spec">
            <div className="inspect-server-spec__item">
              <span className="inspect-server-spec__label">Port:</span>
              <span className="inspect-server-spec__value">{port}</span>
            </div>
            <div className="inspect-server-spec__item">
              <span className="inspect-server-spec__label">Type:</span>
              <span className="inspect-server-spec__value">{type}</span>
            </div>
          </div>
        </div>
      </div>
      <main className="inspect-server-main inspect-server__main">
        <ul className="inspect-server-main-buttons">
          <li className="inspect-server-main-buttons__item">
            <Link
              to="/add-task"
              className="inspect-server__add-task-button button"
            >
              <i className="fa fa-plus" /> Add task
            </Link>
          </li>
          <li className="inspect-server-main-buttons__item">
            <FilePickerConnect serverId={id} />
          </li>
        </ul>
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
