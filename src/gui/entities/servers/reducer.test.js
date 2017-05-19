import { fromJS, Set } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  SELECT,
  START,
  STOP,
  REMOVE,
  RENAME,
  add
} from './actions';

describe('servers reducer', () => {
  test(`on ${SELECT} action`, () => {
    const state = reducer(fromJS({
      selected: null,
    }), { type: SELECT, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='
    });
  });

  test(`on ${START} action`, () => {
    const state = reducer(fromJS({
      running: new Set()
    }), { type: START, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
    });
  });

  test(`on ${ADD} action`, () => {
    const state = reducer(
      fromJS({
        entities: {},
        ids: []
      }),
      add('server-id', {
        name: 'Server name',
        port: 3000,
        secure: false,
        type: 'http',
        scenario: 'scenario-id'
      })
    );
    expect(state.toJS()).toEqual({
      entities: {
        'server-id': {
          name: 'Server name',
          port: 3000,
          id: 'server-id',
          type: 'http',
          secure: false,
          running: false,
          scenario: 'scenario-id'
        }
      },
      ids: ['server-id']
    });
  });

  test(`on ${STOP} action`, () => {
    const state = reducer(fromJS(
      {
        running: new Set(['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='])
      }
    ), { type: STOP, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: []
    });
  });

  test('unknown mock', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown mock type' })).toBe(state);
  });

  test(`on ${REMOVE} action`, () => {
    const state = reducer(fromJS({
      entities: {
        'some id': {
          id: 'some id',
          name: 'Server name',
          port: 3000,
          type: 'http'
        }
      },
      ids: ['some id'],
      selected: 'some id'
    }), {
      type: REMOVE,
      id: 'some id'
    });
    expect(state.toJS()).toEqual({
      entities: {},
      ids: [],
      selected: null
    });
  });

  test(`on ${RENAME} action`, () => {
    const state = reducer(fromJS({
      entities: {
        'some id': {
          id: 'some id',
          name: 'Server name',
          port: 3000,
          type: 'http'
        }
      }
    }), {
      type: RENAME,
      id: 'some id',
      name: 'New server name',
    });
    expect(state.toJS()).toEqual({
      entities: {
        'some id': {
          id: 'some id',
          name: 'New server name',
          port: 3000,
          type: 'http'
        }
      }
    });
  });
});
