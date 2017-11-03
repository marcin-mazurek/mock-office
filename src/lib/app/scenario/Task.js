import EventEmitter from 'events';
import unique from 'cuid';
import run from './run';

export default class Task extends EventEmitter {
  constructor(config) {
    super();
    this.id = unique();
    this.pending = false;
    this.schedule = config.schedule || {};
    this.params = config.params || {};
  }

  // Function -> Observable or String
  play() {
    if (this.pending) {
      return 'Pending task cant be run';
    }

    const task$ = run(this.schedule, this.params);
    this.pending = true;
    this.emit('start');
    this.subscription = task$.subscribe({
      complete: () => {
        this.pending = false;
        this.stop = null;
        this.emit('end');
      }
    });

    return task$;
  }

  // void -> void
  cancel() {
    if (this.pending) {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      this.pending = false;
      this.emit('cancel');
    }
  }
}
