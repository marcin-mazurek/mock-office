import React from 'react';
import PropTypes from 'prop-types';

const AppHeader = ({ onExportButtonClick, onImportButtonClick }) => (
  <div className="app-header">
    <button
      className="app-header__button"
      onClick={onExportButtonClick}
    >
      Export
    </button>
    <button
      className="app-header__button"
      onClick={onImportButtonClick}
    >
      Import
    </button>
  </div>
);

AppHeader.propTypes = {
  onExportButtonClick: PropTypes.func.isRequired,
  onImportButtonClick: PropTypes.func.isRequired
};

export default AppHeader;
