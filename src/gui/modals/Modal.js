import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import AddServerModal from './AddServerModal';
import selectors from './selectors';

export const OVERLAY_CLICKED = 'modals/OVERLAY_CLICKED';

export const overlayClickedAction = () => ({
  type: OVERLAY_CLICKED
});

export const types = {
  addServerModal: AddServerModal,
};

export const Modal = ({ component, onOverlayClick }) => {
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

const mapStateToProps = state => ({
  component: selectors.modalSelector(state)
});
const mapDispatchToProps = {
  onOverlayClick: overlayClickedAction
};
export const ModalConnect = connect(mapStateToProps, mapDispatchToProps)(Modal);
