import { fromJS } from 'immutable';
import reducer from '../../../../src/gui/entities/scenarios/reducer';
import {
  ADD,
  REMOVE,
  addAction,
  removeAction
} from '../../../../src/gui/entities/scenarios/actions';

describe('scenarios reducer', () => {
  test(`on ${ADD} action`, () => {
    const state = fromJS({
      entities: {},
      ids: []
    });

    expect(reducer(
      state,
      addAction('server-id', 'scenario-id')).toJS()).toEqual({
        entities: {
          'scenario-id': {
            id: 'scenario-id',
            mocks: []
          }
        },
        ids: ['scenario-id']
      });
  });

  test(`on ${REMOVE} action`, () => {
    const state = fromJS({
      entities: {
        'scenario-id': {
          id: 'scenario-id',
          mocks: []
        }
      },
      ids: ['scenario-id']
    });

    expect(reducer(state, removeAction('scenario-id')).toJS()).toEqual({
      entities: {},
      ids: []
    });
  });
});
