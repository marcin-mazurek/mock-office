import { connect } from 'react-redux';
import { NotificationsList, notificationsClickedAction } from './NotificationsList';
import { newNotificationDisplayedAction } from './actions';

const createNotificationsListConnect = (selectors) => {
  const mapStateToProps = state => ({
    notifications: selectors.allNotificationsSelector(state)
  });
  const mapDispatchToProps = {
    onNotificationClick: notificationsClickedAction,
    onNewNotificationDisplayed: newNotificationDisplayedAction
  };
  return connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
};

export default createNotificationsListConnect;
