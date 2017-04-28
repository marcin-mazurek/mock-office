import { Subscription } from 'rxjs';
import ScenePart from './ScenePart';
import { Emitter } from '../servers-manager/emitter';

describe('ScenePart', () => {
  it('should setup emitter', () => {
    const scenePart = new ScenePart({ emitter: new Emitter() });
    expect(scenePart.emitter).toBeInstanceOf(Emitter);
    expect(scenePart.emitter.params.scenePartId).toEqual(scenePart.id);
  });

  describe('play', () => {
    it('should change pending state if it is not pending yet', () => {
      const scenePart = new ScenePart({
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

      scenePart.play(() => {
      }).then(() => {
        expect(scenePart.pending).toBeTruthy();
      });
    });

    it('should setup functions for canceling if it is not pending yet', () => {
      const scenePart = new ScenePart({
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

      scenePart.play(() => {
      }).then(() => {
        expect(scenePart.subscription).toBeInstanceOf(Subscription);
        expect(scenePart.stop).toBeInstanceOf(Function);
      });
    });

    it('should return rejected promise if is pending', (done) => {
      const scenePart = new ScenePart({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });

      scenePart.pending = true;

      scenePart.play(() => {})
        .catch((reason) => {
          expect(reason).toEqual('Pending ScenePart cant be played.');
        })
        .then(() => {
          done();
        });
    });
  });
  describe('cancel', () => {
    it('should call stop only if scene part is pending', () => {
      const scenePart = new ScenePart({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });
      scenePart.play = function play() {
        this.pending = true;
        this.stop = jest.fn();
      };
      scenePart.play(() => {});
      scenePart.cancel();
      expect(scenePart.stop).toHaveBeenCalled();

      const scenePartNotPending = new ScenePart({
        emitter: new Emitter(),
        scheduleDetails: {
          type: 'immediate',
          payload: {
            headers: { key: 'value' }
          }
        }
      });
      scenePartNotPending.stop = jest.fn();
      scenePartNotPending.cancel();
      expect(scenePartNotPending.stop).not.toHaveBeenCalled();
    });
  });
});
