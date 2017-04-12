import { Map, Record, List } from 'immutable';
import { ADD as ADD_SERVER } from '../servers/actions';
import { REMOVE as REMOVE_SCENE } from '../../scenes/removeScene/actions';
import { ADD as ADD_SCENE } from '../../scenes/addScene/actions';

const initialState = new Map();

const Scenario = new Record({
  scenes: new List()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVER: {
      const queue = new Scenario();
      return state.set(action.id, queue);
    }
    case ADD_SCENE: {
      return state.updateIn([action.serverId, 'scenes'], scenes => scenes.push(action.id));
    }
    case REMOVE_SCENE: {
      return state.updateIn([action.serverId, 'scenes'], (scenes) => {
        const sceneIndex =
          scenes.findIndex(sceneId => sceneId === action.sceneId);
        return scenes.delete(sceneIndex, 1);
      });
    }
    default: {
      return state;
    }
  }
};
