import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import AddServerModal from './AddServerModal';
import { closeAction } from './actions';

const modalSelector = state => state.getIn(['modals', 'component']);

export const types = {
  addServerModal: AddServerModal,
};

export const Modal = ({ component, close }) => {
  const ModalComponent = types[component];
  const isOpen = !!ModalComponent;

  return isOpen
    ? (
      <div
        className="modal"
      >
        <button className="modal__overlay" onClick={close} />
        <div className="modal__content">
          <ModalComponent />
        </div>
      </div>
    )
    : null;
};
Modal.propTypes = {
  component: PropTypes.string,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  component: modalSelector(state)
});
const mapDispatchToProps = {
  close: closeAction
};
export const ModalConnect = connect(mapStateToProps, mapDispatchToProps)(Modal);
