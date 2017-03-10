import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import classnames from 'classnames';
import { getServerList, getSelected } from '../servers/selectors';
import { select as dispatchSelect } from '../servers/actions';

export const SideBarServers = ({ servers, select, goToServerPage, selected }) => (
  <div className="navbar-servers">
    <div className="navbar-servers-header">
      Servers: {' '}
      <Link className="button navbar-servers__add-server-button" to="/add-server">
        +
      </Link>
    </div>
    <ul className="navbar-servers-list">
      {
        servers.map((server) => {
          const serverIndicatorClassNames = classnames(
            'navbar-server__running-indicator',
            { 'navbar-server__running-indicator--running': server.running }
          );
          const serverListItemClassNames = classnames({
            'navbar-servers-list-item': true,
            'navbar-servers-list-item--selected': server.id === selected
          });

          return (
            <li className={serverListItemClassNames} key={server.id}>
              <span className={serverIndicatorClassNames} />
              <a
                className="navbar-server-list__link"
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