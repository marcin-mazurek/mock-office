import React from 'react';
import { connect } from 'react-redux';
import { getSelectedServerExpectations } from '../../expectations/selectors';
import { getSelected } from '../../servers/selectors';
import { requestLoad } from '../../expectations/actions';
import WsUnloadedExpectation from '../WsUnloadedExpectation';

const WsUnloadedExpectationList = ({ expectations, serverId }) => (
  <ul>
    {
      expectations
        ? (
        expectations.map(expectation => (
          <li key={expectation.get('id')}>
            <WsUnloadedExpectation expectation={expectation} serverId={serverId} />
          </li>
        ))
      ) : null
    }
  </ul>
);

WsUnloadedExpectationList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(WsUnloadedExpectationList);
