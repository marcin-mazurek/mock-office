import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import createStartAction from '../startServer/actions';
import createStopAction from '../stopServer/actions';
import { isRunning, getSelectedServerDetails, getSelected, getAll } from '../selectors';
import FilePickerConnect from '../../tasks/addTaskFromFile/FilePicker';
import TasksConnect from '../../tasks/browseTasks/Tasks';
import { init as createRemoveServerAction } from '../removeServer/actions';

export const ServerPlaceholder = ({ serverExists }) =>
  <div className="server-placeholder">
    {serverExists ? 'Select server' : 'Add server'}
  </div>;

ServerPlaceholder.propTypes = {
  serverExists: React.PropTypes.bool.isRequired
};

const serverPlaceholderMapStateToProps = state => ({
  serverExists: !getAll(state).isEmpty()
});

const ServerToggle = ({ toggled, serverId, stop, start }) => {
  const classNames = classnames({
    button: true,
    'inspect-server-header-toggle': true,
    'inspect-server-header-toggle--up': toggled
  });

  let handleClick;

  if (toggled) {
    handleClick = () => {
      stop(serverId);
    };
  } else {
    handleClick = () => {
      start(serverId);
    };
  }

  return (
    <button
      className={classNames}
      onClick={handleClick}
    >
      <i className="fa fa-power-off" />
    </button>
  );
};

ServerToggle.propTypes = {
  toggled: React.PropTypes.bool.isRequired,
  serverId: React.PropTypes.string.isRequired,
  stop: React.PropTypes.func.isRequired,
  start: React.PropTypes.func.isRequired
};

const serverToggleMapDispatchToProps = {
  start: createStartAction,
  stop: createStopAction
};

const ServerToggleConnect = connect(null, serverToggleMapDispatchToProps)(ServerToggle);

const ServerPlaceholderConnect = connect(serverPlaceholderMapStateToProps)(ServerPlaceholder);

export const ServerInspect = ({ running, serverDetails, removeServer }) => {
  const { name, port, type, id } = serverDetails;

  return (
    <div className="inspect-server">
      <div className="inspect-server__header inspect-server-header">
        <div className="inspect-server-header__toggle">
          <ServerToggleConnect toggled={running} serverId={id} />
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
        <button
          className="inspect-server__remove-button button"
          onClick={() => (
            confirm(`Do you want to stop & remove '${name}' from the list of available servers?`)
              ? removeServer(id)
              : false
            )
          }
        >
          <i className="fa fa-trash" />
        </button>
      </div>
      <main className="inspect-server-main inspect-server__main">
        <div className="inspect-server-tasks-header">
          <div className="inspect-server-tasks-header__label">
            <i className="fa fa-tasks" />{' Tasks:'}
          </div>
          <Link
            to="/add-task"
            className="inspect-server__add-task-button button inspect-server-tasks-header__button"
          >
            <i className="fa fa-plus" />
          </Link>
          <FilePickerConnect serverId={id} />
        </div>
        <div className="inspect-server__tasks">
          <div className="inspect-server__tasks-scroll-container">
            <Scrollbars>
              <TasksConnect serverId={id} />
            </Scrollbars>
          </div>
        </div>
      </main>
    </div>
  );
};

ServerInspect.propTypes = {
  running: React.PropTypes.bool.isRequired,
  serverDetails: React.PropTypes.shape({}),
  removeServer: React.PropTypes.func.isRequired
};

const serverInspectMapDispatchToProps = {
  removeServer: createRemoveServerAction
};

export const ServerInspectConnect = connect(null, serverInspectMapDispatchToProps)(ServerInspect);

export const Server = ({ selected, running, serverDetails }) => (
  selected
    ? <ServerInspectConnect running={running} serverDetails={serverDetails} />
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
