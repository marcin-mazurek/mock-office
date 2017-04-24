import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { init as intiAddSceneFromFile } from './actions';
import uploadIcon from '../../assets/icons_gray_upload@3x.svg';

const mapDispatchToProps = {
  intiAddSceneFromFile
};

export class FilePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e.target.files.length) {
      this.props.intiAddSceneFromFile(this.props.serverId, e.target.files);
    }
  }

  render() {
    const { handleChange } = this;

    return (
      <div className="file-picker">
        <label
          className="file-picker__button inspect-server-scenes-header__button"
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
  serverId: PropTypes.string.isRequired,
  intiAddSceneFromFile: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(FilePicker);
