import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import AddHttpBehaviourFormConnect from '../AddHttpBehaviourForm';
import AddWsBehaviourFormConnect from '../AddWsBehaviourForm';

const AddBehaviourModal = ({ serverType, serverId }) => (
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
              : <AddWsBehaviourFormConnect serverId={serverId} />
          }
        </div>
      </Scrollbars>
    </div>
  </div>
);

AddBehaviourModal.propTypes = {
  serverType: PropTypes.string.isRequired,
  serverId: PropTypes.string.isRequired
};

export default AddBehaviourModal;
