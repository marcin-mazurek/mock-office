export const NOTIFICATION_EXPIRED = 'notifications/NOTIFICATION_EXPIRED';
export const notificationExpiredAction = id => ({
  type: NOTIFICATION_EXPIRED,
  id
});
export const ADD_NOTIFICATION = 'notifications/ADD_NOTIFICATION';
export const addNotificationAction = (status, message) => ({
  type: ADD_NOTIFICATION,
  status,
  message
});
export const NEW_NOTIFICATION_DISPLAYED = 'notifications/NEW_NOTIFICATION_DISPLAYED';
export const newNotificationDisplayedAction = id => ({
  type: NEW_NOTIFICATION_DISPLAYED,
  id
});
export const NOTIFICATION_CLICKED = 'notifications/NOTIFICATION_CLICKED';
export const notificationsClickedAction = id => ({
  type: NOTIFICATION_CLICKED,
  id
});

