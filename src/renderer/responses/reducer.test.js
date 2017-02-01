import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD } from './actions';

test(`${ADD} reducer`, () => {
  const state = reducer(fromJS({}), {
    type: 'responses/ADD',
    response: { body: { data: 'response for some-url-3' } },
    responseId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
      body: { data: 'response for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    }
  });
});
