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
            ({ id, text, type }) => (
              <li className="notification__item" key={id}>
                <Notification
                  id={id}
                  text={text}
                  type={type}
                  onNotificationClick={onNotificationClick}
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
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })),
  onNotificationClick: PropTypes.func.isRequired,
  onNewNotificationDisplayed: PropTypes.func.isRequired
};

NotificationsList.defaultProps = {
  notifications: []
};
