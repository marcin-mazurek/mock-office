import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import FilePickerConnect from '../FilePicker/index';
import trashIcon from '../../../../../assets/icons_gray_trash@3x.svg';
import plusIcon from '../../../../../assets/icons_gray_add@3x.svg';
import { ServerViewHeaderToggleConnect } from '../ServerViewHeaderToggle';

const ServerViewHeader = ({
  running,
  id,
  type,
  name,
  port,
  scenario,
  onRemoveButtonClick,
  onAddMockButtonClickedAction
}) => (
  <div className="server-view-header">
    <div className="server-view-header__toggle">
      <ServerViewHeaderToggleConnect toggled={running} serverId={id} />
    </div>
    <div className="server-view-header__details">
      <div className="server-view-header__name">
        {name}
      </div>
      <div className="server-view-header-spec">
        <div className="server-view-header-spec__item">
          <span className="server-view-header-spec__label">Port:</span>
          <span className="server-view-header-spec__value">{port}</span>
        </div>
        <div className="server-view-header-spec__item">
          <span className="server-view-header-spec__label">Type:</span>
          <span className="server-view-header-spec__value">{type}</span>
        </div>
      </div>
    </div>
    <div className="server-view-header__buttons">
      <button
        className="server-view-header__remove-button button"
        onClick={() => (
          // eslint-disable-next-line no-alert
          confirm(`Do you want to stop & remove '${name}' from the list of available servers?`)
            ? onRemoveButtonClick(id)
            : false
        )
        }
      >
        <img src={trashIcon} role="presentation" />
      </button>
      <Link className="server-view-header__edit-button" to={`/server/${id}/edit`}>
        Edit
      </Link>
      <button
        className="server-view-header__add-mock-button"
        onClick={() => onAddMockButtonClickedAction(id, scenario, type)}
      >
        <img src={plusIcon} role="presentation" style={{ marginRight: '11px' }} />
        Add mock
      </button>
    </div>
    <FilePickerConnect scenario={scenario} server={id} />
  </div>
);

ServerViewHeader.propTypes = {
  running: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  port: PropTypes.number.isRequired,
  scenario: PropTypes.string.isRequired,
  onRemoveButtonClick: PropTypes.func.isRequired,
  onAddMockButtonClickedAction: PropTypes.func.isRequired
};

export default ServerViewHeader;
