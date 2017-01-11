import unique from 'node-unique';
import HttpExpectation from './httpExpectation/Expectation';
import WsExpectation from './wsExpectation';

const types = {
  http: HttpExpectation,
  ws: WsExpectation
};
const expectations = [];

const add = (type, config) => {
  const id = unique();
  expectations[id] = {
    type,
    config
  };

  return id;
};

const create = (id) => {
  const { type, config } = expectations[id];
  return new types[type](id, config);
};

const get = id => expectations[id];

export default {
  add,
  get,
  create
};
