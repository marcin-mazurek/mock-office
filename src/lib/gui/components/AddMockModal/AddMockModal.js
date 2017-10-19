import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import AddHttpMockFormConnect from '../AddHttpMockForm';
import AddWsMockFormConnect from '../AddWsMockForm';

const AddMockModal = ({ serverType, scenario, server }) => (
  <div className="add-mock-modal">
    <div className="modal-header">
      <div className="modal-header__label">
        Add mock
      </div>
    </div>
    <div className="add-mock-modal__content">
      <Scrollbars>
        <div className="add-mock-modal__form">
          {
            serverType === 'http'
              ? <AddHttpMockFormConnect scenario={scenario} server={server} />
              : <AddWsMockFormConnect scenario={scenario} server={server} />
          }
        </div>
      </Scrollbars>
    </div>
  </div>
);

AddMockModal.propTypes = {
  serverType: PropTypes.string.isRequired,
  scenario: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired
};

export default AddMockModal;
