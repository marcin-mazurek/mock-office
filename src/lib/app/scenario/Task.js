import EventEmitter from 'events';
import unique from 'cuid';
import createSchedule from './createSchedule';

export default class Task extends EventEmitter {
  constructor(config) {
    super();
    this.id = unique();
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
      const runSchedule = createSchedule(this.schedule, this.params);

      this.subscription = runSchedule(
        action,
        () => {
          this.emit('start');
        },
        () => {
          this.emit('end');
          this.pending = false;
          resolve(true);
        }
      );

      this.pending = true;

      this.stop = () => {
        this.subscription.unsubscribe();
        this.emit('cancel');
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
