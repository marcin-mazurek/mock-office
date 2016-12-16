import React from 'react';
import { connect } from 'react-redux';
import { getAll, getSelected } from '../../servers/selectors';
import { select as dispatchSelect } from '../../servers/actions';

const ServerList = ({ servers, select, idOfSelected }) => (
  <ul>
    {
      servers.map(server => (
        <li key={server.id} className={idOfSelected === server.id ? 'server-list__item--selected' : ''}>
          <a href="" onClick={e => select(e, server.id)}>
            {server.name}
          </a>
        </li>
      ))
    }
  </ul>
);

ServerList.propTypes = {
  servers: React.PropTypes.shape().isRequired,
  select: React.PropTypes.func.isRequired,
  idOfSelected: React.PropTypes.string
};

const mapStateToProps = state => ({
  servers: getAll(state),
  idOfSelected: getSelected(state)
});
const mapDispatchToProps = {
  select: (e, id) => {
    e.preventDefault();
    return dispatchSelect(id);
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerList);
