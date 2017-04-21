import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { getSelected, getServerList } from '../entities/servers/selectors';
import { select as dispatchSelect } from '../entities/servers/actions';
import { init as createInitExportAction } from '../exportState/actions';
import plusIcon from '../assets/icons_white_add.svg';
import lockIcon from '../assets/icons_general_locked@3x.svg';

export const SideBarServers = ({ servers, select, goToServerPage, selected, initExport }) => (
  <div className="sidebar-servers">
    <div className="sidebar-servers__header">
      <div>
        <div>Servers</div>
        <button
          className="sidebar-servers__header-export-button"
          onClick={initExport}
        >
          Export
        </button>
      </div>
      <Link className="sidebar-servers__add-server-button" to="/add-server">
        <img src={plusIcon} role="presentation" />
      </Link>
    </div>
    <ul className="sidebar-servers-list">
      {
        servers.map((server) => {
          const serverIndicatorClassNames = classnames(
            'sidebar-server__status-indicator',
            { 'sidebar-server__status-indicator--up': server.running }
          );
          const serverListItemClassNames = classnames({
            'sidebar-servers-list-item': true,
            'sidebar-servers-list-item--selected': server.id === selected
          });

          const serverType = server.type.toUpperCase();

          return (
            <li className={serverListItemClassNames} key={server.id}>
              <div className="sidebar-server__secure-indicator">
                {
                  server.secure
                    ? <img src={lockIcon} role="presentation" />
                    : null
                }
              </div>
              <span className={serverIndicatorClassNames}>
                {serverType}
              </span>
              <button
                className="sidebar-server-list__label"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  select(server.id);
                  goToServerPage();
                }}
              >
                {server.name}
              </button>
            </li>
          );
        })
      }
    </ul>
  </div>
);

SideBarServers.propTypes = {
  servers: PropTypes.shape().isRequired,
  select: PropTypes.func.isRequired,
  goToServerPage: PropTypes.func.isRequired,
  selected: PropTypes.string,
  initExport: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  servers: getServerList(state),
  selected: getSelected(state)
});

const mapDispatchToProps = {
  select: id => dispatchSelect(id),
  goToServerPage: () => push('/'),
  initExport: createInitExportAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBarServers);
