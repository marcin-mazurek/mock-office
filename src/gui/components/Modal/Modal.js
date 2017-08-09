import React from 'react';
import PropTypes from 'prop-types';

const createModal = (types) => {
  const Modal = ({ component, onOverlayClick }) => {
    const ModalComponent = types[component];
    const isOpen = !!ModalComponent;

    return isOpen
      ? (
        <div
          className="modal"
        >
          <button className="modal__overlay" onClick={onOverlayClick} />
          <div className="modal__content">
            <ModalComponent />
          </div>
        </div>
      )
      : null;
  };
  Modal.propTypes = {
    component: PropTypes.string,
    onOverlayClick: PropTypes.func.isRequired
  };

  return Modal;
};


export default createModal;