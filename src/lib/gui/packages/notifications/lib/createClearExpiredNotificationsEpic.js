import { NEW_NOTIFICATION_DISPLAYED, notificationExpiredAction } from './actions';

const NOTIFICATION_EXPIRATION_TIME = 5000;
const expireNotification = (id, expirationTime) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(id);
  }, expirationTime);
});

export default (expirationTime = NOTIFICATION_EXPIRATION_TIME) => action$ =>
  action$.ofType(NEW_NOTIFICATION_DISPLAYED)
    .flatMap(({ id }) => expireNotification(id, expirationTime))
    .map(id => notificationExpiredAction(id));
