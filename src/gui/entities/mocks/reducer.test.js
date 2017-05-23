import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD, REMOVE, addAction, removeAction } from './actions';

describe('mocks reducer', () => {
  test(`on ${ADD} action`, () => {
    const state = reducer(fromJS({
      ids: [],
      entities: {}
    }), addAction(
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==1',
      'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
      {
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
    ));

    expect(state.toJS()).toEqual({
      entities: {
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
      },
      ids: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
    });
  });

  test(`on ${REMOVE} action`, () => {
    const state = reducer(fromJS({
      entities: {
        'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==': {
          id: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
        }
      },
      ids: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
    }), removeAction('AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==', 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='));

    expect(state.toJS()).toEqual({
      entities: {},
      ids: []
    });
  });
});
