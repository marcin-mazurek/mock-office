import React from 'react';
import PropTypes from 'prop-types';

const NotificationListItem = ({ id, onNotificationClick, text, type }) => (
  <div className="notifications-list-item" key={id}>
    <button
      className={`notifications-bubble notifications-bubble--${type}`}
      onClick={() => onNotificationClick(id)}
    >
      {text}
    </button>
  </div>
);

NotificationListItem.propTypes = {
  id: PropTypes.string.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default NotificationListItem;
