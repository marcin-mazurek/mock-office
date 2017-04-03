import { fromJS } from 'immutable';
import reducer from './reducer';
import { ADD } from '../scenes/addScene/actions';

describe('scenes reducer', () => {
  test(`${ADD}`, () => {
    const state = reducer(fromJS({
      ids: [],
      entities: {}
    }), {
      type: ADD,
      id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
      parts: [
        {
          id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
          interval: null,
          reuse: null,
          quantity: null,
          title: '',
          delay: null,
          requirements: null
        }
      ]
    });

    expect(state.toJS()).toEqual({
      entities: {
        'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==': {
          id: 'AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==',
          interval: null,
          reuse: null,
          quantity: null,
          title: '',
          delay: null,
          requirements: null
        }
      },
      ids: ['AVn5d/fWdqw6Cki7TYu1mFutjHiDEQ==']
    });
  });
});
