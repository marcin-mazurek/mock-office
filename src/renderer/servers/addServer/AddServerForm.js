import React from 'react';
import { connect } from 'react-redux';
import { Textfield, Button } from 'react-mdl';
import init from './actions';

export class AddServerForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSecureChange = this.handleSecureChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleCertChange = this.handleCertChange.bind(this);

    this.state = {
      name: 'Server name',
      port: 3000,
      type: 'http',
      isSecure: 'no',
      keyPath: '',
      cartPath: ''
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

  handleSecureChange(e) {
    this.setState({
      isSecure: e.currentTarget.value
    });
  }

  handleKeyChange(e) {
    this.setState({
      keyPath: e.currentTarget.files[0].path
    });
  }

  handleCertChange(e) {
    this.setState({
      cartPath: e.currentTarget.files[0].path
    });
  }

  submit(event) {
    event.preventDefault();
    this.props.add(
      this.state.name,
      this.state.port,
      this.state.type,
      this.state.isSecure === 'yes',
      this.state.keyPath,
      this.state.cartPath
    );
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
          <div className="add-server-form__field">
            <label htmlFor="secure">
              Secure: {' '}
            </label>
            <select
              name="secure"
              id="secure"
              value={this.state.isSecure}
              onChange={this.handleSecureChange}
            >
              <option value="yes">yes</option>
              <option value="no">no</option>
            </select>
          </div>
          {
            this.state.isSecure === 'yes'
              ? (
                <div>
                  <div className="add-server-form__field">
                    <label
                      className=""
                      htmlFor="type"
                    >
                      Key: {' '}
                    </label>
                    <input type="file" onChange={this.handleKeyChange} />
                  </div>
                  <div className="add-server-form__field">
                    <label
                      className=""
                      htmlFor="type"
                    >
                      Certificate: {' '}
                    </label>
                    <input type="file" onChange={this.handleCertChange} />
                  </div>
                </div>
              )
              : null
          }
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
