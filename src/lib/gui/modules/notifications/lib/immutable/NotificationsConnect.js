import { connect } from 'react-redux';
import Notifications from '../Notifications';
import { newNotificationDisplayedAction, notificationsClickedAction } from '../actions';
import { allNotificationsSelector } from './selectors';

const mapStateToProps = state => ({
  notifications: allNotificationsSelector(state)
});
const mapDispatchToProps = {
  onNotificationClick: notificationsClickedAction,
  onNewNotificationDisplayed: newNotificationDisplayedAction
};
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
