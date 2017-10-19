import { Record, List } from 'immutable';

export const Mock = new Record({
  id: '',
  interval: null,
  reuse: null,
  count: null,
  delay: null,
  requirements: null,
  tasks: new List(),
  finished: false,
  pending: false
});
export const Scenario = new Record({
  id: '',
  mocks: new List()
});
export const Server = new Record({
  id: null,
  name: 'New Server',
  port: 3000,
  type: 'http',
  secure: false,
  scenario: null,
  running: false
});
export const Task = new Record({
  params: null,
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
});
