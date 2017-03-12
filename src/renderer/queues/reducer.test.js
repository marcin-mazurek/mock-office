import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD as ADD_SERVER
} from '../servers/actions';
import { REMOVE as REMOVE_TASK } from '../tasks/removeTask/actions';
import { ADD as ADD_TASK } from '../tasks/addTask/actions';

describe('queues reducer', () => {
  test(`${ADD_SERVER} action`, () => {
    const state = reducer(fromJS({}),
      { type: ADD_SERVER, id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

    expect(state.toJS()).toEqual({
      'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
        tasks: []
      }
    });
  });

  test(`${ADD_TASK} action`, () => {
    const state = reducer(fromJS({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        tasks: []
      }
    }), {
      type: ADD_TASK,
      serverId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      taskId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        tasks: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
      }
    });
  });

  test(`${REMOVE_TASK} action`, () => {
    const state = reducer(fromJS({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        tasks: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
      }
    }), {
      type: REMOVE_TASK,
      serverId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        tasks: []
      }
    });
  });
});
