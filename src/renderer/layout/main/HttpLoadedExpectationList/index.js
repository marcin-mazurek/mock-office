import { connect } from 'react-redux';
import React from 'react';
import { getSelectedServerLoadedExpectations } from '../../expectations/selectors';
import { init } from '../../expectations/unloadExpectation/actions';
import { getSelected } from '../../servers/selectors';
import UnloadButton from '../../expectations/unloadExpectation/UnloadButton';

const HttpLoadedExpectationList = ({ expectations, serverId }) => (
  <ul>
    {
      expectations.map(({ instanceId, expectation, quantity }) => (
        <li key={instanceId}>
          <div>How many times: { quantity }</div>
          <div>Request url: {expectation.getIn(['request', 'url'])}</div>
          <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
          <UnloadButton serverId={serverId} instanceId={instanceId} />
        </li>
      ))
    }
  </ul>
);

HttpLoadedExpectationList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HttpLoadedExpectationList);
