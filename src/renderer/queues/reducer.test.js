import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD_QUEUE,
  ADD_RESPONSE,
  REMOVE_RESPONSE
} from './actions';

test(`${ADD_QUEUE} reducer`, () => {
  const state = reducer(fromJS({}),
    { type: 'queues/ADD_QUEUE', id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

  expect(state.toJS()).toEqual({
    'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
      id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==',
      tasks: []
    }
  });
});

test(`${ADD_RESPONSE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
      id: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      requirements: { url: '/some-url-3' },
      tasks: []
    }
  }), {
    type: 'queues/ADD_RESPONSE',
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

test(`${REMOVE_RESPONSE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
      id: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      requirements: { url: '/some-url-3' },
      tasks: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
    }
  }), {
    type: 'queues/REMOVE_RESPONSE',
    queueId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
    taskId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
      id: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      requirements: { url: '/some-url-3' },
      tasks: []
    }
  });
});
