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
    itemsById: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        expectations: [],
        type: 'http',
        queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
      }
    },
    selected: null,
    running: ['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==']
  }), { type: 'servers/SELECT', id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    itemsById: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        expectations: [],
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
    itemsById: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        expectations: [],
        type: 'http',
        queues: []
      }
    },
    selected: null,
    running: new Set()
  }), { type: 'servers/START', id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    itemsById: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        expectations: [],
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
    itemsById: {},
    selected: null,
    running: []
  }), {
    type: 'servers/ADD',
    name: 'Server name',
    port: 3000,
    id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
    serverType: 'http'
  });
  expect(state.toJS()).toEqual({
    itemsById: {
      'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==': {
        id: 'AVoOVEFMUlrzP+XqRbO2VYXFeAw78w==',
        name: 'Server name',
        port: 3000,
        type: 'http',
        queue: ''
      }
    },
    selected: null,
    running: []
  });
});

test(`${STOP} reducer`, () => {
  const state = reducer(fromJS(
    {
      itemsById: {
        'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
          id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
          name: 'Server name',
          port: 3000,
          expectations: [],
          type: 'http',
          queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
        }
      },
      selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
      running: new Set(['AVn5T880aJDt/Sk2SBSBDtTSTNXMmA=='])
    }
  ), { type: 'servers/STOP', id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==' });

  expect(state.toJS()).toEqual({
    itemsById: {
      'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==': {
        id: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
        name: 'Server name',
        port: 3000,
        expectations: [],
        type: 'http',
        queues: ['AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==']
      }
    },
    selected: 'AVn5T880aJDt/Sk2SBSBDtTSTNXMmA==',
    running: []
  });
});
