import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classnames from 'classnames';
import { getServerList, getSelected } from '../../../servers/selectors';
import { select as dispatchSelect } from '../../../servers/actions';

const ServerList = ({ servers, select, selectedId, goToServerPage }) => (
  <ul>
    {
      servers.map((server) => {
        const itemClassNames = classnames({
          'server-list__item': true,
          'server-list__item--selected': selectedId === server.id
        });

        return (
          <li
            key={server.id}
            className={itemClassNames}
          >
            <a
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
);

ServerList.propTypes = {
  servers: React.PropTypes.shape().isRequired,
  select: React.PropTypes.func.isRequired,
  goToServerPage: React.PropTypes.func.isRequired,
  selectedId: React.PropTypes.string
};

const mapStateToProps = state => ({
  servers: getServerList(state),
  selectedId: getSelected(state)
});

const mapDispatchToProps = {
  select: id => dispatchSelect(id),
  goToServerPage: () => push('/server')
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerList);
