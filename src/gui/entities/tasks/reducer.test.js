import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  REMOVE,
  removeAction,
  add
} from './actions';

describe('mocks reducer', () => {
  test(`on ${ADD} action`, () => {
    const state = reducer(fromJS({
      ids: [],
      entities: {}
    }), add('mock-id', 'task-id', {
      interval: 0,
      reuse: 'infinite',
      quantity: 1,
      title: 'task title',
      delay: 1000,
      requirements: {}
    }));

    expect(state.toJS()).toEqual({
      entities: {
        'task-id': {
          id: 'task-id',
          interval: 0,
          reuse: 'infinite',
          quantity: 1,
          title: 'task title',
          delay: 1000,
          requirements: {}
        }
      },
      ids: ['task-id']
    });
  });

  test(`on ${REMOVE} action`, () => {
    const state = fromJS({
      entities: {
        'task-id': {
          interval: null,
          reuse: null,
          quantity: null,
          title: '',
          delay: null,
          requirements: null
        }
      },
      ids: ['task-id']
    });

    expect(reducer(state, removeAction('mock-id', 'task-id')).toJS()).toEqual({
      entities: {},
      ids: []
    });
  });
});
