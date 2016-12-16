import mocksReducer from '../mocks';
import routingReducer from './utils';
import serversReducer from '../servers/reducer';

export default {
  mocks: mocksReducer,
  routing: routingReducer,
  servers: serversReducer
};
