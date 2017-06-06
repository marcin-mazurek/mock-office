import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Notification } from './index';

export const NOTIFICATION_CLICKED = 'component/NotificationsList/NOTIFICATION_CLICKED';
export const notificationsClickedAction = id => ({
  type: NOTIFICATION_CLICKED,
  id
});

// eslint-disable-next-line import/prefer-default-export
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

export const createNotificationsListConnect = (selectors) => {
  const mapStateToProps = state => ({
    notifications: selectors.allNotificationsSelector(state)
  });
  const mapDispatchToProps = {
    onNotificationClick: notificationsClickedAction
  };
  return connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
};
