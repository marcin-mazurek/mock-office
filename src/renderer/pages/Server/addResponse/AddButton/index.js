import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import { init } from '../actions';

const AddButton = ({ add, serverId, instanceId, quantity, infinite }) => (
  <Button
    raised
    ripple
    onClick={() => add(serverId, instanceId, quantity, infinite)}
  >
    Load
  </Button>
);

AddButton.propTypes = {
  add: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired,
  instanceId: React.PropTypes.string.isRequired,
  quantity: React.PropTypes.number.isRequired,
  infinite: React.PropTypes.bool.isRequired
};

const mapDispatchToProps = {
  add: init
};

export default connect(null, mapDispatchToProps)(AddButton);
