import unique from 'cuid';
import Task from './Task';

export default class Mock {
  constructor(config, emitter) {
    this.requirements = config.requirements;
    this.id = unique();
    this.emitter = emitter.extend({ mockId: this.id });
    this.tasks = [];
    this.pending = false;
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.tasks = config.tasks.map(
      taskConfig => new Task(
        taskConfig,
        this.emitter
      )
    );
  }

  // void -> void
  updateReuseStatus() {
    this.runCounter += 1;
    if (this.runCounter === this.loadedCounter) {
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
