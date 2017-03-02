import React from 'react';
import { connect } from 'react-redux';
import { init as initAddTask } from './actions';
import { getSelectedServerDetails } from '../../servers/selectors';

export class HttpForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlockingChange = this.handleBlockingChange.bind(this);
    this.handleRequirementsChange = this.handleRequirementsChange.bind(this);
    this.handlePayloadChange = this.handlePayloadChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.state = {};
  }

  handleBlockingChange(event) {
    this.setState({
      blocking: event.target.checked
    });
  }

  handleRequirementsChange(event) {
    this.setState({
      requirements: event.target.value
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
    const delay = parseInt(this.state.delay, 10);
    let requirements;

    try {
      if (this.state.requirements) {
        requirements = JSON.parse(this.state.requirements);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    let taskPayload;

    try {
      taskPayload = JSON.parse(this.state.taskPayload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }

    this.props.initAddTask(this.props.queueId, {
      blocking: this.state.blocking,
      delay,
      requirements,
      taskPayload
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
      </form>
    );
  }
}

HttpForm.propTypes = {
  initAddTask: React.PropTypes.func.isRequired,
  queueId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  queueId: getSelectedServerDetails(state).queue
});

const mapDispatchToProps = {
  initAddTask
};

export default connect(mapStateToProps, mapDispatchToProps)(HttpForm);
