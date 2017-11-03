import { List, Map, fromJS } from 'immutable';
import { Server, Scenario } from './recordTypes';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../../epics/addServer/actions';
import { SUCCEEDED as EDIT_SERVER_SUCCEEDED } from '../../epics/editServer/actions';
import { SUCCEEDED as REMOVE_SERVER_SUCCEEDED } from '../../epics/removeServer/actions';
import { DID_SUCCEED as REMOVE_MOCK_DID_SUCCEED } from '../../epics/removeMock';
import {
  REMOVE_MOCK_MESSAGE_RECEIVED,
  STOP_MOCK_MESSAGE_RECEIVED,
  FINISH_MOCK_MESSAGE_RECEIVED,
  RUN_MOCK_MESSAGE_RECEIVED,
  CANCEL_MOCK_MESSAGE_RECEIVED
} from '../../appSync/actions';
import { SUCCEEDED as IMPORT_MOCKS_SUCCEEDED } from '../../epics/importMock';
import { SUCCEED as ADD_MOCK_SUCCEED } from '../../epics/addMock';
import { SUCCEEDED as START_SERVER_SUCCEED } from '../../epics/startServer/actions';
import { SUCCEEDED as STOP_SERVER_SUCCEED } from '../../epics/stopServer/actions';
import { SUCCEEDED as LOAD_STATE_ON_APP_START } from '../../epics/loadStateOnStart/actions';

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
    let newState = state;
    const scenario = state.getIn(['servers', 'entities', id, 'scenario']);
    newState = reducers.removeScenario(newState, scenario);

    newState = state.updateIn(['servers', 'ids'], ids => ids.filter(serverId => serverId !== id));
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
    const mock = fromJS(Object.assign(
      {
        id,
        expired: false
      },
      Object.assign({}, params, { tasks: new List() })
    ));

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
        fromJS(Object.assign({ id }, task))
      );
  },
  removeScenario(state, id) {
    const mocks = state.getIn(['scenarios', 'entities', id, 'mocks']);
    let newState = state;

    newState = mocks.reduce((acc, next) => reducers.removeMock(acc, id, next), newState);
    newState
      .updateIn(['scenarios', 'ids'], ids => ids.filter(scenarioId => scenarioId !== id))
      .deleteIn(['scenarios', 'entities', id]);

    return newState;
  },
  removeMock(state, scenario, id) {
    const tasks = state.getIn(['mocks', 'entities', id, 'tasks']);
    let newState = state;

    newState = tasks.reduce((acc, next) => reducers.removeTask(acc, id, next), newState);
    newState = newState
      .updateIn(['mocks', 'ids'], ids => ids.filter(mockId => mockId !== id))
      .deleteIn(['mocks', 'entities', id])
      .updateIn(['scenarios', 'entities', scenario, 'mocks'], m => m.filter(mId => mId !== id));

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
      pending: false,
      lastDuration: Date.now() - prevState.get('lastRunTimestamp')
    });
  },
  finishMock(state, id) {
    let newState = state
      .setIn(['mocks', 'entities', id, 'pending'], false);

    const mock = state.getIn(['mocks', 'entities', id]);
    newState = newState.updateIn(['mocks', 'entities', id, 'runCounter'], runCounter => runCounter + 1);
    if (mock.get('runCounter') === mock.get('loadedCounter')) {
      newState = newState.setIn(['mocks', 'entities', id, 'expired'], true);
    }

    return newState;
  },
  runMock(state, id) {
    return state.mergeIn(['mocks', 'entities', id], {
      pending: true
    });
  }
};

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case CANCEL_MOCK_MESSAGE_RECEIVED:
    case STOP_MOCK_MESSAGE_RECEIVED: {
      const { id } = action;
      return reducers.stopMock(state, id);
    }
    case FINISH_MOCK_MESSAGE_RECEIVED: {
      const { id } = action;
      return reducers.finishMock(state, id);
    }
    case RUN_MOCK_MESSAGE_RECEIVED: {
      const { id } = action;
      return reducers.runMock(state, id);
    }
    case ADD_SERVER_SUCCEED: {
      const { params: { data } } = action;
      let newState = state;
      newState = reducers.addServer(newState, data.id, data);
      newState = reducers.addScenario(newState, data.id, { id: data.scenario });
      return newState;
    }
    case EDIT_SERVER_SUCCEEDED: {
      return reducers.updateServer(state, action.result.id, action.result);
    }
    case LOAD_STATE_ON_APP_START: {
      const { servers } = action;
      let newState = state;

      servers.forEach((serverParams) => {
        newState = reducers.addServer(newState, serverParams.id, serverParams);
        if (serverParams.running) {
          newState = reducers.startServer(newState, serverParams.id);
        }

        newState = reducers.addScenario(newState, serverParams.id, { id: serverParams.scenario });

        serverParams.mocks.forEach((mock) => {
          newState = reducers.addMock(newState, serverParams.scenario, mock.id, mock);

          mock.tasks.forEach((task) => {
            newState = reducers.addTask(newState, mock.id, task.id, task);
          });
        });
      });

      return newState;
    }
    case REMOVE_SERVER_SUCCEEDED: {
      let newState = state;
      const { id } = action;
      const server = state.getIn(['servers', 'entities', id]);
      newState = reducers.removeServer(newState, server.id);

      return newState;
    }
    case REMOVE_MOCK_DID_SUCCEED: {
      return reducers.removeMock(state, action.scenario, action.id);
    }
    case REMOVE_MOCK_MESSAGE_RECEIVED: {
      return reducers.removeMock(state, action.scenario, action.id);
    }
    case IMPORT_MOCKS_SUCCEEDED: {
      const { mocks, scenario } = action;
      let newState = state;
      mocks.forEach((mock) => {
        newState = reducers.addMock(
          newState,
          scenario,
          mock.id,
          mock
        );

        mock.tasks.forEach((task) => {
          newState = reducers.addTask(newState, mock.id, task.id, task);
        });
      });
      return newState;
    }
    case ADD_MOCK_SUCCEED: {
      const { mock, scenario } = action;
      let newState = state;
      newState = reducers.addMock(
        newState,
        scenario,
        mock.id,
        mock
      );
      mock.tasks.forEach((task) => {
        newState = reducers.addTask(newState, mock.id, task.id, task);
      });
      return newState;
    }
    case START_SERVER_SUCCEED: {
      return reducers.startServer(state, action.id);
    }
    case STOP_SERVER_SUCCEED: {
      return reducers.stopServer(state, action.id);
    }
    default: {
      return state;
    }
  }
};
