import unique from 'cuid';
import createSchedule from './createSchedule';

export default class Task {
  constructor(config, emitter) {
    this.id = unique();
    this.emitter = emitter.extend({ taskId: this.id });
    this.pending = false;
    this.schedule = config.schedule || {};
    this.params = config.params || {};
  }

  // Function -> Promise
  play(action) {
    if (this.pending) {
      return Promise.reject('Pending Task cant be played.');
    }

    return new Promise((resolve) => {
      const schedule = createSchedule(this.schedule, this.params);

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
