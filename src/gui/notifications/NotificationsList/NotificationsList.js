import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Notification } from '../createNotification';

export const NOTIFICATION_CLICKED = 'component/NotificationsList/NOTIFICATION_CLICKED';
export const notificationsClickedAction = id => ({
  type: NOTIFICATION_CLICKED,
  id
});

export class NotificationsList extends React.Component {
  componentWillReceiveProps(nextProps) {
    const oldNotifications = this.props.notifications;
    const currentNotifications = nextProps.notifications;
    let newNotificationIds = new List();

    if (currentNotifications.size > 0) {
      if (oldNotifications && oldNotifications.size < currentNotifications.size) {
        currentNotifications.forEach((currentNotification) => {
          if (!oldNotifications.find(
              oldNotification => oldNotification.id === currentNotification.id
            )) {
            newNotificationIds = newNotificationIds.push(currentNotification.id);
          }
        });
      } else {
        newNotificationIds = currentNotifications.map(
          currentNotification => currentNotification.id
        );
      }
    }

    newNotificationIds.map(
      newNotificationId => this.props.onNewNotificationDisplayed(newNotificationId)
    );
  }

  render() {
    const { notifications, onNotificationClick } = this.props;

    return (
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
  }
};

NotificationsList.propTypes = {
  notifications: ImmutablePropTypes.listOf(PropTypes.instanceOf(Notification)),
  onNotificationClick: PropTypes.func.isRequired,
  onNewNotificationDisplayed: PropTypes.func.isRequired
};
