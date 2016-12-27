import { connect } from 'react-redux';
import React from 'react';
import { getSelectedServerLoadedExpectations } from '../../expectations/selectors';
import { requestUnload } from '../../expectations/actions';
import { getSelected } from '../../servers/selectors';
import UnloadButton from '../../expectations/unloadExpectation/UnloadButton';

const LoadedExpectationList = ({ expectations, serverId }) => (
  <ul>
    {
      expectations.map(({ instanceId, expectation }) => (
        <li key={instanceId}>
          <div>Request url: {expectation.getIn(['request', 'url'])}</div>
          <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
          <UnloadButton serverId={serverId} instanceId={instanceId} />
        </li>
      ))
    }
  </ul>
);

LoadedExpectationList.propTypes = {
  expectations: React.PropTypes.shape(),
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  expectations: getSelectedServerLoadedExpectations(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  unload: requestUnload
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadedExpectationList);
