import { Observable } from 'rxjs';
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
  play() {
    this.pending = true;
    this.emit('start');

    const tasks$ = Observable.merge(this.tasks.map(part => part.play()));

    const subscription = tasks$.subscribe({
      complete: () => {
        this.pending = false;
        this.stop = null;
        this.emit('end');
      }
    });

    this.stop = subscription.unsubscribe;

    return tasks$;
  }

  // void -> void
  cancel() {
    if (this.pending) {
      this.stop();
      this.emit('cancel');
    }
  }
}
