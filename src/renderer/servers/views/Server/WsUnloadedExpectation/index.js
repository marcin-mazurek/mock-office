import React from 'react';
import { Card, Textfield, Switch } from 'react-mdl';
import AddButton from '../addResponse/AddButton';

export default class WsUnloadedExpectation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleCounterChange = this.handleCounterChange.bind(this);
    this.handleInfiniteChange = this.handleInfiniteChange.bind(this);

    this.state = {
      quantity: 1,
      infinite: false
    };
  }

  handleCounterChange(event) {
    const counterValue = parseInt(event.currentTarget.value, 10);

    if (counterValue >= 1) {
      this.setState({
        quantity: counterValue
      });
    }
  }

  handleInfiniteChange(event) {
    const currentInfinite = event.currentTarget.checked;

    this.setState({
      infinite: currentInfinite
    });
  }

  render() {
    const { expectation, serverId } = this.props;
    const { quantity, infinite } = this.state;

    return (
      <Card shadow={0}>
        <div className="expectation">
          <div className="expectation-details">
            <div className="expectation-details__row">
              <div>Incoming message: {expectation.getIn(['incomingMessage'])}</div>
              <div>Response message: {expectation.getIn(['responseMessage'])}</div>
            </div>
            <div className="expectation-details__row">
              <Textfield
                floatingLabel
                label="How many times should be used:"
                type="number"
                value={quantity}
                onChange={this.handleCounterChange}
                disabled={infinite}
              />
            </div>
            <div className="expectation-details__row">
              <Switch
                ripple
                id="switch1"
                checked={infinite}
                onChange={this.handleInfiniteChange}
              >
                Infinite
              </Switch>
            </div>
          </div>
          <div className="expectation__button">
            <AddButton
              serverId={serverId}
              instanceId={expectation.get('id')}
              quantity={quantity}
              infinite={infinite}
            />
          </div>
        </div>
      </Card>
    );
  }
}

WsUnloadedExpectation.propTypes = {
  expectation: React.PropTypes.shape().isRequired,
  serverId: React.PropTypes.string.isRequired
};
