import { Record, List } from 'immutable';

export default new Record({
  title: '',
  id: '',
  interval: null,
  reuse: null,
  quantity: null,
  delay: null,
  requirements: null,
  parts: new List(),
  finished: false,
  running: false,
  runCount: 0,
  lastRunTimestamp: null,
  lastDuration: null
});
