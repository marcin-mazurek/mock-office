import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from './removeScene/actions';
import { ADD } from './addScene/actions';

describe('scenes reducer', () => {
  test(`${ADD}`, () => {
    const state = reducer(fromJS({}), {
      type: ADD,
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
        id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
        interval: null,
        reuse: null,
        quantity: null,
        title: '',
        delay: null,
        requirements: null,
        parts: []
      }
    });
  });

  test(`${REMOVE}`, () => {
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
      }
    }), { type: REMOVE, sceneId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toEqual({});
  });

  test('unknown scene', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown scene type' })).toBe(state);
  });
});
