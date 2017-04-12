import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { init as initAddScene } from './actions';
import { getSelectedServerDetails } from '../../entities/servers/selectors';

export class WsForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRequirementsChange = this.handleRequirementsChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.state = {};
  }

  handleIntervalChange(event) {
    this.setState({
      interval: event.target.value
    });
  }

  handleRequirementsChange(event) {
    this.setState({
      requirements: event.target.value
    });
  }

  handleDelayChange(event) {
    this.setState({
      delay: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const delay = parseInt(this.state.dely, 10);
    const interval = parseInt(this.state.interval, 10);

    let requirements;

    try {
      if (this.state.requirements) {
        requirements = JSON.parse(this.state.requirements);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    this.props.initAddScene(this.props.queueId, {
      requirements,
      delay,
      interval
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="interval">Interval:</label>
          <input type="number" name="interval" onChange={this.handleIntervalChange} />
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
      </form>
    );
  }
}

WsForm.propTypes = {
  initAddScene: PropTypes.func.isRequired,
  queueId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  queueId: getSelectedServerDetails(state).queue
});

const mapDispatchToProps = {
  initAddScene
};

export default connect(mapStateToProps, mapDispatchToProps)(WsForm);
