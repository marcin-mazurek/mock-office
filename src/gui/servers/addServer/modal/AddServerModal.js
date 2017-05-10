import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import AddServerFormConnect from '../AddServerForm';
import { closeModal as closeModalAction } from '../actions';

const AddServerModal = ({ isOpen, close }) => (
  <Modal
    isOpen={isOpen}
    className="add-server-modal"
    overlayClassName="add-server-modal-overlay"
    contentLabel="add server modal"
    onRequestClose={() => close()}
  >
    <div className="add-server-modal-content">
      <AddServerFormConnect />
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
