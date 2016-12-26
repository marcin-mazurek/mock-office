import unique from 'node-unique';
import HttpExpectation from './httpExpectation/Expectation';

const types = {
  http: HttpExpectation
};
const expectations = [];

const add = (type, config) => {
  const Exp = types[type];
  const id = unique();
  expectations[id] = new Exp(config);

  return id;
};

const get = id => expectations[id];

export default {
  add,
  get
};
