import React from 'react';
import { AddMockConnect } from '../mocks/addMock/index';

const AddMockModal = () => (
  <div>
    <div className="modal-header">
      <div className="modal-header__label">
        Add mock
      </div>
    </div>
    <div className="modal-content">
      <AddMockConnect />
    </div>
  </div>
);

export default AddMockModal;
