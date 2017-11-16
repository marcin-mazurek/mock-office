import { Observable } from 'rxjs/Rx';
import Scene from '../../../../src/lib/app/player/Scene';
import Task from '../../../../src/lib/app/player/Task';

describe('Scene', () => {
  it('should has inactive status', () => {
    expect(new Scene('scenario id', { tasks: [{}] }).status).toEqual('inactive');
  });

  describe('start', () => {
    it('should return null when last run scene is pending', () => {
      const scene = new Scene('scenario-id', { tasks: [{}] });
      scene.start();
      expect(scene.start()).toEqual(null);
    });

    it('should return observable when scene has started', () => {
      const scene = new Scene('scenario-id', { tasks: [{}] });
      expect(scene.start()).toBeInstanceOf(Observable);
    });

    it('should make scene emit status - pending', (done) => {
      const tasks = [{}, {}];
      const scene = new Scene(
        'scenario-id',
        {
          tasks
        }
      );
      scene.status$
        .subscribe((next) => {
          if (next === 'pending') {
            done();
          }
        });
      scene.start();
    });

    describe('when one of tasks has been cancelled', () => {
      it('scene should emit cancel event', (done) => {
        const tasks = [
          {
            schedule: {
              delay: 100
            }
          },
          {}
        ];
        const scene = new Scene(
          'scenario-id',
          {
            tasks
          }
        );
        scene.getStatusChanges()
          .pluck('event')
          .filter(event => event === 'scene-cancel')
          .subscribe((event) => {
            expect(event).toBeTruthy();
            done();
          });
        scene.start();
        scene.tasks[0].cancel();
      });

      it('scene should be in cancelled status', (done) => {
        const tasks = [
          {
            schedule: {
              delay: 100
            }
          },
          {}
        ];
        const scene = new Scene(
          'scenario-id',
          {
            tasks
          }
        );
        scene.getStatusChanges()
          .pluck('event')
          .filter(event => event === 'scene-cancel')
          .subscribe(() => {
            expect(scene.status).toEqual('cancelled');
            done();
          });
        scene.start();
        scene.tasks[0].cancel();
      });
    });

    describe('given that scene has run and has single load', () => {
      it('should complete status changes', (done) => {
        const tasks = [{}, {}];
        const scene = new Scene(
          'scenario-id',
          {
            loadedCounter: 1,
            tasks
          }
        );
        scene.status$
          .subscribe({
            complete: () => {
              done();
            }
          });
        scene.start();
      });

      it('scene should emit status change - expired', (done) => {
        const scene = new Scene(
          'scenario-id',
          { tasks: [{}] }
        );
        scene.status$
          .subscribe((next) => {
            if (next === 'expired') {
              done();
            }
          });
        scene.start();
      });

      it('scene should be in expired status', (done) => {
        const scene = new Scene(
          'scenario-id',
          { tasks: [{}] }
        );
        scene.status$
          .subscribe({
            complete: () => {
              expect(scene.status).toEqual('expired');
              done();
            }
          });
        scene.start();
      });
    });

    describe('scene has run and has more than one load', () => {
      it('scene should be in finished status', (done) => {
        const scene = new Scene(
          'scenario-id',
          {
            tasks: [{}],
            loadedCounter: 2
          }
        );
        scene.status$
          .subscribe((next) => {
            if (next === 'finished') {
              expect(scene.status).toEqual('finished');
              done();
            }
          });
        scene.start();
      });

      it('scene should not complete lifecycle', (done) => {
        const sceneComplete = jest.fn();
        const scene = new Scene(
          'scenario-id',
          {
            tasks: [{}],
            loadedCounter: 2
          }
        );
        scene.getStatusChanges()
          .subscribe({
            complete: sceneComplete
          });
        scene.start();
        setTimeout(
          () => {
            expect(sceneComplete).not.toHaveBeenCalled();
            done();
          },
          100
        );
      });
    });
  });
  describe('cancel', () => {
    describe('given that scene has not started yet', () => {
      describe('it has been called', () => {
        it('should not cancel any task', (done) => {
          const scene = new Scene('scenario-id', {
            tasks: [{}]
          });
          scene.cancel();
          expect(scene.tasks.every(task => task.status !== 'cancelled'));
          done();
        });
      });
    });

    describe('given that scene has started', () => {
      describe('it has been called', () => {
        it('scene should cancel tasks', () => {
          const cancelScene = jest.fn();
          const scene = new Scene('scenario-id', {
            tasks: [{}]
          });
          scene.tasks[0].cancel = cancelScene;
          scene.start();
          scene.cancel();
          expect(cancelScene).toHaveBeenCalled();
        });
      });
    });
  });
  describe('kill', () => {
    it('task lifecycle should complete', (done) => {
      const scene = new Scene('scenario-id', { tasks: [{}] });
      scene.getStatusChanges()
        .subscribe({
          complete: () => {
            done();
          }
        });
      scene.start();
      scene.kill();
    });

    describe('given that scene is pending', () => {
      it('it should cancel scene', () => {
        const scene = new Scene('scenario-id', {
          tasks: [{}]
        });
        const cancelScene = jest.fn();
        scene.cancel = cancelScene;
        scene.start();
        scene.kill();
        expect(cancelScene).toHaveBeenCalled();
      });
    });
  });

  describe(
    `Given that,
    scene emitted status change`,
    () => {
      it('it should add scenario id and scene id to emitting values',
        (done) => {
          const scene = new Scene('scenario-id', { tasks: [{}] });
          scene.getStatusChanges()
            .subscribe(
              (value) => {
                expect(value).toHaveProperty('payload');
                expect(value.payload).toHaveProperty('sceneId');
                expect(value.payload).toHaveProperty('scenarioId');
                done();
              }
            );
          scene.start();
        }
      );
    }
  );
});
