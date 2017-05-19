import { Record } from 'immutable';

export default new Record({
  id: null,
  name: 'New Server',
  port: 3000,
  type: 'http',
  secure: false,
  scenario: null,
  running: false
});
