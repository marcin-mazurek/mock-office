import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import { getServerList } from '../servers/selectors';
import { select as dispatchSelect } from '../servers/actions';

export const NavbarServers = ({ servers, select, goToServerPage }) => (
  <div className="navbar-servers">
    <div className="navbar-servers-header">
      Servers: {' '}
      <Link className="button navbar-servers__add-server-button" to="/add-server">
        +
      </Link>
    </div>
    <ul className="navbar-servers-list">
      {
        servers.map(server => (
          <li className="navbar-servers-list-item" key={server.id}>
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
        ))
      }
    </ul>
  </div>
);

NavbarServers.propTypes = {
  servers: React.PropTypes.shape().isRequired,
  select: React.PropTypes.func.isRequired,
  goToServerPage: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  servers: getServerList(state)
});

const mapDispatchToProps = {
  select: id => dispatchSelect(id),
  goToServerPage: () => push('/')
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarServers);
