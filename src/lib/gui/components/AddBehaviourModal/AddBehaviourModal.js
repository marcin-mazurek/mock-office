import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import AddBehaviourFormConnect from '../AddBehaviourForm';
import AddHttpBehaviourFormConnect from '../AddHttpBehaviourForm';

const AddBehaviourModal = ({ serverId, serverType }) => (
  <div className="add-behaviour-modal">
    <div className="modal-header">
      <div className="modal-header__label">
        Add behaviour
      </div>
    </div>
    <div className="add-behaviour-modal__content">
      <Scrollbars>
        <div className="add-behaviour-modal__form">
          {
            serverType === 'http'
            ? <AddHttpBehaviourFormConnect serverId={serverId} />
            : <AddBehaviourFormConnect serverId={serverId} />
          }
        </div>
      </Scrollbars>
    </div>
  </div>
);

AddBehaviourModal.propTypes = {
  serverId: PropTypes.string.isRequired,
  serverType: PropTypes.string.isRequired
};

export default AddBehaviourModal;
