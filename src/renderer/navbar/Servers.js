import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getServerList } from '../servers/selectors';
import { select as dispatchSelect } from '../servers/actions';

export const Servers = ({ servers, select, goToServerPage }) => (
  <ul className="servers-list">
    {
      servers.map(server => (
        <li className="servers-list__item" key={server.id}>
          <a
            className="server-list__link"
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
);

Servers.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Servers);
