import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD, REMOVE } from './actions';

test(`${ADD} reducer`, () => {
  const state = reducer(fromJS({}), {
    type: 'expectations/ADD',
    expectation: { body: { data: 'expectation for some-url-3' } },
    expectationId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
      body: { data: 'expectation for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    }
  });
});

test(`${REMOVE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
      body: { data: 'expectation for some-url-3' },
      id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    }
  }), { type: 'expectations/REMOVE', id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

  expect(state.toJS()).toEqual({});
});
