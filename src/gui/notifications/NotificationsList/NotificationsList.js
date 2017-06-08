import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { Notification } from '../createNotification';

export const NOTIFICATION_CLICKED = 'component/NotificationsList/NOTIFICATION_CLICKED';
export const notificationsClickedAction = id => ({
  type: NOTIFICATION_CLICKED,
  id
});

export const NotificationsList = ({ notifications, onNotificationClick }) => (
  <ul className="notifications-list">
    {
      notifications.map(
        ({ id, text, type }) =>
          <li className="notifications-list-item" key={id}>
            <button
              className={`notifications-bubble notifications-bubble--${type}`}
              onClick={() => onNotificationClick(id)}
            >
              {text}
            </button>
          </li>
      )
    }
  </ul>
);
NotificationsList.propTypes = {
  notifications: ImmutablePropTypes.listOf(PropTypes.instanceOf(Notification)),
  onNotificationClick: PropTypes.func.isRequired
};
