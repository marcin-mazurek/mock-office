import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { init as initAddTask } from '../../add/actions';
import { getSelected } from '../../../servers/selectors';

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleBlockingChange = this.handleBlockingChange.bind(this);
    this.handleRequirementsChange = this.handleRequirementsChange.bind(this);
    this.handlePayloadChange = this.handlePayloadChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
  }

  handleIntervalChange(event) {
    this.setState({
      interval: event.target.value
    });
  }

  handleBlockingChange(event) {
    this.setState({
      blocking: event.target.value
    });
  }

  handleRequirementsChange(event) {
    this.setState({
      requirements: event.target.value
    });
  }

  handlePayloadChange(event) {
    this.setState({
      payload: event.target.value
    });
  }

  handleDelayChange(event) {
    this.setState({
      delay: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.initAddTask(this.props.serverId, this.state);
  }

  render() {
    return (
      <div>
        <Link to="/server">Server details</Link>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <div>
              <label htmlFor="interval">Interval:</label>
              <input type="number" name="interval" onChange={this.handleIntervalChange} />
            </div>
            <div>
              <label htmlFor="blocking">Blocking:</label>
              <input type="checkbox" name="blocking" onChange={this.handleBlockingChange} />
            </div>
            <div>
              <label htmlFor="delay">Delay:</label>
              <input type="number" name="delay" onChange={this.handleDelayChange} />
            </div>
            <div>
              <label htmlFor="requirements">Requirements:</label>
              <textarea
                name="requirements"
                cols="30"
                rows="10"
                onChange={this.handleRequirementsChange}
              />
            </div>
            <div>
              <label htmlFor="payload">Payload:</label>
              <textarea name="payload" cols="30" rows="10" onChange={this.handlePayloadChange} />
            </div>
            <div>
              <button type="submit">
                Submit
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

AddTaskForm.propTypes = {
  initAddTask: React.PropTypes.func.isRequired,
  serverId: React.PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  serverId: getSelected(state)
});

const mapDispatchToProps = {
  initAddTask
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTaskForm);
