import { List, Map } from 'immutable';
import { Server, Scenario, Mock, Task } from './recordTypes';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../../servers/addServer/epics';
import { SUCCEEDED as EDIT_SERVER_DID_SUCCEED } from '../../servers/editServer/epics';
import { SUCCEEDED as REMOVE_SERVER_DID_SUCCEED } from '../../servers/removeServer/epics';
import { DID_SUCCEED as REMOVE_MOCK_DID_SUCCEED } from '../../mocks/removeMock/epics';
import {
  REMOVE_MOCK_MESSAGE_RECEIVED,
  STOP_MOCK_MESSAGE_RECEIVED,
  FINISH_MOCK_MESSAGE_RECEIVED,
  RUN_MOCK_MESSAGE_RECEIVED,
  RESTORE_STATE as APP_RESTORE_STATE
} from '../../appSync/startAppSync';
import {
  SUCCEEDED as IMPORT_MOCKS_SUCCEEDED
} from '../../modules/importMock/epics';
import { SUCCEED as ADD_HTTP_MOCK_SUCCEED } from '../../modules/addHttpMock/epic';
import { SUCCEED as ADD_WS_MOCK_SUCCEED } from '../../modules/addWsMock/epic';
import { SUCCEEDED as START_SERVER_SUCCEED } from '../../servers/startServer/startServer';
import { SUCCEEDED as STOP_SERVER_SUCCEED } from '../../servers/stopServer/index';

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
        new Task(
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

export default (state = getInitialState(), action) => {
  switch (action.type) {
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
    case EDIT_SERVER_DID_SUCCEED: {
      return reducers.updateServer(state, action.result.id, action.result);
    }
    case APP_RESTORE_STATE: {
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
    case REMOVE_SERVER_DID_SUCCEED: {
      let newState = state;
      const { id } = action;
      const server = state.getIn(['servers', 'entities', id]);
      const scenario = state.getIn(['scenarios', 'entities', server.scenario]);
      const mocks = scenario.mocks;

      newState = reducers.removeServer(newState, server.id);
      newState = reducers.removeScenario(newState, scenario);
      mocks.forEach((mockId) => {
        const tasks = state.getIn(['mocks', 'entities', mockId]).tasks;
        newState = reducers.removeMock(newState, scenario, mockId);
        tasks.forEach((taskId) => {
          newState = reducers.removeTask(newState, mockId, taskId);
        });
      });

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
    case ADD_HTTP_MOCK_SUCCEED:
    case ADD_WS_MOCK_SUCCEED: {
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
