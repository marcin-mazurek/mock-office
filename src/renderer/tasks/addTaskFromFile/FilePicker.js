import React from 'react';
import { connect } from 'react-redux';
import { init as intiAddTaskFromFile } from './actions';

const mapDispatchToProps = {
  intiAddTaskFromFile
};

export class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.files.length) {
      this.props.intiAddTaskFromFile(this.props.serverId, e.target.files);
    }
  }

  render() {
    const { handleChange } = this;

    return (
      <div className="file-picker">
        <div className="file-picker__button button">
          <i className="fa fa-upload" />
        </div>
        <input
          className="file-picker__input"
          type="file"
          onChange={handleChange}
          value=""
        />
      </div>
    );
  }
}

FilePicker.propTypes = {
  serverId: React.PropTypes.string.isRequired,
  intiAddTaskFromFile: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
