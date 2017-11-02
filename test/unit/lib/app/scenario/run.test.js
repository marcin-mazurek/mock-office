import { Scheduler } from 'rxjs';
import run from '../../../../../src/lib/app/scenario/run';

describe('run', () => {
  expect(run({}, {})).toBeInstanceOf(Scheduler.asap);
});