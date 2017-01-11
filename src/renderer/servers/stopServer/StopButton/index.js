import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import init from '../actions';
import { getSelected } from '../../selectors';

const StopButton = ({ serverId, stop }) => (
  <Button
    raised
    ripple
    style={{ backgroundColor: '#ff5959', color: '#FFF' }}
    onClick={() => {
      stop(serverId);
    }}
  >
    {'Stop'}
  </Button>
);

StopButton.propTypes = {
  serverId: React.PropTypes.string.isRequired,
  stop: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  stop: init
};

export default connect(mapStateToProps, mapDispatchToProps)(StopButton);
