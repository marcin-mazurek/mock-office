import { Map, Record } from 'immutable';

const initialState = new Map({
  itemsById: new Map({}),
});

const Queue = new Record({
  request: {},
  responses: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case 'queues/ADD': {
      console.log('queue added');
      return state;
    }
    case 'queues/QUEUE_RESPONSE': {
      console.log('response queued');
      return state;
    }
    default: {
      return state;
    }
  }
};
