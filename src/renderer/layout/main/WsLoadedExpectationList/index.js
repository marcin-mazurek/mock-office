import { connect } from 'react-redux';
import React from 'react';
import { getSelectedServerLoadedExpectations } from '../../../expectations/selectors';
import { init } from '../../../expectations/unloadExpectation/actions';
import { getSelected } from '../../../servers/selectors';
import UnloadButton from '../../../expectations/unloadExpectation/UnloadButton';

const WsLoadedExpectationList = ({ expectations, serverId }) => (
  <ul>
    {
      expectations.map(({ instanceId, expectation, quantity }) => (
        <li key={instanceId}>
          <div>How many times: { quantity }</div>
          <div>Incoming message: {expectation.getIn(['incomingMessage'])}</div>
          <div>Response message: {expectation.getIn(['responseMessage'])}</div>
          <UnloadButton serverId={serverId} instanceId={instanceId} />
        </li>
      ))
    }
  </ul>
);

WsLoadedExpectationList.propTypes = {
  expectations: React.PropTypes.shape(),
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  expectations: getSelectedServerLoadedExpectations(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  unload: init
};

export default connect(mapStateToProps, mapDispatchToProps)(WsLoadedExpectationList);
