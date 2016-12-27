import React from 'react';
import LoadButton from '../../expectations/loadExpectation/LoadButton';

export default class UnloadedExpectation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleCounterChange = this.handleCounterChange.bind(this);

    this.state = {
      quantity: 1
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

  render() {
    const { expectation, serverId } = this.props;
    const { quantity } = this.state;

    return (
      <div>
        <div>Request url: {expectation.getIn(['request', 'url'])}</div>
        <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
        <div>
          How many times should be used:
          <input type="number" value={quantity} onChange={this.handleCounterChange} />
        </div>
        <LoadButton serverId={serverId} instanceId={expectation.get('id')} quantity={quantity} />
      </div>
    );
  }
}

UnloadedExpectation.propTypes = {
  expectation: React.PropTypes.shape().isRequired,
  serverId: React.PropTypes.string.isRequired
};
