import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uploadIcon from '../../assets/icons_gray_upload@3x.svg';

export const FILE_PICK = 'component/FilePicker/FILE_PICK';
export const filePickAction = (server, scenario, files) => ({
  type: FILE_PICK,
  scenario,
  server,
  files
});

export class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.files.length) {
      this.props.filePickAction(this.props.server, this.props.scenario, e.target.files);
    }
  }

  render() {
    const { handleChange } = this;

    return (
      <div className="file-picker">
        <label
          className="file-picker__button inspect-server-mocks-header__button"
          htmlFor="file-picker__input"
        >
          <img src={uploadIcon} role="presentation" style={{ marginRight: '11px' }} />
          Import from file
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
  server: PropTypes.string.isRequired,
  filePickAction: PropTypes.func.isRequired,
  scenario: PropTypes.string.isRequired
};

const mapDispatchToProps = {
  filePickAction
};
export default connect(null, mapDispatchToProps)(FilePicker);
