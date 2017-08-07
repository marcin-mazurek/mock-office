import { Observable } from 'rxjs';
import { NEW_NOTIFICATION_DISPLAYED } from './actions';

export const NOTIFICATION_EXPIRED = 'notifications/NOTIFICATION_EXPIRED';
export const notificationExpiredAction = id => ({
  type: NOTIFICATION_EXPIRED,
  id
});
const NOTIFICATION_EXPIRATION_TIME = 5000;
const expireNotification = ({ id }) => new Promise((resolve) => {
  setTimeout(() => resolve(id), NOTIFICATION_EXPIRATION_TIME);
});

export default action$ =>
  action$.ofType(NEW_NOTIFICATION_DISPLAYED)
    .flatMap(expireNotification)
    .map(id => notificationExpiredAction(id));
