import { Map, List } from 'immutable';
import { REMOVE, FINISH } from '../../scenes/removeScene/actions';
import { ADD } from '../../scenes/addScene/actions';
import { RUN, STOP } from '../../scenes/runScene/actions';
import Scene from './Scene';

const initialState = new Map();

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      const { id } = action;
      const sceneConfig = Object.keys(action).reduce((acc, next) => {
        const cfg = acc;
        if (action[next]) {
          cfg[next] = action[next];
        }

        return cfg;
      }, {});
      if (sceneConfig.parts) {
        sceneConfig.parts = new List(sceneConfig.parts.map(part => part.id));
      }
      const scene = new Scene(sceneConfig);

      return state.set(id, scene);
    }
    case REMOVE: {
      return state.remove(action.sceneId);
    }
    case FINISH: {
      return state.setIn([action.sceneId, 'finished'], true);
    }
    case STOP: {
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: false,
        lastDuration: Date.now() - prevState.get('lastRunTimestamp')
      });
    }
    case RUN: {
      const prevState = state.get(action.taskId);
      return state.mergeIn([action.taskId], {
        running: true,
        runCount: prevState.get('runCount') + 1,
        lastRunTimestamp: Date.now(),
        lastDuration: null
      });
    }
    default: {
      return state;
    }
  }
};
