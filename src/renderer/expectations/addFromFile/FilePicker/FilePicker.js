import React from 'react';
import { connect } from 'react-redux';
import { filePick } from '../../actions';

const mapDispatchToProps = {
  filePick
};

class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.filePick(this.fileNode.files);
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
  filePick: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
