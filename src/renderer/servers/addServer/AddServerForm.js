import React from 'react';
import { connect } from 'react-redux';
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
            <label htmlFor="server-name">
              Name: {' '}
              <input
                name="server-name"
                type="text"
                onChange={this.handleNameChange}
                value={this.state.name}
              />
            </label>
          </div>
          <div className="add-server-form__field">
            <label htmlFor="server-port">
              Port: {' '}
              <input
                name="server-port"
                type="text"
                onChange={this.handleNameChange}
                value={this.state.name}
              />
            </label>
          </div>
          <div className="add-server-form__field">
            <label
              className=""
              htmlFor="server-type"
            >
              Type: {' '}
            </label>
            <select
              name="server-type"
              value={this.state.type}
              onChange={this.handleTypeChange}
            >
              <option value="http">http</option>
              <option value="ws">ws</option>
            </select>
          </div>
          <div className="add-server-form__field">
            <label htmlFor="server-secure">
              Secure: {' '}
            </label>
            <select
              name="server-secure"
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
                      htmlFor="server-key"
                    >
                      Key: {' '}
                    </label>
                    <input
                      type="file"
                      onChange={this.handleKeyChange}
                      name="server-key"
                    />
                  </div>
                  <div className="add-server-form__field">
                    <label
                      className=""
                      htmlFor="server-cert"
                    >
                      Certificate: {' '}
                    </label>
                    <input
                      type="file"
                      onChange={this.handleCertChange}
                      name="server-cert"
                    />
                  </div>
                </div>
              )
              : null
          }
          <button
            className="button add-server-form__submit-button"
            onClick={this.submit}
          >
            Create
          </button>
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
