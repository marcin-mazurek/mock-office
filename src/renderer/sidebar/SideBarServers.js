import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { getServerList, getSelected } from '../servers/selectors';
import { select as dispatchSelect } from '../servers/actions';

export const SideBarServers = ({ servers, select, goToServerPage, selected }) => (
  <div className="sidebar-servers">
    <div className="sidebar-servers__header view-header">
      <i className="fa fa-server sidebar-servers-header__icon" /> Servers:
      <Link className="sidebar-servers__add-server-button" to="/add-server">
        <i className="fa fa-plus-circle" />
      </Link>
    </div>
    <ul className="sidebar-servers-list">
      {
        servers.map((server) => {
          const serverIndicatorClassNames = classnames(
            'fa fa-power-off',
            'sidebar-server__status-indicator',
            { 'sidebar-server__status-indicator--up': server.running }
          );
          const serverListItemClassNames = classnames({
            'sidebar-servers-list-item': true,
            'sidebar-servers-list-item--selected': server.id === selected
          });

          return (
            <li className={serverListItemClassNames} key={server.id}>
              <i className={serverIndicatorClassNames} />
              <a
                className="sidebar-server-list__link"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  select(server.id);
                  goToServerPage();
                }}
              >
                {server.name}
              </a>
            </li>
          );
        })
      }
    </ul>
  </div>
);

SideBarServers.propTypes = {
  servers: React.PropTypes.shape().isRequired,
  select: React.PropTypes.func.isRequired,
  goToServerPage: React.PropTypes.func.isRequired,
  selected: React.PropTypes.string
};

const mapStateToProps = state => ({
  servers: getServerList(state),
  selected: getSelected(state)
});

const mapDispatchToProps = {
  select: id => dispatchSelect(id),
  goToServerPage: () => push('/')
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBarServers);
