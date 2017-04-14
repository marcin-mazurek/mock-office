import reducer, { NotificationsState } from './reducer';

jest.mock('node-unique', () => () => 'id');

describe('notifications reducer', () => {
  it('should returns empty list as initial state', () => {
    expect(reducer(undefined, { type: 'some type' })).toEqual(new NotificationsState());
  });

  it('should add notification on notifications/ADD action only if notification params are provided', () => {
    const successAddState = reducer(
      undefined,
      {
        type: 'notifications/ADD',
        notification: {
          text: 'notification text'
        }
      }
    );

    expect(successAddState.toJS()).toEqual({
      ids: ['id'],
      entities: {
        id: {
          id: 'id',
          type: 'info',
          text: 'notification text'
        }
      }
    });

    const failedAddState = reducer(
      undefined,
      {
        type: 'notifications/ADD'
      }
    );

    expect(failedAddState.toJS()).toEqual({
      ids: [],
      entities: {}
    });
  });

  it('should remove notification on notifications/REMOVE action', () => {
    const stateAfterAdd = reducer(
      undefined,
      {
        type: 'notifications/ADD',
        notification: {
          text: 'notification text'
        }
      }
    );

    const stateAfterRemove = reducer(stateAfterAdd, { type: 'notifications/REMOVE', id: 'id' });

    expect(stateAfterRemove.toJS()).toEqual({
      ids: [],
      entities: {}
    });
  });
});
