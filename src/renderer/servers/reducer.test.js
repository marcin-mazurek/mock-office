import { fromJS, Set } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  SELECT,
  START,
  STOP
} from './actions';

describe('servers reducer', () => {
  test(`${SELECT} action`, () => {
    const state = reducer(fromJS({
      selected: null,
    }), { type: SELECT, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='
    });
  });

  test(`${START} action`, () => {
    const state = reducer(fromJS({
      running: new Set()
    }), { type: START, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
    });
  });

  test(`${ADD} action`, () => {
    const state = reducer(fromJS({
      entities: {},
      ids: new Set()
    }), {
      type: ADD,
      name: 'Server name',
      port: 3000,
      id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
      serverType: 'http'
    });
    expect(state.toJS()).toEqual({
      entities: {
        'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==': {
          id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
          name: 'Server name',
          port: 3000,
          type: 'http'
        }
      },
      ids: ['AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==']
    });
  });

  test(`${STOP} action`, () => {
    const state = reducer(fromJS(
      {
        running: new Set(['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='])
      }
    ), { type: STOP, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

    expect(state.toJS()).toEqual({
      running: []
    });
  });

  test('unknown action', () => {
    const state = {};
    expect(reducer(state, { type: 'unknown action type' })).toBe(state);
  });
});
