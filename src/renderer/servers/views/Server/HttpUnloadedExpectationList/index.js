import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-mdl';
import { getSelectedServerExpectations } from '../../../../expectations/selectors';
import { getSelected } from '../../../selectors';
import { requestLoad } from '../../../../expectations/actions';
import HttpUnloadedExpectation from '../HttpUnloadedExpectation';

const HttpUnloadedExpectationList = ({ expectations, serverId }) => (
  <List>
    {
      expectations
        ? (
          expectations.map(expectation => (
            <ListItem key={expectation.get('id')}>
              <HttpUnloadedExpectation expectation={expectation} serverId={serverId} />
            </ListItem>
          ))
        ) : null
    }
  </List>
);

HttpUnloadedExpectationList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HttpUnloadedExpectationList);
