import { NEW_NOTIFICATION_DISPLAYED } from './Notifications';
import { notificationExpiredAction } from './actions';

const NOTIFICATION_EXPIRATION_TIME = 5000;
const expireNotification = ({ id }) => new Promise((resolve) => {
  setTimeout(() => resolve(id), NOTIFICATION_EXPIRATION_TIME);
});

export default action$ =>
  action$.ofType(NEW_NOTIFICATION_DISPLAYED)
    .flatMap(expireNotification)
    .map(id => notificationExpiredAction(id));
