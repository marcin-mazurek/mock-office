import React from 'react';
import { connect } from 'react-redux';
import init from './actions';
import { getSelected } from '../selectors';

export const StopButton = ({ serverId, stop }) =>
  <button
    className="button server-stop-button"
    style={{ backgroundColor: '#AAA', color: '#FFF', padding: '5px 10px' }}
    onClick={() => {
      stop(serverId);
    }}
  >
    Stop
  </button>;

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
