import { connect } from 'react-redux';
import { NotificationsList, notificationsClickedAction } from './NotificationsList';
import { newNotificationDisplayedAction } from './actions';
import { allNotificationsSelector } from '../../app/notifications/selectors';

const mapStateToProps = state => ({
  notifications: allNotificationsSelector(state)
});
const mapDispatchToProps = {
  onNotificationClick: notificationsClickedAction,
  onNewNotificationDisplayed: newNotificationDisplayedAction
};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList);
