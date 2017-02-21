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
  }

  handleChange() {
    this.props.initAddQueueFromFile(this.fileNode.files);
  }

  render() {
    const { handleChange } = this;

    return (
      <input
        type="file"
        ref={(node) => { this.fileNode = node; }}
        onChange={handleChange}
      />
    );
  }
}

FilePicker.propTypes = {
  initAddQueueFromFile: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
