import reducer, { NotificationsState } from './reducer';
import { remove, add, ADD, REMOVE } from './actions';

jest.mock('cuid', () => () => 'id');

describe('notifications reducer', () => {
  it('should returns empty list as initial state', () => {
    expect(reducer(undefined, { type: 'some type' })).toEqual(new NotificationsState());
  });

  it(`should add notification on ${ADD} action only if notification params are provided`, () => {
    const successAddState = reducer(
      undefined,
      add({
        text: 'notification text'
      })
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
      add()
    );

    expect(failedAddState.toJS()).toEqual({
      ids: [],
      entities: {}
    });
  });

  it(`should remove notification on ${REMOVE} action`, () => {
    const stateAfterAdd = reducer(
      undefined,
      add({
        text: 'notification text'
      })
    );

    const stateAfterRemove = reducer(stateAfterAdd, remove('id'));

    expect(stateAfterRemove.toJS()).toEqual({
      ids: [],
      entities: {}
    });
  });
});
