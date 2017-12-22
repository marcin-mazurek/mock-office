import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createClearExpiredNotificationsEpic from '../lib/createClearExpiredNotificationsEpic';
import { addNotificationAction, newNotificationDisplayedAction, removeNotificationAction } from '../lib/actions';
import { allNotificationsSelector } from '../lib/selectors';

describe('creatClearExpiredNotificationsEpic', () => {
  it('should dispatch expire action after delay', () => {
    jest.useFakeTimers();
    jest.doMock('cuid', () => () => 'id');
    const createReducer = require('../lib/createReducer').default;
    const reducer = combineReducers({
      notifications: createReducer()
    });
    const store = createStore(
      reducer,
      {},
      applyMiddleware(createEpicMiddleware(createClearExpiredNotificationsEpic(5)))
    );
    store.dispatch(addNotificationAction('success', 'message'));
    store.dispatch(removeNotificationAction('id'));
    store.dispatch(newNotificationDisplayedAction('id'));
    jest.runTimersToTime(10);
    expect(allNotificationsSelector(store.getState())).toHaveLength(0);
  });
});
