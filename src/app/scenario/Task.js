import unique from 'cuid';
import createSchedule from './createSchedule';

export default class Task {
  constructor(args) {
    this.id = unique();
    this.emitter = args.emitter.extend({ taskId: this.id });
    this.pending = false;
    this.scheduleDetails = args.scheduleDetails;
  }

  // Function -> Promise
  play(action) {
    if (this.pending) {
      return Promise.reject('Pending Task cant be played.');
    }

    return new Promise((resolve) => {
      const schedule = createSchedule(this.scheduleDetails);

      this.subscription = schedule(
        action,
        () => {
          this.emitter.emit('MOCK_PART_START');
        },
        () => {
          this.emitter.emit('MOCK_PART_END');
          this.pending = false;
          resolve(true);
        }
      );

      this.pending = true;

      this.stop = () => {
        this.subscription.unsubscribe();
        this.emitter.emit('MOCK_PART_CANCEL');
        this.pending = false;
        resolve(false);
      };
    });
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.stop();
    }
  }
}
