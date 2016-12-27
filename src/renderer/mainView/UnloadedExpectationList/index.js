import React from 'react';
import { connect } from 'react-redux';
import { getSelectedServerExpectations } from '../../expectations/selectors';
import { getSelected } from '../../servers/selectors';
import { requestLoad } from '../../expectations/actions';
import LoadButton from '../../expectations/loadExpectation/LoadButton';

const UnloadedExpectationList = ({ expectations, serverId }) => (
  <ul>
    {
      expectations
        ? (
        expectations.map(expectation => (
          <li key={expectation.get('id')}>
            <div>Request url: {expectation.getIn(['request', 'url'])}</div>
            <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
            <LoadButton serverId={serverId} instanceId={expectation.get('id')} />
          </li>
        ))
      ) : null
    }
  </ul>
);

UnloadedExpectationList.propTypes = {
  expectations: React.PropTypes.shape(),
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  expectations: getSelectedServerExpectations(state),
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  load: requestLoad
};

export default connect(mapStateToProps, mapDispatchToProps)(UnloadedExpectationList);
