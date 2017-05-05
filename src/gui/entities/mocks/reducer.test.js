import { fromJS } from 'immutable';
import reducer from './reducer';
import { REMOVE } from '../../mocks/removeMock/actions';
import { ADD } from '../../mocks/addMock/actions';

describe('mocks reducer', () => {
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
        tasks: [],
        finished: false,
        running: false,
        runCount: 0,
        lastRunTimestamp: null,
        lastDuration: null
      }
    });
  });

  test(`${REMOVE}`, () => {
    const state = reducer(fromJS({
      'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
        id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
      }
    }), { type: REMOVE, mockId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==' });

    expect(state.toJS()).toEqual({});
  });

  test('unknown mock', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown mock type' })).toBe(state);
  });
});
