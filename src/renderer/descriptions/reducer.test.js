import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from './removeDescription/actions';
import { ADD } from './addDescription/actions';

describe('descriptions reducer', () => {
  test(`${ADD} action`, () => {
    const state = reducer(fromJS({}), {
      type: ADD,
      descriptionPayload: { body: 'description for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
        descriptionPayload: {
          body: 'description for some-url-3',
        },
        id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
        interval: null,
        reuse: null,
        quantity: null,
        title: '',
        delay: null,
        requirements: null,
        blocking: false
      }
    });
  });

  test(`${REMOVE} action`, () => {
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        descriptionPayload: { data: 'description for some-url-3' },
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
      }
    }), { type: REMOVE, descriptionId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toEqual({});
  });

  test('unknown action', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown action type' })).toBe(state);
  });
});
