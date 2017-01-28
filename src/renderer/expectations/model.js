import { Record } from 'immutable';
import R from 'ramda';

export const HttpRequest = new Record({
  url: '',
  method: '',
  payload: null
});

export const HttpResponse = new Record({
  headers: {},
  type: '',
  body: null
});

export const HttpExpectation = new Record({
  id: '',
  type: '',
  request: new HttpRequest(),
  response: new HttpResponse()
});

export const WsExpectation = new Record({
  id: '',
  type: '',
  incomingMessage: '',
  responseMessage: ''
});

const createExpectation = (ex) => {
  switch (ex.type) {
    case 'http': {
      return R.construct(HttpExpectation)({
        id: ex.id,
        type: ex.type,
        request: ex.request,
        response: ex.response
      });
    }
    case 'ws': {
      return R.construct(WsExpectation)({
        id: ex.id,
        type: ex.type,
        incomingMessage: ex.incomingMessage,
        responseMessage: ex.responseMessage
      });
    }
    default: {
      return null;
    }
  }
};

export default createExpectation;
