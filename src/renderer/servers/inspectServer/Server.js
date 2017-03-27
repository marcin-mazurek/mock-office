import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import createStartScene from '../startServer/actions';
import createStopScene from '../stopServer/actions';
import { isRunning, getSelectedServerDetails, getSelected, getAll } from '../selectors';
import FilePickerConnect from '../../scenes/addSceneFromFile/FilePicker';
import ScenesConnect from '../../scenes/browseScenes/Scenes';

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
  start: createStartScene,
  stop: createStopScene
};

const ServerToggleConnect = connect(null, serverToggleMapDispatchToProps)(ServerToggle);

const ServerPlaceholderConnect = connect(serverPlaceholderMapStateToProps)(ServerPlaceholder);

export const ServerInspect = ({ running, serverDetails }) => {
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
      </div>
      <main className="inspect-server-main inspect-server__main">
        <div className="inspect-server-scenes-header">
          <div className="inspect-server-scenes-header__label">
            <i className="fa fa-scenes" />{' Scenes:'}
          </div>
          <Link
            to="/add-scene"
            className="inspect-server__add-scene-button button
            inspect-server-scenes-header__button"
          >
            <i className="fa fa-plus" />
          </Link>
          <FilePickerConnect serverId={id} />
        </div>
        <div className="inspect-server__scenes">
          <div className="inspect-server__scenes-scroll-container">
            <Scrollbars>
              <ScenesConnect serverId={id} />
            </Scrollbars>
          </div>
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
