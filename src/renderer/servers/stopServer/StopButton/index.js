import React from 'react';
import { connect } from 'react-redux';
import init from '../actions';
import { getSelected } from '../../selectors';

const StopButton = ({ serverId, stop }) => (
  <button
    onClick={() => {
      stop(serverId);
    }}
  >
    {'Stop'}
  </button>
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
