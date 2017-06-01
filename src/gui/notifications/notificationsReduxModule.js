import { Map, List, Record } from 'immutable';
import { createSelector } from 'reselect';
import unique from 'cuid';
import createModule from '../utils/reduxModule';
import { NOTIFICATION_CLICKED } from './NotificationsList';

export const Notification = new Record({
  id: '',
  text: '',
  type: 'info'
});

const createNotification = (params) => {
  const config = {};

  config.id = unique();
  switch (params.type) {
    case 'error': {
      config.type = 'error';
      break;
    }
    case 'success': {
      config.type = 'success';
      break;
    }
    default: {
      config.type = 'info';
    }
  }
  config.text = params.text;

  return new Notification(config);
};

const getInitialState = () => new Map({
  entities: new Map(),
  ids: new List()
});

const api = {
  addNotification(state, notificationParams) {
    const notification = createNotification(notificationParams);
    return state
      .update('entities', entities => entities.set(notification.id, notification))
      .update('ids', ids => ids.push(notification.id));
  },
  removeNotification(state, id) {
    return state
      .update('ids', ids => ids.filter(notificationId => notificationId !== id))
      .update('entities', entities => entities.delete(id));
  }
};

const selectors = {
  allNotificationsSelector: createSelector(
    state => state.get('ids'),
    state => state.get('entities'),
    (ids, entities) => ids.map(id => entities.get(id))
  )
};

const actionHandlers = {
  [NOTIFICATION_CLICKED]: (action, moduleApi, state) =>
    moduleApi.removeNotification(state, action.id)
};

export default createModule(
  getInitialState,
  actionHandlers,
  api,
  selectors
);
