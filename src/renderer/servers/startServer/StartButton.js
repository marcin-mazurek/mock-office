import React from 'react';
import { connect } from 'react-redux';
import init from './actions';
import { getSelected } from '../selectors';

export const StartButton = ({ serverId, start }) =>
  <button
    className="server-start-button button"
    onClick={() => {
      start(serverId);
    }}
  >
    <i className="fa fa-power-off" />
  </button>;

StartButton.propTypes = {
  serverId: React.PropTypes.string.isRequired,
  start: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  start: init
};

export default connect(mapStateToProps, mapDispatchToProps)(StartButton);
