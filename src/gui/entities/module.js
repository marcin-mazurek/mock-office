import { Map, List, Record } from 'immutable';
import { createSelector } from 'reselect';

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
    const tasks = state.getIn(['mocks', 'entities', id]).tasks;
    let newState = state;

    newState = newState
      .updateIn(['mocks', 'ids'], ids => ids.filter(mockId => mockId !== id))
      .deleteIn(['mocks', 'entities', id])
      .updateIn(['scenarios', 'entities', scenario, 'mocks'],
        mocks => mocks.filter(mock => mock !== id)
      );

    tasks.forEach((task) => {
      newState = newState
        .deleteIn(['tasks', 'entities', task])
        .updateIn(['tasks', 'ids'], ids => ids.filter(taskId => taskId !== task));
    });

    return newState;
  },
  removeTask(state, mock, id) {
    return state
      .updateIn(['tasks', 'ids'], ids => ids.filter(taskId => taskId !== id))
      .deleteIn(['tasks', 'entities', id])
      .updateIn(['mocks', 'entities', mock, 'tasks'], tasks => tasks.filter(taskId => taskId !== id));
  },
  stopMock(state, id) {
    const prevState = state.getIn(['mocks', 'entities', id]);
    return state.mergeIn(['mocks', 'entities', id], {
      running: false,
      lastDuration: Date.now() - prevState.get('lastRunTimestamp')
    });
  },
  finishMock(state, id) {
    return state
      .setIn(['mocks', 'entities', id, 'running'], false)
      .setIn(['mocks', 'entities', id, 'finished'], true);
  },
  runMock(state, id) {
    const prevState = state.getIn(['mocks', 'entities', id]);
    return state.mergeIn(['mocks', 'entities', id], {
      running: true,
      runCount: prevState.get('runCount') + 1,
      lastRunTimestamp: Date.now(),
      lastDuration: null
    });
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
