import reducer, { NotificationsState } from '../../../../src/gui/entities/notifications/reducer';
import { removeAction, addAction, ADD, REMOVE } from '../../../../src/gui/entities/notifications/actions';

jest.mock('cuid', () => () => 'id');

describe('notifications reducer', () => {
  it('should returns empty list as initial state', () => {
    expect(reducer(undefined, { type: 'some type' })).toEqual(new NotificationsState());
  });

  it(`should add notification on ${ADD} action only if notification params are provided`, () => {
    const successAddState = reducer(
      undefined,
      addAction({
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
  });

  it(`should remove notification on ${REMOVE} action`, () => {
    const stateAfterAdd = reducer(
      undefined,
      addAction({
        text: 'notification text'
      })
    );

    const stateAfterRemove = reducer(stateAfterAdd, removeAction('id'));

    expect(stateAfterRemove.toJS()).toEqual({
      ids: [],
      entities: {}
    });
  });
});
