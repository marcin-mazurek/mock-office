import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-mdl';
import { getSelectedServerExpectations } from '../../../expectations/selectors';
import { getSelected } from '../../../servers/selectors';
import { requestLoad } from '../../../expectations/actions';
import WsUnloadedExpectation from '../WsUnloadedExpectation';

const WsUnloadedExpectationList = ({ expectations, serverId }) => (
  <List>
    {
      expectations
        ? (
        expectations.map(expectation => (
          <ListItem key={expectation.get('id')}>
            <WsUnloadedExpectation expectation={expectation} serverId={serverId} />
          </ListItem>
        ))
      ) : null
    }
  </List>
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
