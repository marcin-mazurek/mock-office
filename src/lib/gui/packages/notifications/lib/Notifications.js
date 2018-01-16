import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

export default class NotificationsList extends React.Component {
  componentWillReceiveProps(nextProps) {
    const oldNotifications = this.props.notifications;
    const currentNotifications = nextProps.notifications;

    currentNotifications.forEach((currentNotification) => {
      if (
        !oldNotifications.find(oldNotification => oldNotification.id === currentNotification.id)
      ) {
        this.props.onNewNotificationDisplayed(currentNotification.id);
      }
    });
  }

  render() {
    const { notifications, onNotificationClick } = this.props;

    return (
      <ul className="notifications">
        {
          notifications.map(
            ({ id, message, mood, disposable }) => (
              <li className="notifications__item" key={id}>
                <Notification
                  id={id}
                  message={message}
                  mood={mood}
                  onNotificationClick={onNotificationClick}
                  disposable={disposable}
                />
              </li>
            )
          )
        }
      </ul>
    );
  }
}

NotificationsList.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    onNotificationClick: PropTypes.func,
    message: PropTypes.string.isRequired,
    disposable: PropTypes.bool,
    mood: PropTypes.string
  })),
  onNotificationClick: PropTypes.func.isRequired,
  onNewNotificationDisplayed: PropTypes.func.isRequired
};

NotificationsList.defaultProps = {
  notifications: []
};
