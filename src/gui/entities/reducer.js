import { actions, getInitialState, reducers } from './module';
import { RESTORE_STATE as APP_RESTORE_STATE } from '../appSync/actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { DID_SUCCEED as EDIT_SERVER_DID_SUCCEED } from '../servers/editServer/epics';
import { DID_SUCCEED as REMOVE_SERVER_DID_SUCCEED } from '../servers/removeServer/epics';
import { DID_SUCCEED as REMOVE_MOCK_DID_SUCCEED } from '../mocks/removeMock/epics';
import { REMOVE_AFTER_USE_MESSAGE_RECEIVED } from '../appSync/startAppSync';

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case actions.ADD_MOCK: {
      return reducers.addMock(state, action.scenario, action.id, action.params);
    }
    case actions.REMOVE_MOCK: {
      return reducers.removeMock(state, action.scenarioId, action.mockId);
    }
    case actions.FINISH_MOCK: {
      return state
        .setIn(['mocks', 'entities', action.id, 'running'], false)
        .setIn(['mocks', 'entities', action.id, 'finished'], true);
    }
    case actions.STOP_MOCK: {
      const { id } = action;
      const prevState = state.getIn(['mocks', 'entities', id]);
      return state.mergeIn(['mocks', 'entities', id], {
        running: false,
        lastDuration: Date.now() - prevState.get('lastRunTimestamp')
      });
    }
    case actions.RUN_MOCK: {
      const { id } = action;
      const prevState = state.getIn(['mocks', 'entities', id]);
      return state.mergeIn(['mocks', 'entities', id], {
        running: true,
        runCount: prevState.get('runCount') + 1,
        lastRunTimestamp: Date.now(),
        lastDuration: null
      });
    }
    case actions.ADD_TASK: {
      return reducers.addTask(state, action.mockId, action.taskId);
    }
    case actions.REMOVE_SCENARIO: {
      const { id } = action;
      return reducers.removeScenario(state, id);
    }
    case actions.ADD_SERVER: {
      return reducers.addServer(state, action.id, action.params);
    }
    case actions.START_SERVER: {
      return reducers.startServer(state, action.id);
    }
    case actions.STOP_SERVER: {
      return reducers.stopServer(state, action.id);
    }
    case actions.REMOVE_SERVER: {
      return reducers.removeServer(state, action.id);
    }
    case actions.UPDATE_SERVER: {
      return reducers.updateServer(state, action.id, action.params);
    }
    case actions.ADD_SCENARIO: {
      let newState = state;
      newState = reducers.addScenario(newState, action.server, { id: action.id });
      return newState;
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
    case actions.REMOVE_TASK: {
      return reducers.removeTask(state, action.mockId, action.taskId);
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
    case REMOVE_AFTER_USE_MESSAGE_RECEIVED: {
      return reducers.removeMock(state, action.scenario, action.id);
    }
    default: {
      return state;
    }
  }
};
