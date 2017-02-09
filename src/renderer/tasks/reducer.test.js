import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD, REMOVE } from './actions';

test(`${ADD} reducer`, () => {
  const state = reducer(fromJS({}), {
    type: 'tasks/ADD',
    task: { body: { data: 'task for some-url-3' } },
    taskId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
      body: { data: 'task for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    }
  });
});

test(`${REMOVE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
      body: { data: 'task for some-url-3' },
      id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    }
  }), { type: 'tasks/REMOVE', id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

  expect(state.toJS()).toEqual({});
});
