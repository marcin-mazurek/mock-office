import React from 'react';
import Modal from 'react-modal';
import { Scrollbars } from 'react-custom-scrollbars';
import AddServerFormConnect from '../AddServerForm';

const AddServerModal = () => (
  <Modal
    className="add-server-modal"
    overlayClassName="add-server-modal__overlay"
    isOpen
  >
    <Scrollbars>
      <div className="add-server-modal-content">
        <AddServerFormConnect />
      </div>
    </Scrollbars>
  </Modal>
);

export default AddServerModal;
