import { Observable, Subject } from 'rxjs';
import unique from 'cuid';
import Task from './Task';

export default class Mock {
  constructor(scenarioId, config) {
    this.scenarioId = scenarioId;
    this.requirements = config.requirements;
    this.id = unique();
    this.status = 'inactive';
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.tasks = config.tasks.map(taskConfig => new Task(this.id, taskConfig));
    this.status$ = new Subject();

    const taskLifecycles$ = Observable
      .merge(
        ...this.tasks.map(part => part.getStatusChanges()),
        this.tasks.length
      );
    taskLifecycles$.subscribe({
      complete: () => {
        this.runCounter += 1;
        if (this.tasks.every(task => task.status === 'finished')) {
          this.status = 'finished';
          this.status$.next('finished');
        } else {
          this.status = 'cancelled';
          this.status$.next('mock-cancel');
        }

        if (this.runCounter === this.loadedCounter) {
          this.status = 'expired';
          this.status$.next('expired');
          this.status$.complete();
        }
      }
    });
  }

  // start :: void -> Observable
  start() {
    if (this.status === 'pending' && (this.runCounter === this.loadedCounter - 1)) {
      return null;
    }

    const tasks$ = Observable
      .merge(
        ...this.tasks.map(task => task.start()),
        this.tasks.length
      )
      .multicast(new Subject())
      .refCount();
    this.status = 'pending';
    this.status$.next('pending');

    return tasks$;
  }

  // cancel :: void -> void
  cancel() {
    if (this.status === 'pending') {
      this.tasks.forEach(task => task.cancel());
    }
  }

  // getStatusChanges :: void -> Observable
  getStatusChanges() {
    return this.status$
      .map(event => ({
        event,
        payload: {
          mockId: this.mockId,
          scenarioId: this.scenarioId
        }
      }));
  }

  // kill :: void -> void
  kill() {
    if (this.status === 'pending') {
      this.cancel();
      return;
    }

    this.status$.complete();
  }
}
