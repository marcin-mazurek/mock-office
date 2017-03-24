import { fromJS } from 'immutable';
import reducer from './reducer';
import {
  ADD as ADD_SERVER
} from '../servers/actions';
import { REMOVE as REMOVE_DESCRIPTION } from '../descriptions/removeDescription/actions';
import { ADD as ADD_DESCRIPTION } from '../descriptions/addDescription/actions';

describe('queues reducer', () => {
  test(`${ADD_SERVER} action`, () => {
    const state = reducer(fromJS({}),
      { type: ADD_SERVER, id: 'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==' });

    expect(state.toJS()).toEqual({
      'AVoPUwib8A1waDvCQ0id6T1QcfLxWQ==': {
        descriptions: []
      }
    });
  });

  test(`${ADD_DESCRIPTION} action`, () => {
    const state = reducer(fromJS({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        descriptions: []
      }
    }), {
      type: ADD_DESCRIPTION,
      serverId: 'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==',
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5d/fFT13LWVVYQzKEVy1VkdW4vQ==': {
        descriptions: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
      }
    });
  });

  test(`${REMOVE_DESCRIPTION} action`, () => {
    const state = reducer(fromJS({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        descriptions: ['AVn5tu8eSu3b1GmqQvG+5cDaoORotQ==']
      }
    }), {
      type: REMOVE_DESCRIPTION,
      serverId: 'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==',
      descriptionId: 'AVn5tu8eSu3b1GmqQvG+5cDaoORotQ=='
    });

    expect(state.toJS()).toEqual({
      'AVn5tu8PHaWCyc49SEGSLn90iT+ZFQ==': {
        descriptions: []
      }
    });
  });
});
