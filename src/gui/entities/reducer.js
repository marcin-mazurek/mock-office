import { getInitialState, reducers } from './module';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../servers/addServer/epics';
import { SUCCEEDED as EDIT_SERVER_DID_SUCCEED } from '../servers/editServer/epics';
import { SUCCEEDED as REMOVE_SERVER_DID_SUCCEED } from '../servers/removeServer/epics';
import { DID_SUCCEED as REMOVE_MOCK_DID_SUCCEED } from '../mocks/removeMock/epics';
import {
  REMOVE_MOCK_MESSAGE_RECEIVED,
  STOP_MOCK_MESSAGE_RECEIVED,
  FINISH_MOCK_MESSAGE_RECEIVED,
  RUN_MOCK_MESSAGE_RECEIVED,
  RESTORE_STATE as APP_RESTORE_STATE
} from '../appSync/startAppSync';
import {
  SUCCEEDED as IMPORT_MOCKS_SUCCEEDED
} from '../mocks/importMock/epics';
import { SUCCEED as ADD_HTTP_MOCK_SUCCEED } from '../mocks/addMock/addHttpMock/epic';
import { SUCCEED as ADD_WS_MOCK_SUCCEED } from '../mocks/addMock/addWsMock/epic';
import { SUCCEEDED as START_SERVER_SUCCEED } from '../servers/startServer/startServer';
import { SUCCEEDED as STOP_SERVER_SUCCEED } from '../servers/stopServer/stopServer';

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
