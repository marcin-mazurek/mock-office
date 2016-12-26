import React from 'react';
import { connect } from 'react-redux';
import { getSelectedServerExpectations } from '../../mocks/selectors';
import { getSelected } from '../../servers/selectors';
import { requestLoad } from '../../mocks/actions';

const UnloadedExpectationList = ({ expectations, load, serverId }) => (
  <ul>
    {
      expectations
        ? (
        expectations.map(expectation => (
          <li key={expectation.get('id')}>
            <div>Request url: {expectation.getIn(['request', 'url'])}</div>
            <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
            <button onClick={() => load(serverId, expectation.get('id'))}>{'Load'}</button>
          </li>
        ))
      ) : null
    }
  </ul>
);

UnloadedExpectationList.propTypes = {
  expectations: React.PropTypes.shape(),
  load: React.PropTypes.func,
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
