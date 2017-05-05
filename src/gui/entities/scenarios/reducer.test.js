import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD as ADD_SERVER
} from '../servers/actions';
import { REMOVE as REMOVE_MOCK } from '../../mocks/removeMock/actions';
import { ADD as ADD_MOCK } from '../../mocks/addMock/actions';

describe('scenarios reducer', () => {
  test(`${ADD_SERVER} mock`, () => {
    const state = reducer(fromJS({}),
      { type: ADD_SERVER, id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

    expect(state.toJS()).toEqual({
      'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
        mocks: []
      }
    });
  });

  test(`${ADD_MOCK} mock`, () => {
    const state = reducer(fromJS({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        mocks: []
      }
    }), {
      type: ADD_MOCK,
      serverId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        mocks: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
      }
    });
  });

  test(`${REMOVE_MOCK} mock`, () => {
    const state = reducer(fromJS({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        mocks: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
      }
    }), {
      type: REMOVE_MOCK,
      serverId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      mockId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        mocks: []
      }
    });
  });
});
