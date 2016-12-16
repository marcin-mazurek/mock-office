import React from 'react';
import { connect } from 'react-redux';
import { add } from '../../servers/actions';

class AddServer extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);

    this.state = {
      name: 'Server name',
      port: 3000
    };
  }

  handleNameChange(e) {
    this.setState({
      name: e.currentTarget.value
    });
  }

  handleChangePort(e) {
    this.setState({
      port: e.currentTarget.value
    });
  }

  submit() {
    this.props.add(this.state.name, this.state.port);
  }

  render() {
    return (
      <div>
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <label htmlFor="port">Port:</label>
        <input
          type="text"
          value={this.state.port}
          name="port"
          onChange={this.handleChangePort}
        />
        <button onClick={this.submit}>Create</button>
      </div>
    );
  }
}

AddServer.propTypes = {
  add: React.PropTypes.func.isRequired
};

const mapDispatchToProps = {
  add
};

export default connect(null, mapDispatchToProps)(AddServer);
