import { Record, List } from 'immutable';

export const Mock = new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  tasks: new List(),
  finished: false,
  running: false,
  runCount: 0,
  lastRunTimestamp: null,
  lastDuration: null
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
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null
});
