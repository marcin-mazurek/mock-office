import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import { init } from '../actions';

const UnloadButton = ({ unload, serverId, instanceId }) => (
  <Button
    raised
    ripple
    onClick={() => unload(serverId, instanceId)}
  >
    {'Unload'}
  </Button>
);

UnloadButton.propTypes = {
  unload: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired,
  instanceId: React.PropTypes.string.isRequired
};

const mapDispatchToProps = {
  unload: init
};

export default connect(null, mapDispatchToProps)(UnloadButton);
