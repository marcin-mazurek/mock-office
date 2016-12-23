import { Expectation as HttpExpectation } from './httpExpectation';

const types = {
  http: HttpExpectation
};
const expectations = [];

const add = (type, config) => {
  const Exp = types[type];

  expectations.push(new Exp(config));
};

export default {
  add
};
