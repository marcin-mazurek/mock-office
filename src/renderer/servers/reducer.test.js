import { fromJS, Set } from 'immutable';
import reducer from './reducer';
import {
  ADD,
  SELECT,
  START,
  STOP
} from './actions';

test(`${SELECT} reducer`, () => {
  const state = reducer(fromJS({
    entities: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        tasks: [],
        type: 'http',
        queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
      }
    },
    selected: null,
    running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
  }), { type: SELECT, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    entities: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        tasks: [],
        type: 'http',
        queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
      }
    },
    selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
    running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
  });
});

test(`${START} reducer`, () => {
  const state = reducer(fromJS({
    entities: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        tasks: [],
        type: 'http',
        queues: []
      }
    },
    selected: null,
    running: new Set()
  }), { type: START, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    entities: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        tasks: [],
        type: 'http',
        queues: []
      }
    },
    selected: null,
    running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
  });
});

test(`${ADD} reducer`, () => {
  const state = reducer(fromJS({
    entities: {},
    selected: null,
    running: []
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
    selected: null,
    running: []
  });
});

test(`${STOP} reducer`, () => {
  const state = reducer(fromJS(
    {
      entities: {
        'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
          id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
          name: 'Server name',
          port: 3000,
          tasks: [],
          type: 'http',
          queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
        }
      },
      selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
      running: new Set(['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='])
    }
  ), { type: STOP, id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    entities: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        tasks: [],
        type: 'http',
        queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
      }
    },
    selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
    running: []
  });
});
