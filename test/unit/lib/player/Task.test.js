import { Observable, Subject } from 'rxjs';
import Task from '../../../../src/lib/app/player/Task';

describe('Task', () => {
  it('it should be in inactive status', () => {
    const task = new Task('scene-id', {});
    expect(task.status).toEqual('inactive');
  });

  describe('start', () => {
    it('should return schedule observable', () => {
      const task = new Task('scene-id', {});
      expect(task.start()).toBeInstanceOf(Observable);
    });

    it('should make status$ emit scheduled status',
      (done) => {
        const task = new Task('scene-id', {});
        task.status$.subscribe((next) => {
          if (next === 'scheduled') {
            done();
          }
        });
        task.start();
      }
    );

    it('it should change task status to scheduled', () => {
      const task = new Task('scene-id', {});
      task.start();
      expect(task.status).toEqual('scheduled');
    });
  });

  describe('cancel', () => {
    describe(
      `Given that,
      task is pending`,
      () => {
        it('it should make status$ emit cancelled',
          (done) => {
            const task = new Task('scene-id', {});
            task.status$.subscribe((next) => {
              if (next === 'cancelled') {
                done();
              }
            });
            task.start();
            task.cancel();
          }
        );

        it('should change task status to cancelled', () => {
          const task = new Task('scene-id', {});
          task.start();
          task.cancel();
          expect(task.status).toEqual('cancelled');
        });
      }
    );
  });

  describe('getStatusChanges', () => {
    it('should return subject which contains relevant data',
      (done) => {
        const task = new Task('scene-id', {});
        const statusChanges$ = task.getStatusChanges();
        expect(statusChanges$).toBeInstanceOf(Subject);

        statusChanges$.subscribe((event) => {
          expect(event).toHaveProperty('taskId');
          expect(event).toHaveProperty('sceneId');
          expect(event).toHaveProperty('status');
          done();
        });
        statusChanges$.next('status');
      }
    );
  });

  describe('kill', () => {
    describe('given that task is scheduled', () => {
      it('should cancel task', (done) => {
        const task = new Task('scene-id', {});
        task.status$.subscribe((next) => {
          if (next === 'cancelled') {
            done();
          }
        });
        task.start();
        task.kill();
      });
    });

    it('should end stream of status change', (done) => {
      const task = new Task('scene-id', {});
      task.status$.subscribe({
        complete: () => {
          done();
        }
      });
      task.kill();
    });
  });

  describe(
    `Given that,
    task emitted status change`,
    () => {
      it('should add scene id and task id to emitting values',
        (done) => {
          const task = new Task('scene-id', {});
          task.getStatusChanges()
            .subscribe(
              (value) => {
                expect(value).toHaveProperty('status');
                expect(value).toHaveProperty('sceneId');
                expect(value).toHaveProperty('taskId');
                done();
              }
            );
          task.start();
        }
      );
    }
  );

  describe('schedule', () => {
    it('should returns observable', () => {
      expect(Task.schedule({}, {})).toBeInstanceOf(Observable);
    });
  });
});
