import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import Switch from 'rc-switch';
import init from './actions';
import plusIcon from '../../assets/icons_white_add.svg';

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
      type: {
        value: 'http'
      },
      isSecure: false,
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

  handleTypeChange(type) {
    this.setState({
      type
    });
  }

  handleSecureChange(checked) {
    this.setState({
      isSecure: checked
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
      this.state.type.value,
      this.state.isSecure,
      this.state.keyPath,
      this.state.cartPath
    );
  }

  render() {
    return (
      <form className="form" action="#">
        <div className="form-row">
          <div className="form__field">
            <label className="form-field__label" htmlFor="server-name">
              Name:
            </label>
            <input
              className="form-field__input"
              name="server-name"
              type="text"
              onChange={this.handleNameChange}
              value={this.state.name}
              placeholder={'Awesome server'}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form__col">
            <div className="form__field">
              <label className="form-field__label" htmlFor="server-port">
                Port:
              </label>
              <input
                className="form-field__input"
                name="server-port"
                type="text"
                onChange={this.handleChangePort}
                value={this.state.port}
              />
            </div>
          </div>
          <div className="form__col">
            <div className="form__field">
              <label className="form-field__label" htmlFor="server-type">
                Type:
              </label>
              <Select
                name="server-type"
                value={this.state.type.value}
                onChange={this.handleTypeChange}
                searchable={false}
                clearable={false}
                className="form-field__select"
                options={[
                  { value: 'http', label: 'HTTP' },
                  { value: 'ws', label: 'Web Socket' }
                ]}
              />
            </div>
          </div>
          <div className="form__col form__col--small">
            <div className="form__field">
              <label className="form-field__label" htmlFor="server-secure">
                Secure:
              </label>
              <Switch
                checked={this.state.isSecure}
                onChange={this.handleSecureChange}
                checkedChildren="Yes"
                unCheckedChildren="No"
                className="form-field__switch"
              />
            </div>
          </div>
        </div>
        {
          this.state.isSecure
            ? (
              <div>
                <div className="form__field">
                  <label
                    className="form-field__label"
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
                <div className="form__field">
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
        <div className="form-row">
          <button
            className="button form__button"
            onClick={this.submit}
          >
            <img className="form__submit-icon" src={plusIcon} alt="" />Create
          </button>
        </div>
      </form>
    );
  }
}

AddServerForm.propTypes = {
  add: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  add: init
};

export default connect(null, mapDispatchToProps)(AddServerForm);
