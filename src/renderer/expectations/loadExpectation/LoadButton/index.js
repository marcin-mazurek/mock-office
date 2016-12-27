import React from 'react';
import { connect } from 'react-redux';
import { init } from '../actions';

const LoadButton = ({ unload, serverId, instanceId }) => (
  <button onClick={() => unload(serverId, instanceId)}>{'Load'}</button>
);

LoadButton.propTypes = {
  unload: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired,
  instanceId: React.PropTypes.string.isRequired
};

const mapDispatchToProps = {
  unload: init
};

export default connect(null, mapDispatchToProps)(LoadButton);
