import EventEmitter from 'events';
import unique from 'cuid';
import Task from './Task';

export default class Mock extends EventEmitter {
  constructor(config) {
    super();
    this.requirements = config.requirements;
    this.id = unique();
    this.tasks = [];
    this.pending = false;
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.tasks = config.tasks.map(taskConfig => new Task(taskConfig));
    this.expired = false;
  }

  // void -> void
  updateReuseStatus() {
    this.runCounter += 1;
    if (this.runCounter === this.loadedCounter) {
      this.expired = true;
      this.emit('expire');
    }
  }

  // Function -> Promise
  play(action) {
    this.pending = true;
    this.emit('start');

    return Promise.all(this.tasks.map(part => part.play(action))).then(
      (taskStatuses) => {
        const finished = taskStatuses.every(partFinished => partFinished);

        if (finished) {
          this.emit('end');
          this.updateReuseStatus();
        } else {
          this.emit('cancel');
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
