import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import AddServerFormConnect from '../AddServerForm';
import { closeModal as closeModalAction } from '../actions';
import serverIcon from '../icons_gray_server.svg';

const AddServerModal = ({ isOpen, close }) => (
  <Modal
    isOpen={isOpen}
    className="modal add-server-modal"
    overlayClassName="add-server-modal-overlay"
    contentLabel="add server modal"
    onRequestClose={() => close()}
  >
    <div className="modal-header">
      <img className="modal-header__icon" src={serverIcon} alt="" />
      <div className="modal-header__label">
        Add server
      </div>
    </div>
    <div className="modal-content">
      <AddServerFormConnect />
    </div>
    <div className="modal-footer">
      <button className="button modal-footer__button">Create</button>
    </div>
  </Modal>
);

AddServerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

const isOpenSelector = state => state.getIn(['addServer', 'isOpen']);

const AddServerModalConnect = connect(
  state => ({
    isOpen: isOpenSelector(state)
  }),
  {
    close: closeModalAction
  }
)(AddServerModal);

export default AddServerModalConnect;
