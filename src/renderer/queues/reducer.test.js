import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD_QUEUE,
  ADD_RESPONSE
} from './actions';

test(`${ADD_QUEUE} reducer`, () => {
  const state = reducer(fromJS({}), {
    type: 'queues/ADD_QUEUE',
    id: 'AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==',
    request: { url: '/some-url-3' }
  });

  expect(state.toJS()).toEqual({
    'AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==': {
      id: 'AVn5T+T4Hr9yIBIhRoyK6Hxhx13QiQ==',
      request: { url: '/some-url-3' },
      responses: []
    }
  });
});

test(`${ADD_RESPONSE} reducer`, () => {
  const state = reducer(fromJS({
    'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
      id: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      request: { url: '/some-url-3' },
      responses: []
    }
  }), {
    type: 'queues/ADD_RESPONSE',
    queueId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
    responseId: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
  });

  expect(state.toJS()).toEqual({
    'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
      id: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      request: { url: '/some-url-3' },
      responses: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
    }
  });
});
