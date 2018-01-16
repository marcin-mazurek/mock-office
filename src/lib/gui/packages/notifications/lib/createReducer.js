import unique from 'cuid';
import { NOTIFICATION_CLICKED, NOTIFICATION_EXPIRED, ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './actions';

const initialState = {
  ids: [],
  entities: {}
};

export function addNotification(state, notificationParams) {
  const notification = {
    id: unique(),
    mood: notificationParams.mood,
    message: notificationParams.message,
    disposable: notificationParams.disposable
  };
  let newState = state;

  newState = Object.assign({}, newState, {
    entities: Object.assign({}, newState.entities, { [notification.id]: notification })
  });
  newState = Object.assign({}, newState, { ids: newState.ids.concat([notification.id]) });

  return newState;
}

export function removeNotification(state, id) {
  let newState = state;
  newState = Object.assign({}, newState, {
    ids: newState.ids.filter(notificationId => notificationId !== id)
  });
  const newEntities = Object.assign({}, newState.entities);
  delete newEntities[id];
  newState = Object.assign({}, newState, {
    entities: newEntities
  });

  return newState;
}

const createReducer = customReducer =>
  (state = initialState, action) => {
    let newState = state;

    if (typeof customReducer === 'function') {
      newState = customReducer(newState, action);
    }

    switch (action.type) {
      case ADD_NOTIFICATION: {
        return addNotification(newState, action);
      }
      case NOTIFICATION_CLICKED:
      case REMOVE_NOTIFICATION:
      case NOTIFICATION_EXPIRED: {
        return removeNotification(newState, action.id);
      }
      default: {
        return newState;
      }
    }
  };

export default createReducer;
