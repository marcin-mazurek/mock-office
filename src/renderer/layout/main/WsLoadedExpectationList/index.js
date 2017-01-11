import { connect } from 'react-redux';
import React from 'react';
import { List, ListItem, Card } from 'react-mdl';
import { getSelectedServerLoadedExpectations } from '../../../expectations/selectors';
import { init } from '../../../expectations/unloadExpectation/actions';
import { getSelected } from '../../../servers/selectors';
import UnloadButton from '../../../expectations/unloadExpectation/UnloadButton';

const WsLoadedExpectationList = ({ expectations, serverId }) => (
  <List>
    {
      expectations.map(({ instanceId, expectation, quantity }) => (
        <ListItem key={instanceId}>
          <Card shadow={0}>
            <div className="expectation">
              <div className="expectation-details">
                <div className="expectation-details__row">
                  How many times: { quantity }
                </div>
                <div className="expectation-details__row">
                  Incoming message: {expectation.getIn(['incomingMessage'])}</div>
                <div className="expectation-details__row">
                  Response message: {expectation.getIn(['responseMessage'])}</div>
              </div>
              <div className="expectation__button">
                <UnloadButton serverId={serverId} instanceId={instanceId} />
              </div>
            </div>
          </Card>
        </ListItem>
      ))
    }
  </List>
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
