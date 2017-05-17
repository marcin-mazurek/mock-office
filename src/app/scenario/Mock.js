import unique from 'cuid';
import Task from './Task';

export default class Mock {
  constructor(args) {
    this.title = args.title;
    this.requirements = args.requirements;
    this.id = unique();
    this.emitter = args.emitter.extend({ mockId: this.id });
    this.tasks = [];
    this.pending = false;
    this.reuse = args.reuse;
    this.quantity = args.quantity || 0;
    this.tasks = args.tasks.map(
      partConfig => new Task(
        {
          scheduleDetails: partConfig,
          emitter: this.emitter
        }
      )
    );
  }

  // void -> void
  updateReuseStatus() {
    if (this.reuse === 'fixed') {
      if (this.quantity === 0) {
        this.toRemove = true;
      }
      this.quantity -= 1;
    } else if (!this.reuse) {
      this.toRemove = true;
    }
  }

  // Function -> Promise
  play(action) {
    this.pending = true;
    this.emitter.emit('MOCK_START');

    return Promise.all(this.tasks.map(part => part.play(action))).then(
      (taskStatuses) => {
        const finished = taskStatuses.every(partFinished => partFinished);

        if (finished) {
          this.updateReuseStatus();
          this.emitter.emit('MOCK_END');
        } else {
          this.emitter.emit('MOCK_CANCEL');
        }

        this.pending = false;
        return finished;
      }
    );
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.tasks.forEach(part => part.cancel());
    }
  }
}
