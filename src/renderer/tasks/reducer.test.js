import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from './removeTask/actions';
import { RUN, STOP } from './runTask/actions';
import { ADD } from './addTask/actions';

describe('tasks reducer', () => {
  test(`${ADD} action`, () => {
    const state = reducer(fromJS({}), {
      type: ADD,
      taskPayload: { body: 'task for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toMatchSnapshot();
  });

  test(`${RUN} action`, () => {
    const now = Date.now;
    Date.now = jest.fn(() => 1482363367321);
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        taskPayload: { data: 'task for some-url-3' },
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==',
        running: false,
        runCount: 0,
        lastRunTimestamp: null,
        lastDuration: null
      }
    }), { type: RUN, taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toMatchSnapshot();
    Date.now = now;
  });

  test(`${STOP} action`, () => {
    const now = Date.now;
    Date.now = jest.fn(() => 1482363367321);
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        taskPayload: { data: 'task for some-url-3' },
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==',
        running: true,
        runCount: 1,
        lastRunTimestamp: 1482363367071,
        lastDuration: null
      }
    }), { type: STOP, taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toMatchSnapshot();
    Date.now = now;
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
