import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD as ADD_SERVER
} from '../servers/actions';
import { REMOVE as REMOVE_SCENE } from '../scenes/removeScene/actions';
import { ADD as ADD_SCENE } from '../scenes/addScene/actions';

describe('scenarios reducer', () => {
  test(`${ADD_SERVER} scene`, () => {
    const state = reducer(fromJS({}),
      { type: ADD_SERVER, id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

    expect(state.toJS()).toEqual({
      'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
        scenes: []
      }
    });
  });

  test(`${ADD_SCENE} scene`, () => {
    const state = reducer(fromJS({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        scenes: []
      }
    }), {
      type: ADD_SCENE,
      serverId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        scenes: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
      }
    });
  });

  test(`${REMOVE_SCENE} scene`, () => {
    const state = reducer(fromJS({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        scenes: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
      }
    }), {
      type: REMOVE_SCENE,
      serverId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      sceneId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        scenes: []
      }
    });
  });
});
