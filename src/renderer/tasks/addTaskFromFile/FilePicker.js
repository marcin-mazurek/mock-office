import React from 'react';
import { connect } from 'react-redux';
import { init as initAddQueueFromFile } from './actions';

const mapDispatchToProps = {
  initAddQueueFromFile
};

export class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }

  handleChange(e) {
    if (e.target.files.length) {
      this.props.initAddQueueFromFile(e.target.files);
    }

    this.setState({
      value: ''
    });
  }

  render() {
    const { handleChange } = this;
    const { value } = this.state;

    return (
      <input
        type="file"
        onChange={handleChange}
        value={value}
      />
    );
  }
}

FilePicker.propTypes = {
  initAddQueueFromFile: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
