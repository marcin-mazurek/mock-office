import { connect } from 'react-redux';
import React from 'react';
import { getSelectedServerLoadedExpectations } from '../../mocks/selectors';
import { requestUnload } from '../../mocks/actions';
import { getSelected } from '../../servers/selectors';

const LoadedExpectationList = ({ expectations, unload, serverId }) => (
  <ul>
    {
      expectations.map(({ instanceId, expectation }) => (
        <li key={instanceId}>
          <div>Request url: {expectation.getIn(['request', 'url'])}</div>
          <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
          <button onClick={() => unload(serverId, instanceId)}>{'Unload'}</button>
        </li>
      ))
    }
  </ul>
);

LoadedExpectationList.propTypes = {
  expectations: React.PropTypes.shape(),
  unload: React.PropTypes.func,
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
