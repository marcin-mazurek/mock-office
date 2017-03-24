import React from 'react';
import { connect } from 'react-redux';
import { init as intiAddDescriptionFromFile } from './actions';

const mapDispatchToProps = {
  intiAddDescriptionFromFile
};

export class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.files.length) {
      this.props.intiAddDescriptionFromFile(this.props.serverId, e.target.files);
    }
  }

  render() {
    const { handleChange } = this;

    return (
      <div className="file-picker">
        <label
          className="file-picker__button button inspect-server-descriptions-header__button"
          htmlFor="file-picker__input"
        >
          <i className="fa fa-upload" />
        </label>
        <input
          id="file-picker__input"
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
  intiAddDescriptionFromFile: React.PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
