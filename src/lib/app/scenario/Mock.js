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

  // Function -> Observable | String
  play() {
    if (this.pending && (this.runCounter === this.loadedCounter - 1)) {
      return 'Last mock run pending';
    }

    this.pending = true;
    this.emit('start');
    const tasks$ = Observable.merge(this.tasks.map(part => part.play())).mergeAll();
    this.subscription = tasks$.subscribe({
      complete: () => {
        this.runCounter += 1;
        this.emit('end');
        this.pending = false;
        this.stop = null;

        if (this.runCounter === this.loadedCounter) {
          this.expired = true;
          this.emit('expire');
        }
      }
    });

    return tasks$;
  }

  // void -> void
  cancel() {
    if (this.pending) {
      if (this.subscription) {
        this.tasks.forEach(task => task.cancel());
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      this.pending = false;
      this.emit('cancel');
    }
  }
}
