import { Map, List, Record } from 'immutable';
import { createSelector } from 'reselect';
import unique from 'cuid';
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

const initialState = () => new Map({
  entities: new Map(),
  ids: new List()
});

const reducerActions = {
  [NOTIFICATION_CLICKED]: (action, reducers, state) =>
    reducers.removeNotification(state, action.id)
};

const moduleReducers = {
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

export const configureReducer = (actions) => {
  const allActions = Object.assign(reducerActions, actions);

  return (state = initialState(), action) => {
    const actionTypes = Object.keys(allActions);

    for (let i = 0; i < actionTypes.length; i += 1) {
      if (action.type === actionTypes[i]) {
        const transform = allActions[actionTypes[i]];
        return transform(action, moduleReducers, state);
      }
    }

    return state;
  };
};

export const configureSelectors = stateGetter => ({
  allNotificationsSelector: createSelector(
    state => stateGetter(state).get('ids'),
    state => stateGetter(state).get('entities'),
    (ids, entities) => ids.map(id => entities.get(id))
  )
});
