import React from 'react';
import { connect } from 'react-redux';
import init from './actions';
import { getSelected } from '../selectors';

export const StartButton = ({ serverId, start }) =>
  <button
    className="button"
    style={{ backgroundColor: '#02d77d', color: '#FFF' }}
    onClick={() => {
      start(serverId);
    }}
  >
    Start
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
