import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import { init } from '../actions';

const LoadButton = ({ load, serverId, instanceId, quantity, infinite }) => (
  <Button
    raised
    ripple
    onClick={() => load(serverId, instanceId, quantity, infinite)}
  >
    Load
  </Button>
);

LoadButton.propTypes = {
  load: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired,
  instanceId: React.PropTypes.string.isRequired,
  quantity: React.PropTypes.number.isRequired,
  infinite: React.PropTypes.bool.isRequired
};

const mapDispatchToProps = {
  load: init
};

export default connect(null, mapDispatchToProps)(LoadButton);
