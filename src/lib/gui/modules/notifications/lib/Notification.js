import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ id, onNotificationClick, message, type }) => (
  <button
    className={`notifications-bubble notifications-bubble--${type}`}
    onClick={() => onNotificationClick(id)}
  >
    {message}
  </button>
);

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default Notification;
