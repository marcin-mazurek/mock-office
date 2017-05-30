import { Map, List, Record } from 'immutable';
import { createSelector } from 'reselect';

const ADD_MOCK = 'entities/ADD_MOCK';
const REMOVE_MOCK = 'entities/REMOVE_MOCK';
const FINISH_MOCK = 'entities/FINISH_MOCK';
const REMOVE_AFTER_USE_MOCK = 'entities/REMOVE_AFTER_USE_MOCK';
const RUN_MOCK = 'entities/RUN_MOCK';
const STOP_MOCK = 'entities/STOP_MOCK';
const ADD_SCENARIO = 'entities/ADD_SCENARIO';
const REMOVE_SCENARIO = 'entities/REMOVE_SCENARIO';
const ADD_SERVER = 'entities/ADD_SERVER';
const START_SERVER = 'entities/START_SERVER';
const STOP_SERVER = 'entities/STOP_SERVER';
const REMOVE_SERVER = 'entities/REMOVE_SERVER';
const UPDATE_SERVER = 'entities/UPDATE_SERVER';
const ADD_TASK = 'entities/ADD_TASK';
const REMOVE_TASK = 'entities/REMOVE_TASK';

const addMockAction = (scenario, id, params) => ({
  type: ADD_MOCK,
  id,
  scenario,
  params
});

const finishMockAction = (scenarioId, mockId) => ({
  type: FINISH_MOCK,
  scenarioId,
  mockId
});

const removeMockAction = (scenarioId, mockId) => ({
  type: REMOVE_MOCK,
  scenarioId,
  mockId
});

const removeAfterUseMockAction = (scenario, id, tasks) => ({
  type: REMOVE_AFTER_USE_MOCK,
  scenario,
  id,
  tasks
});

const runMockAction = id => ({
  type: RUN_MOCK,
  id
});

const stopMockAction = id => ({
  type: STOP_MOCK,
  id
});

const addScenarioAction = (server, id) => ({
  type: ADD_SCENARIO,
  server,
  id
});

const removeScenarioAction = id => ({
  type: REMOVE_SCENARIO,
  id
});

const addServerAction = (id, params) => ({
  type: ADD_SERVER,
  params,
  id
});

const startServerAction = id => ({
  type: START_SERVER,
  id
});

const stopServerAction = id => ({
  type: STOP_SERVER,
  id
});

const removeServerAction = id => ({
  type: REMOVE_SERVER,
  id
});

const updateServerAction = (id, params) => ({
  type: UPDATE_SERVER,
  id,
  params
});

const addTaskAction = (mockId, taskId, params) => ({
  type: ADD_TASK,
  mockId,
  taskId,
  params
});

const removeTaskAction = (mockId, taskId) => ({
  type: REMOVE_TASK,
  mockId,
  taskId
});
export const actions = {
  ADD_MOCK,
  REMOVE_MOCK,
  FINISH_MOCK,
  REMOVE_AFTER_USE_MOCK,
  RUN_MOCK,
  STOP_MOCK,
  ADD_SCENARIO,
  REMOVE_SCENARIO,
  ADD_SERVER,
  START_SERVER,
  STOP_SERVER,
  REMOVE_SERVER,
  UPDATE_SERVER,
  ADD_TASK,
  REMOVE_TASK
};
export const actionCreators = {
  addMockAction,
  finishMockAction,
  removeMockAction,
  removeAfterUseMockAction,
  runMockAction,
  stopMockAction,
  addScenarioAction,
  removeScenarioAction,
  addServerAction,
  startServerAction,
  stopServerAction,
  removeServerAction,
  updateServerAction,
  addTaskAction,
  removeTaskAction
};

const Mock = new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  tasks: new List(),
  finished: false,
  running: false,
  runCount: 0,
  lastRunTimestamp: null,
  lastDuration: null
});
const Scenario = new Record({
  id: '',
  mocks: new List()
});
const Server = new Record({
  id: null,
  name: 'New Server',
  port: 3000,
  type: 'http',
  secure: false,
  scenario: null,
  running: false
});
const Task = new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null
});
export const types = {
  Mock,
  Scenario,
  Task,
  Server
};

