import createNotification from './createNotification';
import { NOTIFICATION_CLICKED } from './Notifications';
import { NOTIFICATION_EXPIRED, ADD_NOTIFICATION } from './actions';

const initialState = {
  ids: [],
  entities: {}
};

export function addNotification(state, notificationParams) {
  const notification = createNotification(notificationParams);
  let newState = state;

  newState = Object.assign({}, newState, {
    entities: Object.assign({}, newState.entities, { [notification.id]: notification })
  });
  newState = Object.assign({}, newState, { ids: newState.ids.concat([notification.id]) });

  return newState;
}

export function removeNotification(state, action) {
  let newState = state;
  newState = Object.assign({}, newState, {
    ids: newState.ids.filter(notificationId => notificationId !== action.id)
  });
  newState = Object.assign({}, newState, {
    entities: Object.assign({}, newState.entities, { [action.id]: null })
  });

  return newState;
}

const createReducer = (customReducer) => {
  return function reducer(state = initialState, action) {
    let newState = state;

    if (typeof customReducer === 'function') {
      newState = customReducer(state, action);
    }

    switch (action.type) {
      case ADD_NOTIFICATION: {
        return addNotification(newState, action);
      }
      case NOTIFICATION_CLICKED: {
        return removeNotification(newState, action);
      }
      case NOTIFICATION_EXPIRED: {
        return removeNotification(newState, action);
      }
      default: {
        return newState;
      }
    }
  };
};

export default createReducer;
