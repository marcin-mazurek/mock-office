import { Record } from 'immutable';
import unique from 'node-unique';

const AppErrorRecord = new Record({
  id: '',
  reason: ''
});

const AppError = function createError(reason) {
  return new AppErrorRecord({ id: unique(), reason });
};

export default AppError;
