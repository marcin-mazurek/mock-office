import { Record, List } from 'immutable';

const Mock = new Record({
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

export default Mock;
