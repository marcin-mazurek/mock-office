import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from './removeTask/actions';
import { ADD } from './addTask/actions';

describe('tasks reducer', () => {
  test(`${ADD} action`, () => {
    const state = reducer(fromJS({}), {
      type: ADD,
      taskPayload: { body: 'task for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
        taskPayload: {
          body: 'task for some-url-3',
        },
        id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
        interval: null,
        reuse: null,
        quantity: null,
        title: '',
        delay: null,
        instant: null
      }
    });
  });

  test(`${REMOVE} action`, () => {
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        taskPayload: { data: 'task for some-url-3' },
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
      }
    }), { type: REMOVE, taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toEqual({});
  });

  test('unknown action', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown action type' })).toBe(state);
  });
});
