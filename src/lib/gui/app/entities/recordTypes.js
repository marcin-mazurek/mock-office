import { Record, List } from 'immutable';

export const Server = new Record({
  id: null,
  name: 'New Server',
  port: 3000,
  type: 'http',
  secure: false,
  scenario: null,
  running: false,
  behaviours: new List(),
  fallbackUrl: '',
  recordMode: false
});

export const Reaction = new Record({
  params: null,
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
});
