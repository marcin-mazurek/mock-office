import { connect } from 'react-redux';
import { NotificationsList, notificationsClickedAction } from './NotificationsList';

const createNotificationsListConnect = (selectors) => {
  const mapStateToProps = state => ({
    notifications: selectors.allNotificationsSelector(state)
  });
  const mapDispatchToProps = {
    onNotificationClick: notificationsClickedAction
  };
  return connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
};

export default createNotificationsListConnect;
