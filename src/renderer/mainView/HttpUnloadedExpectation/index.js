import React from 'react';
import LoadButton from '../../expectations/loadExpectation/LoadButton';

export default class HttpUnloadedExpectation extends React.PureComponent {
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
      <div>
        <div>Request url: {expectation.getIn(['request', 'url'])}</div>
        <div>Response body: {JSON.stringify(expectation.getIn(['response', 'body']))}</div>
        <div>
          How many times should be used:
          <input
            type="number"
            value={quantity}
            onChange={this.handleCounterChange}
            disabled={infinite}
          />
        </div>
        <div>
          Infinite:
          <input type="checkbox" checked={infinite} onChange={this.handleInfiniteChange} />
        </div>
        <LoadButton
          serverId={serverId}
          instanceId={expectation.get('id')}
          quantity={quantity}
          infinite={infinite}
        />
      </div>
    );
  }
}

HttpUnloadedExpectation.propTypes = {
  expectation: React.PropTypes.shape().isRequired,
  serverId: React.PropTypes.string.isRequired
};
