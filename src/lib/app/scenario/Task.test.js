import { Subscription } from 'rxjs';
import Task from './Task';
import { Emitter } from '../serversManager/emitter';

describe('Task', () => {
  it('should setup emitter', () => {
    const task = new Task({ emitter: new Emitter() });
    expect(task.emitter).toBeInstanceOf(Emitter);
    expect(task.emitter.params.taskId).toEqual(task.id);
  });

  describe('play', () => {
    it('should change pending state if it is not pending yet', () => {
      const task = new Task({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: {
              key: 'value'
            }
          }
        }
      });

      task.play(() => {
      }).then(() => {
        expect(task.pending).toBeTruthy();
      });
    });

    it('should setup functions for canceling if it is not pending yet', () => {
      const task = new Task({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: {
              key: 'value'
            }
          }
        }
      });

      task.play(() => {
      }).then(() => {
        expect(task.subscription).toBeInstanceOf(Subscription);
        expect(task.stop).toBeInstanceOf(Function);
      });
    });

    it('should return rejected promise if is pending', (done) => {
      const task = new Task({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });

      task.pending = true;

      task.play(() => {})
        .catch((reason) => {
          expect(reason).toEqual('Pending Task cant be played.');
        })
        .then(() => {
          done();
        });
    });
  });
  describe('cancel', () => {
    it('should call stop only if mock part is pending', () => {
      const task = new Task({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });
      task.play = function play() {
        this.pending = true;
        this.stop = jest.fn();
      };
      task.play(() => {});
      task.cancel();
      expect(task.stop).toHaveBeenCalled();

      const taskNotPending = new Task({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });
      taskNotPending.stop = jest.fn();
      taskNotPending.cancel();
      expect(taskNotPending.stop).not.toHaveBeenCalled();
    });
  });
});
