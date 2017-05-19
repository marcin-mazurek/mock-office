import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  REMOVE,
  add,
  remove
} from './actions';

describe('scenarios reducer', () => {
  test(`on ${ADD} action`, () => {
    const state = fromJS({
      entities: {},
      ids: []
    });

    expect(reducer(
      state,
      add('server-id', 'scenario-id')).toJS()).toEqual({
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

    expect(reducer(state, remove('scenario-id')).toJS()).toEqual({
      entities: {},
      ids: []
    });
  });
});