export const getInitialState = () => new Map({
  servers: new Map({
    ids: new List(),
    entities: new Map()
  }),
  tasks: new Map({
    ids: new List(),
    entities: new Map()
  }),
  mocks: new Map({
    ids: new List(),
    entities: new Map()
  }),
  scenarios: new Map({
    ids: new List(),
    entities: new Map()
  })
});

export const reducers = {
  addServer(state, id, params) {
    const server = new Server({
      id,
      name: params.name,
      port: params.port,
      type: params.type,
      secure: params.secure,
      scenario: params.scenario
    });

    return state
      .setIn(['servers', 'entities', server.id], server)
      .updateIn(['servers', 'ids'], ids => ids.push(server.id));
  },
  startServer(state, id) {
    return state.setIn(['servers', 'entities', id, 'running'], true);
  },
  stopServer(state, id) {
    return state.setIn(['servers', 'entities', id, 'running'], false);
  },
  removeServer(state, id) {
    let newState = state.updateIn(
      ['servers', 'ids'],
      ids => ids.filter(serverId => serverId !== id)
    );
    newState = newState.deleteIn(['servers', 'entities', id]);
    return newState;
  },
  updateServer(state, id, params) {
    return state.setIn(
      ['servers', 'entities', id],
      new Server(Object.assign({ id, }, params))
    );
  },
  addScenario(state, serverId, scenarioParams) {
    const scenario = new Scenario(scenarioParams);

    return state
      .setIn(['scenarios', 'entities', scenario.id], scenario)
      .updateIn(['scenarios', 'ids'], ids => ids.push(scenario.id))
      .setIn(['servers', 'entities', serverId, 'scenario'], scenario.id);
  },
  addMock(state, scenario, id, params) {
    const mock = new Mock(
      Object.assign(
        { id },
        Object.assign({}, params, { tasks: new List() })
      )
    );

    return state
      .setIn(['mocks', 'entities', id], mock)
      .updateIn(['mocks', 'ids'], ids => ids.push(id))
      .updateIn(['scenarios', 'entities', scenario, 'mocks'], mocks => mocks.push(id));
  },
  addTask(state, mock, id, task) {
    return state
      .updateIn(['mocks', 'entities', mock, 'tasks'], tasks => tasks.push(id))
      .updateIn(['tasks', 'ids'], ids => ids.push(id))
      .setIn(
        ['tasks', 'entities', id],
        new types.Task(
          Object.assign({ id }, task)
        )
      );
  },
  removeScenario(state, id) {
    return state
      .updateIn(['scenarios', 'ids'], ids => ids.filter(scenarioId => scenarioId !== id))
      .deleteIn(['scenarios', 'entities', id]);
  },
  removeMock(state, scenario, id) {
    return state
      .update('ids', ids => ids.filter(mockId => mockId !== id))
      .deleteIn(['mocks', 'entities', id])
      .updateIn(['mocks', 'entities', scenario, 'mocks'],
        mocks => mocks.filter(mock => mock !== id)
      );
  },
  removeTask(state, mock, id) {
    return state
      .updateIn(['tasks', 'ids'], ids => ids.filter(taskId => taskId !== id))
      .deleteIn(['tasks', 'entities', id])
      .updateId(['mocks', 'entities', mock, 'tasks'], tasks => tasks.filter(taskId => taskId !== id));
  }
};

const entitySelector = (state, id) => state.getIn(['entities', 'entities', id]);
const serverSelector = (state, id) => state.getIn(['entities', 'servers', 'entities', id]);
const mockSelector = (state, id) => state.getIn(['entities', 'mocks', 'entities', id]);
const taskSelector = (state, id) => state.getIn(['entities', 'tasks', 'entities', id]);
const scenarioSelector = (state, id) => state.getIn(['entities', 'scenarios', 'entities', id]);
const allServersSelector = createSelector(
  state => state.getIn(['entities', 'servers', 'ids']),
  state => state.getIn(['entities', 'servers', 'entities']),
  (ids, entities) =>
    ids
      .map(id => entities.get(id))
      .filter(entity => entity instanceof Server)
);

export const selectors = {
  entitySelector,
  serverSelector,
  mockSelector,
  taskSelector,
  scenarioSelector,
  allServersSelector
};
