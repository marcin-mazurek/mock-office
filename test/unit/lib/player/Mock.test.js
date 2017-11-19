import { Observable } from 'rxjs/Rx';
import Mock from '../../../../src/lib/app/player/Mock';

describe('Mock', () => {
  it('should has inactive status', () => {
    expect(new Mock('scenario id', { tasks: [{}] }).status).toEqual('inactive');
  });

  describe('start', () => {
    it('should return null when last run mock is pending', () => {
      const mock = new Mock('scenario-id', { tasks: [{}] });
      mock.start();
      expect(mock.start()).toEqual(null);
    });

    it('should return observable when mock has started', () => {
      const mock = new Mock('scenario-id', { tasks: [{}] });
      expect(mock.start()).toBeInstanceOf(Observable);
    });

    it('should make mock emit status - pending', (done) => {
      const tasks = [{}, {}];
      const mock = new Mock(
        'scenario-id',
        {
          tasks
        }
      );
      mock.status$
        .subscribe((next) => {
          if (next === 'pending') {
            done();
          }
        });
      mock.start();
    });

    describe('when one of tasks has been cancelled', () => {
      it('mock should emit cancel event', (done) => {
        const tasks = [
          {
            schedule: {
              delay: 100
            }
          },
          {}
        ];
        const mock = new Mock(
          'scenario-id',
          {
            tasks
          }
        );
        mock.getStatusChanges()
          .pluck('event')
          .filter(event => event === 'mock-cancel')
          .subscribe((event) => {
            expect(event).toBeTruthy();
            done();
          });
        mock.start();
        mock.tasks[0].cancel();
      });

      it('mock should be in cancelled status', (done) => {
        const tasks = [
          {
            schedule: {
              delay: 100
            }
          },
          {}
        ];
        const mock = new Mock(
          'scenario-id',
          {
            tasks
          }
        );
        mock.getStatusChanges()
          .pluck('event')
          .filter(event => event === 'mock-cancel')
          .subscribe(() => {
            expect(mock.status).toEqual('cancelled');
            done();
          });
        mock.start();
        mock.tasks[0].cancel();
      });
    });

    describe('given that mock has run and has single load', () => {
      it('should complete status changes', (done) => {
        const tasks = [{}, {}];
        const mock = new Mock(
          'scenario-id',
          {
            loadedCounter: 1,
            tasks
          }
        );
        mock.status$
          .subscribe({
            complete: () => {
              done();
            }
          });
        mock.start();
      });

      it('mock should emit status change - expired', (done) => {
        const mock = new Mock(
          'scenario-id',
          { tasks: [{}] }
        );
        mock.status$
          .subscribe((next) => {
            if (next === 'expired') {
              done();
            }
          });
        mock.start();
      });

      it('mock should be in expired status', (done) => {
        const mock = new Mock(
          'scenario-id',
          { tasks: [{}] }
        );
        mock.status$
          .subscribe({
            complete: () => {
              expect(mock.status).toEqual('expired');
              done();
            }
          });
        mock.start();
      });
    });

    describe('mock has run and has more than one load', () => {
      it('mock should be in finished status', (done) => {
        const mock = new Mock(
          'scenario-id',
          {
            tasks: [{}],
            loadedCounter: 2
          }
        );
        mock.status$
          .subscribe((next) => {
            if (next === 'finished') {
              expect(mock.status).toEqual('finished');
              done();
            }
          });
        mock.start();
      });

      it('mock should not complete lifecycle', (done) => {
        const mockComplete = jest.fn();
        const mock = new Mock(
          'scenario-id',
          {
            tasks: [{}],
            loadedCounter: 2
          }
        );
        mock.getStatusChanges()
          .subscribe({
            complete: mockComplete
          });
        mock.start();
        setTimeout(
          () => {
            expect(mockComplete).not.toHaveBeenCalled();
            done();
          },
          100
        );
      });
    });
  });
  describe('cancel', () => {
    describe('given that mock has not started yet', () => {
      describe('it has been called', () => {
        it('should not cancel any task', (done) => {
          const mock = new Mock('scenario-id', {
            tasks: [{}]
          });
          mock.cancel();
          expect(mock.tasks.every(task => task.status !== 'cancelled'));
          done();
        });
      });
    });

    describe('given that mock has started', () => {
      describe('it has been called', () => {
        it('mock should cancel tasks', () => {
          const cancelmock = jest.fn();
          const mock = new Mock('scenario-id', {
            tasks: [{}]
          });
          mock.tasks[0].cancel = cancelmock;
          mock.start();
          mock.cancel();
          expect(cancelmock).toHaveBeenCalled();
        });
      });
    });
  });
  describe('kill', () => {
    it('task lifecycle should complete', (done) => {
      const mock = new Mock('scenario-id', { tasks: [{}] });
      mock.getStatusChanges()
        .subscribe({
          complete: () => {
            done();
          }
        });
      mock.start();
      mock.kill();
    });

    describe('given that mock is pending', () => {
      it('it should cancel mock', () => {
        const mock = new Mock('scenario-id', {
          tasks: [{}]
        });
        const cancelmock = jest.fn();
        mock.cancel = cancelmock;
        mock.start();
        mock.kill();
        expect(cancelmock).toHaveBeenCalled();
      });
    });
  });

  describe(
    `Given that,
    mock emitted status change`,
    () => {
      it('it should add scenario id and mock id to emitting values',
        (done) => {
          const mock = new Mock('scenario-id', { tasks: [{}] });
          mock.getStatusChanges()
            .subscribe(
              (value) => {
                expect(value).toHaveProperty('payload');
                expect(value.payload).toHaveProperty('mockId');
                expect(value.payload).toHaveProperty('scenarioId');
                done();
              }
            );
          mock.start();
        }
      );
    }
  );
});
