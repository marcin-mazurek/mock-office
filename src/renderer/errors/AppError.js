import { Record } from 'immutable';
import unique from 'node-unique';

const AppError = new Record({
  id: unique(),
  reason: ''
});

export default AppError;
