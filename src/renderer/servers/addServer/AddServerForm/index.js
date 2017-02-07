import React from 'react';
import { connect } from 'react-redux';
import { Textfield, Button } from 'react-mdl';
import init from '../actions';

class AddServerForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);

    this.state = {
      name: 'Server name',
      port: 3000,
      type: 'http'
    };
  }

  handleNameChange(e) {
    this.setState({
      name: e.currentTarget.value
    });
  }

  handleChangePort(e) {
    this.setState({
      port: parseInt(e.currentTarget.value, 10)
    });
  }

  handleTypeChange(e) {
    this.setState({
      type: e.currentTarget.value
    });
  }

  submit(event) {
    event.preventDefault();
    this.props.add(this.state.name, this.state.port, this.state.type);
  }

  render() {
    return (
      <div className="add-server-form">
        <form action="#">
          <div className="add-server-form__field">
            <Textfield
              floatingLabel
              onChange={this.handleNameChange}
              label="Name"
              value={this.state.name}
            />
          </div>
          <div className="add-server-form__field">
            <Textfield
              floatingLabel
              onChange={this.handleChangePort}
              label="Port"
              value={this.state.port}
            />
          </div>
          <div className="add-server-form__field">
            <label
              className=""
              htmlFor="type"
            >
              Type: {' '}
            </label>
            <select
              id="type"
              name="type"
              value={this.state.type}
              onChange={this.handleTypeChange}
            >
              <option value="http">http</option>
              <option value="ws">ws</option>
            </select>
          </div>
          <Button
            raised
            colored
            ripple
            onClick={this.submit}
          >
            Create
          </Button>
        </form>
      </div>
    );
  }
}

AddServerForm.propTypes = {
  add: React.PropTypes.func.isRequired
};

const mapDispatchToProps = {
  add: init
};

export default connect(null, mapDispatchToProps)(AddServerForm);
