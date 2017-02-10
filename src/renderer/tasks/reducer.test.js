import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD, REMOVE } from './actions';

test(`${ADD} reducer`, () => {
  const state = reducer(fromJS({}), {
    type: ADD,
    taskPayload: { body: 'task for some-url-3' },
    taskId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
      body: 'task for some-url-3',
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    }
  });
});

test(`${REMOVE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
      taskPayload: { data: 'task for some-url-3' },
      id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    }
  }), { type: REMOVE, taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

  expect(state.toJS()).toEqual({});
});
