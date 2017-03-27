import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from './removeScene/actions';
import { ADD } from './addScene/actions';

describe('scenes reducer', () => {
  test(`${ADD} scene`, () => {
    const state = reducer(fromJS({}), {
      type: ADD,
      scenePayload: { body: 'scene for some-url-3' },
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
        scenePayload: {
          body: 'scene for some-url-3',
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

  test(`${REMOVE} scene`, () => {
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        scenePayload: { data: 'scene for some-url-3' },
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
