import unique from 'node-unique';
import HttpExpectation from './httpExpectation/Expectation';

const types = {
  http: HttpExpectation
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
  return new types[type](config);
};

const get = id => expectations[id];

export default {
  add,
  get,
  create
};
