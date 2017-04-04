import { fromJS, Set } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  SELECT,
  START,
  STOP,
  REMOVE
} from './actions';

describe('servers reducer', () => {
  test(`${SELECT} scene`, () => {
    const state = reducer(fromJS({
      selected: null,
    }), { type: SELECT, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='
    });
  });

  test(`${START} scene`, () => {
    const state = reducer(fromJS({
      running: new Set()
    }), { type: START, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
    });
  });

  test(`${ADD} scene`, () => {
    const state = reducer(fromJS({
      entities: {},
      ids: []
    }), {
      type: ADD,
      name: 'Server name',
      port: 3000,
      id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
      serverType: 'http',
      secure: false
    });
    expect(state.toJS()).toEqual({
      entities: {
        'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==': {
          name: 'Server name',
          port: 3000,
          id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
          type: 'http',
          secure: false
        }
      },
      ids: ['AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==']
    });
  });

  test(`${STOP} scene`, () => {
    const state = reducer(fromJS(
      {
        running: new Set(['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='])
      }
    ), { type: STOP, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: []
    });
  });

  test('unknown scene', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown scene type' })).toBe(state);
  });

  test(`${REMOVE} scene`, () => {
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
});
