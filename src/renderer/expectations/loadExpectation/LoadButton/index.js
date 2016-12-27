import React from 'react';
import { connect } from 'react-redux';
import { init } from '../actions';

const LoadButton = ({ load, serverId, instanceId }) => (
  <button onClick={() => load(serverId, instanceId)}>{'Load'}</button>
);

LoadButton.propTypes = {
  load: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired,
  instanceId: React.PropTypes.string.isRequired
};

const mapDispatchToProps = {
  load: init
};

export default connect(null, mapDispatchToProps)(LoadButton);
