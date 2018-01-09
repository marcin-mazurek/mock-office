import { List, Map, fromJS } from 'immutable';
import { Server } from './recordTypes';
import { SUCCEEDED as ADD_SERVER_SUCCEED } from '../../epics/addServer/actions';
import { SUCCEEDED as EDIT_SERVER_SUCCEEDED } from '../../epics/editServer/actions';
import { SUCCEEDED as REMOVE_SERVER_SUCCEEDED } from '../../epics/removeServer/actions';
import { SUCCEEDED as REMOVE_BEHAVIOUR_DID_SUCCEED } from '../../epics/removeBehaviour';
import {
  REACTIONS_ENDED,
  REACTIONS_DID_RUN_ACTION,
  REACTIONS_CANCELLED
} from '../../epics/syncWithApp/actions';
import { SUCCEEDED as IMPORT_BEHAVIOURS_SUCCEEDED } from '../../epics/importBehaviour';
import { SUCCEED as ADD_BEHAVIOUR_SUCCEED } from '../../epics/addBehaviour/actions';
import { SUCCEEDED as START_SERVER_SUCCEED } from '../../epics/startServer/actions';
import { SUCCEEDED as STOP_SERVER_SUCCEED } from '../../epics/stopServer/actions';
import { SUCCEEDED as LOAD_STATE_ON_APP_START } from '../../epics/loadStateOnStart/actions';
import { SUCCEEDED as TRIGGER_RECORD_MODE_SUCCEEDED } from '../../epics/triggerRecordMode/actions';
import { SUCCEEDED as IMPORT_STATE_SUCCEEDED } from '../../epics/importState/actions';

export const getInitialState = () => new Map({
  servers: new Map({
    ids: new List(),
    entities: new Map()
  }),
  reactions: new Map({
    ids: new List(),
    entities: new Map()
  }),
  behaviours: new Map({
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
      fallbackUrl: params.fallbackUrl,
      recordMode: params.recordMode
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

    newState = state.updateIn(['servers', 'ids'], ids => ids.filter(serverId => serverId !== id));
    newState = newState.deleteIn(['servers', 'entities', id]);
    return newState;
  },
  updateServer(state, id, params) {
    return state.setIn(
      ['servers', 'entities', id],
      new Server(Object.assign({ id }, params))
    );
  },
  addBehaviour(state, serverId, params) {
    const behaviour = fromJS(Object.assign(
      { expired: false },
      Object.assign({}, params, { reactions: new List() })
    ));

    return state
      .setIn(['behaviours', 'entities', params.id], behaviour)
      .updateIn(['behaviours', 'ids'], ids => ids.push(params.id))
      .updateIn(['servers', 'entities', serverId, 'behaviours'], behaviours => behaviours.push(params.id));
  },
  addReaction(state, behaviourId, reaction) {
    return state
      .updateIn(['behaviours', 'entities', behaviourId, 'reactions'], reactions => reactions.push(reaction.id))
      .updateIn(['reactions', 'ids'], ids => ids.push(reaction.id))
      .setIn(
        ['reactions', 'entities', reaction.id],
        fromJS(reaction)
      );
  },
  removeBehaviour(state, serverId, behaviourId) {
    const reactions = state.getIn(['behaviours', 'entities', behaviourId, 'reactions']);
    let newState = state;

    newState = reactions
    .reduce(
      (acc, next) => reducers.removeReaction(acc, behaviourId, next),
      newState
    );
    newState = newState
      .updateIn(['behaviours', 'ids'], ids => ids.filter(id => id !== behaviourId))
      .deleteIn(['behaviours', 'entities', behaviourId])
      .updateIn(['servers', 'entities', serverId, 'behaviours'], m => m.filter(mId => mId !== behaviourId));

    return newState;
  },
  removeReaction(state, behaviour, id) {
    return state
      .updateIn(['reactions', 'ids'], ids => ids.filter(reactionId => reactionId !== id))
      .deleteIn(['reactions', 'entities', id])
      .updateIn(['behaviours', 'entities', behaviour, 'reactions'], reactions => reactions.filter(reactionId => reactionId !== id));
  },
  cancelReactions(state, id) {
    const prevState = state.getIn(['behaviours', 'entities', id]);
    return state.mergeIn(['behaviours', 'entities', id], {
      pending: false,
      lastDuration: Date.now() - prevState.get('lastRunTimestamp')
    });
  },
  endReactions(state, id) {
    let newState = state
      .setIn(['behaviours', 'entities', id, 'pending'], false);

    const behaviour = state.getIn(['behaviours', 'entities', id]);
    newState = newState.updateIn(['behaviours', 'entities', id, 'runCounter'], runCounter => runCounter + 1);
    if (behaviour.get('runCounter') === behaviour.get('loadedCounter')) {
      newState = newState.setIn(['behaviours', 'entities', id, 'expired'], true);
    }

    return newState;
  },
  runBehaviour(state, id) {
    return state.mergeIn(['behaviours', 'entities', id], {
      pending: true
    });
  }
};

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case REACTIONS_CANCELLED: {
      const { id } = action;
      return reducers.cancelReactions(state, id);
    }
    case REACTIONS_ENDED: {
      const { id } = action;
      return reducers.endReactions(state, id);
    }
    case REACTIONS_DID_RUN_ACTION: {
      const { id } = action;
      return reducers.runBehaviour(state, id);
    }
    case ADD_SERVER_SUCCEED: {
      const { payload } = action;
      let newState = state;
      newState = reducers.addServer(newState, payload.id, payload);
      return newState;
    }
    case EDIT_SERVER_SUCCEEDED: {
      return reducers.updateServer(state, action.result.id, action.result);
    }
    case IMPORT_STATE_SUCCEEDED:
    case LOAD_STATE_ON_APP_START: {
      const { servers } = action;
      let newState = getInitialState();

      servers.forEach((serverParams) => {
        newState = reducers.addServer(newState, serverParams.id, serverParams);
        if (serverParams.running) {
          newState = reducers.startServer(newState, serverParams.id);
        }

        serverParams.behaviours.forEach((behaviour) => {
          newState = reducers.addBehaviour(newState, serverParams.id, behaviour);

          behaviour.reactions.forEach((reaction) => {
            newState = reducers.addReaction(newState, behaviour.id, reaction);
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
    case REMOVE_BEHAVIOUR_DID_SUCCEED: {
      return reducers.removeBehaviour(state, action.serverId, action.behaviourId);
    }
    case IMPORT_BEHAVIOURS_SUCCEEDED: {
      const { behaviours, serverId } = action;
      let newState = state;
      behaviours.forEach((behaviour) => {
        newState = reducers.addBehaviour(newState, serverId, behaviour);

        behaviour.reactions.forEach((reaction) => {
          newState = reducers.addReaction(newState, behaviour.id, reaction);
        });
      });
      return newState;
    }
    case ADD_BEHAVIOUR_SUCCEED: {
      const { behaviour, serverId } = action;
      let newState = state;
      newState = reducers.addBehaviour(
        newState,
        serverId,
        behaviour
      );
      behaviour.reactions.forEach((reaction) => {
        newState = reducers.addReaction(newState, behaviour.id, reaction);
      });
      return newState;
    }
    case START_SERVER_SUCCEED: {
      return reducers.startServer(state, action.id);
    }
    case STOP_SERVER_SUCCEED: {
      return reducers.stopServer(state, action.id);
    }
    case TRIGGER_RECORD_MODE_SUCCEEDED: {
      return reducers.updateServer(state, action.result.id, action.result);
    }
    default: {
      return state;
    }
  }
};
