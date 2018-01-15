import React from 'react';
import PropTypes from 'prop-types';
import Renderer from './renderer';

const createModal = (types, CustomRenderer) => {
  const Modal = ({ component, onOverlayClick }) => {
    const ModalComponent = types[component];
    const isOpen = !!ModalComponent;

    return CustomRenderer
      ? (
        <CustomRenderer
          isOpen={isOpen}
          onOverlayClick={onOverlayClick}
          ComponentClass={ModalComponent}
        />
      )
      : (
        <Renderer
          isOpen={isOpen}
          onOverlayClick={onOverlayClick}
          ComponentClass={ModalComponent}
        />
      );
  };

  Modal.propTypes = {
    component: PropTypes.string,
    onOverlayClick: PropTypes.func.isRequired
  };

  Modal.defaultProps = {
    component: ''
  };

  return Modal;
};

export default createModal;
