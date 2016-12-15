import React from 'react';
import { connect } from 'react-redux';

const mapDispatchToProps = {
  onChange: files => ({ type: 'mocks/FILE_PICKED', files })
};

class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChange(this.fileNode.files);
  }

  render() {
    const { handleChange } = this;

    return (
      <div>
        <input type="file" ref={(node) => { this.fileNode = node; }} onChange={handleChange} />
      </div>
    );
  }
}

FilePicker.propTypes = {
  onChange: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
