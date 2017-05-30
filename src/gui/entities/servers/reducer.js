import { ADD, START, STOP, REMOVE, UPDATE } from './actions';
import { ADD as ADD_SCENARIO } from '../scenarios/actions';
import { SUCCEED as ADD_SERVER_SUCCEED } from '../../servers/addServer/epics';
import { getInitialState, reducers } from './module';
import { RESTORE_STATE as APP_RESTORE_STATE } from '../../appSync/actions';

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case ADD: {
      return reducers.addServer(state, action.id, action.params);
    }
    case START: {
      return reducers.startServer(state, action.id);
    }
    case STOP: {
      return reducers.stopServer(state, action.id);
    }
    case REMOVE: {
      return reducers.removeServer(state, action.id);
    }
    case UPDATE: {
      return reducers.updateServer(state, action.id, action.params);
    }
    case ADD_SCENARIO: {
      return reducers.addScenario(state, action.server, action.id);
    }
    case ADD_SERVER_SUCCEED: {
      const { params: { data } } = action;
      return reducers.addServer(state, data.id, data);
    }
    case APP_RESTORE_STATE: {
      const { servers } = action;
      let newState = state;

      servers.forEach((serverParams) => {
        newState = reducers.addServer(newState, serverParams.id, serverParams);
        newState = reducers.addScenario(newState, serverParams.id, serverParams.scenario);

        if (serverParams.running) {
          newState = reducers.startServer(newState, serverParams.id);
        }
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};
