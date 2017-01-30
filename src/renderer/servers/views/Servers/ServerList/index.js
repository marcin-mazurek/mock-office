import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { List, ListItem } from 'react-mdl';
import { getServerList } from '../../../selectors';
import { select as dispatchSelect } from '../../../actions';

const ServerList = ({ servers, select, goToServerPage }) => (
  <List>
    {
      servers.map(server => (
        <ListItem key={server.id}>
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
        </ListItem>
      ))
    }
  </List>
);

ServerList.propTypes = {
  servers: React.PropTypes.shape().isRequired,
  select: React.PropTypes.func.isRequired,
  goToServerPage: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  servers: getServerList(state)
});

const mapDispatchToProps = {
  select: id => dispatchSelect(id),
  goToServerPage: () => push('/server')
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerList);
