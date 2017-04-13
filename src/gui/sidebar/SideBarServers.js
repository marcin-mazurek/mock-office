import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { getSelected, getServerList } from '../entities/servers/selectors';
import { select as dispatchSelect } from '../entities/servers/actions';
import { init as createInitExportAction } from '../exportState/actions';

export const SideBarServers = ({ servers, select, goToServerPage, selected, initExport }) => (
  <div className="sidebar-servers">
    <div className="sidebar-servers__header">
      <i className="fa fa-server sidebar-servers-header__icon" />{' Servers'}
      <Link className="sidebar-servers__add-server-button" to="/add-server">
        <i className="fa fa-plus" />
      </Link>
    </div>
    <ul className="sidebar-servers-list">
      {
        servers.map((server) => {
          const serverIndicatorClassNames = classnames(
            'sidebar-server__status-indicator',
            { 'sidebar-server__status-indicator--up': server.running }
          );
          const serverTypeIndicatorClassNames = classnames(
            'fa',
            {
              'fa-globe': server.type === 'http',
              'fa-feed': server.type === 'ws'
            }
          );
          const serverSecureIndicatorClassNames = classnames(
            'fa',
            'sidebar-server__secure-indicator',
            {
              'fa-lock': server.secure,
              'fa-unlock': !server.secure
            }
          );
          const serverListItemClassNames = classnames({
            'sidebar-servers-list-item': true,
            'sidebar-servers-list-item--selected': server.id === selected
          });

          return (
            <li className={serverListItemClassNames} key={server.id}>
              <span className={serverIndicatorClassNames}>
                <i className={serverTypeIndicatorClassNames} title={server.type} />
                <i className={serverSecureIndicatorClassNames} title={server.secure ? 'Enabled SSL' : 'Without SSL'} />
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
    <button onClick={initExport}>saveState</button>
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
