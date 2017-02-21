import React from 'react';
import { connect } from 'react-redux';
import { init as initAddTask } from './actions';
import { getSelected } from '../../servers/selectors';

class WsForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleBlockingChange = this.handleBlockingChange.bind(this);
    this.handleRequirementsChange = this.handleRequirementsChange.bind(this);
    this.handlePayloadChange = this.handlePayloadChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.state = {};
  }

  handleIntervalChange(event) {
    this.setState({
      interval: parseInt(event.target.value, 10)
    });
  }

  handleBlockingChange(event) {
    this.setState({
      blocking: event.target.checked
    });
  }

  handleRequirementsChange(event) {
    let requirements;

    try {
      requirements = JSON.parse(event.target.value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    this.setState({
      requirements
    });
  }

  handlePayloadChange(event) {
    this.setState({
      taskPayload: event.target.value
    });
  }

  handleDelayChange(event) {
    this.setState({
      delay: parseInt(event.target.value, 10)
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.initAddTask(this.props.serverId, this.state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <div>
            <label htmlFor="interval">Interval:</label>
            <input type="number" name="interval" onChange={this.handleIntervalChange} />
          </div>
          <div>
            <label htmlFor="blocking">Blocking:</label>
            <input
              type="checkbox"
              name="blocking"
              onChange={this.handleBlockingChange}
              value={this.state.blocking}
            />
          </div>
          <div>
            <label htmlFor="delay">Delay:</label>
            <input type="number" name="delay" onChange={this.handleDelayChange} />
          </div>
          <div>
            <label htmlFor="requirements">Requirements:</label>
            <div>
              <textarea
                name="requirements"
                cols="30"
                rows="10"
                onChange={this.handleRequirementsChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="payload">Payload:</label>
            <div>
              <textarea name="payload" cols="30" rows="10" onChange={this.handlePayloadChange} />
            </div>
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </fieldset>
      </form>
    );
  }
}

WsForm.propTypes = {
  initAddTask: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  initAddTask
};

export default connect(mapStateToProps, mapDispatchToProps)(WsForm);
