import { Map, Record, List } from 'immutable';
import { REMOVE, FINISH } from './removeScene/actions';
import { ADD } from './addScene/actions';
import { RUN, STOP } from './runScene/actions';

const initialState = new Map();
const Scene = new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  parts: new List(),
  finished: false,
  running: false,
  runCount: 0,
  lastRunTimestamp: null,
  lastDuration: null
});

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
