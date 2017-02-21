import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD as ADD_SERVER
} from '../servers/actions';
import { REMOVE as REMOVE_TASK } from '../tasks/removeTask/actions';
import { ADD as ADD_TASK } from '../tasks/addTask/actions';

test(`${ADD_SERVER} reducer`, () => {
  const state = reducer(fromJS({}),
    { type: ADD_SERVER, queueId: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

  expect(state.toJS()).toEqual({
    'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
      id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==',
      tasks: []
    }
  });
});

test(`${ADD_TASK} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
      id: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      requirements: { url: '/some-url-3' },
      tasks: []
    }
  }), {
    type: ADD_TASK,
    queueId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
    taskId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
      id: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      requirements: { url: '/some-url-3' },
      tasks: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
    }
  });
});

test(`${REMOVE_TASK} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
      id: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      tasks: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
    }
  }), {
    type: REMOVE_TASK,
    queueId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
    taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
      id: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      tasks: []
    }
  });
});
